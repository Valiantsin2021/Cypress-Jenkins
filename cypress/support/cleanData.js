const USER_NAME = Cypress.env('local.admin.username')
const PORT = Cypress.env('local.port')
const HOST = Cypress.env('local.host')
const TOKEN = Cypress.env('local.admin.token')
class JenkinsProjectManager {
  constructor(baseUrl, username, apiToken) {
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
    this.username = username
    this.apiToken = apiToken
    this.csrfCrumb = null
  }

  #getAuthHeader() {
    return `Basic ${btoa(`${this.username}:${this.apiToken}`)}`
  }

  async #getCsrfCrumb() {
    if (this.csrfCrumb) return this.csrfCrumb
    try {
      const response = await fetch(`${this.baseUrl}crumbIssuer/api/json`, {
        headers: {
          Authorization: this.#getAuthHeader()
        }
      })
      if (!response.ok) throw new Error('Failed to retrieve CSRF crumb')
      const data = await response.json()
      this.csrfCrumb = {
        name: data.crumbRequestField,
        value: data.crumb
      }
      return this.csrfCrumb
    } catch (error) {
      console.error('CSRF crumb retrieval failed:', error)
      this.csrfCrumb = null
      throw error
    }
  }

  async #listResource(resourceType) {
    const endpoints = {
      jobs: 'api/json?depth=1',
      views: 'api/json?depth=1',
      nodes: 'computer/api/json'
    }
    const response = await fetch(`${this.baseUrl}${endpoints[resourceType]}`, {
      headers: {
        Authorization: this.#getAuthHeader()
      }
    })

    if (!response.ok) throw new Error(`Failed to list ${resourceType}`)

    const data = await response.json()

    switch (resourceType) {
      case 'jobs':
        return data.jobs.map(job => job.name)
      case 'views':
        return data.views.map(view => view.name).filter(view => view !== 'all')
      case 'nodes':
        return data.computer
          .filter(node => node.displayName !== 'Built-In Node')
          .map(node => node.displayName)
      default:
        throw new Error(`Unsupported resource type: ${resourceType}`)
    }
  }

  async #deleteResource(resourceType, resourceName) {
    const csrfCrumb = await this.#getCsrfCrumb()
    const deleteUrl = `${this.baseUrl}${resourceType}/${encodeURIComponent(resourceName)}/doDelete`

    const response = await fetch(deleteUrl, {
      method: 'POST',
      headers: {
        Authorization: this.#getAuthHeader(),
        [csrfCrumb.name]: csrfCrumb.value
      }
    })

    if (!response.ok)
      throw new Error(`Failed to delete ${resourceType}: ${resourceName}`)

    console.log(`Successfully deleted ${resourceType}: ${resourceName}`)
    return `Successfully deleted ${resourceType}: ${resourceName}`
  }

  async deleteAllResources(resourceType, testResources = null) {
    try {
      const resources =
        testResources || (await this.#listResource(resourceType + 's'))

      const deletionResults = await Promise.allSettled(
        resources.map(resource => this.#deleteResource(resourceType, resource))
      )

      return deletionResults.map((result, index) => {
        const resourceName = resources[index]
        if (result.status === 'fulfilled') {
          return result.value
        } else {
          console.error(
            `${resourceType} ${resourceName} deletion failed:`,
            result.reason
          )
          return result.reason.message
        }
      })
    } catch (error) {
      console.error(`Bulk ${resourceType} deletion failed:`, error)
      throw error
    }
  }

  deleteAllJobs = testJobs => this.deleteAllResources('job', testJobs)
  deleteAllViews = testViews => this.deleteAllResources('view', testViews)
  deleteAllNodes = testNodes => this.deleteAllResources('node', testNodes)
}

Cypress.Commands.add(
  'cleanData',
  (testJobs, testViews, testNodes, all = false) => {
    const jenkinsManager = new JenkinsProjectManager(
      `http://${HOST}:${PORT}/`,
      USER_NAME,
      TOKEN
    )

    const deletionPromises = [
      ...(testJobs ? [jenkinsManager.deleteAllJobs(testJobs)] : []),
      ...(testViews ? [jenkinsManager.deleteAllViews(testViews)] : []),
      ...(testNodes ? [jenkinsManager.deleteAllNodes(testNodes)] : []),
      ...(all
        ? [
            jenkinsManager.deleteAllJobs(),
            jenkinsManager.deleteAllViews(),
            jenkinsManager.deleteAllNodes()
          ]
        : [])
    ]

    return Promise.all(deletionPromises)
      .then(results => {
        Cypress.log({
          name: 'Bulk Deletion Complete',
          message: results.flat().filter(Boolean)
        })
      })
      .catch(error => {
        Cypress.log({
          name: 'Bulk Deletion Failed',
          message: error
        })
        throw error
      })
  }
)
