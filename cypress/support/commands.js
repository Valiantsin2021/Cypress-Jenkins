import '@testing-library/cypress/add-commands'

const USER_NAME = Cypress.env('local.admin.username')
const PORT = Cypress.env('local.port')
const HOST = Cypress.env('local.host')
const TOKEN = Cypress.env('local.admin.token')
class JenkinsProjectManager {
  /**
   * Create a new Jenkins Project Manager instance
   * @param {string} baseUrl - The base URL of the Jenkins server
   * @param {string} username - Jenkins username for authentication
   * @param {string} apiToken - Jenkins API token for authentication
   */
  constructor(baseUrl, username, apiToken) {
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
    this.username = username
    this.apiToken = apiToken
    this.csrfCrumb = null
  }

  /**
   * Generate a Base64 encoded Basic Authentication header
   * @returns {string} Base64 encoded authentication header
   * @private
   */
  #getAuthHeader() {
    return `Basic ${btoa(`${this.username}:${this.apiToken}`)}`
  }

  /**
   * Retrieve CSRF crumb for secure API requests
   * @returns {Promise<{name: string, value: string}>} CSRF crumb details
   * @throws {Error} If CSRF crumb retrieval fails
   * @private
   */
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

  /**
   * List resources of a specific type from Jenkins
   * @param {string} resourceType - Type of resource to list (jobs, views, or nodes)
   * @returns {Promise<string[]>} Array of resource names
   * @throws {Error} If listing resources fails or unsupported resource type
   * @private
   */
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

  /**
   * Delete a specific resource from Jenkins
   * @param {string} resourceType - Type of resource to delete (job, view, or node)
   * @param {string} resourceName - Name of the resource to delete
   * @returns {Promise<string>} Deletion success message
   * @throws {Error} If resource deletion fails
   * @private
   */
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

  /**
   * Delete all resources of a specific type
   * @param {string} resourceType - Type of resource to bulk delete (job, view, or node)
   * @param {string[]} [testResources=null] - Optional array of specific resources to delete
   * @returns {Promise<string[]>} Array of deletion results (success or error messages)
   * @throws {Error} If bulk deletion fails
   */
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

  /**
   * Delete all Jenkins jobs
   * @param {string[]} [testJobs=null] - Optional array of specific jobs to delete
   * @returns {Promise<string[]>} Array of job deletion results
   */
  deleteAllJobs = testJobs => this.deleteAllResources('job', testJobs)

  /**
   * Delete all Jenkins views
   * @param {string[]} [testViews=null] - Optional array of specific views to delete
   * @returns {Promise<string[]>} Array of view deletion results
   */
  deleteAllViews = testViews => this.deleteAllResources('view', testViews)

  /**
   * Delete all Jenkins nodes
   * @param {string[]} [testNodes=null] - Optional array of specific nodes to delete
   * @returns {Promise<string[]>} Array of node deletion results
   */
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

Cypress.Commands.overwrite('log', (log, message, ...args) => {
  log(message, ...args)
  cy.task('print', [message, ...args].join(', '), { log: false })
})
