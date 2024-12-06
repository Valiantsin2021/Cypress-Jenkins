const USER_NAME = Cypress.env('local.admin.username')
const PORT = Cypress.env('local.port')
const HOST = Cypress.env('local.host')
const TOKEN = Cypress.env('local.admin.token')
export class JenkinsProjectManager {
  constructor(baseUrl, username, apiToken) {
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'
    this.username = username
    this.apiToken = apiToken
    this.csrfCrumb = null
  }

  async getCsrfCrumb() {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('GET', `${this.baseUrl}crumbIssuer/api/json`, true)

      xhr.setRequestHeader(
        'Authorization',
        'Basic ' + btoa(`${this.username}:${this.apiToken}`)
      )

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText)
          this.csrfCrumb = {
            name: response.crumbRequestField,
            value: response.crumb
          }
          resolve(this.csrfCrumb)
        } else {
          reject(new Error('Failed to retrieve CSRF crumb'))
        }
      }

      xhr.onerror = () =>
        reject(new Error('Network error retrieving CSRF crumb'))
      xhr.send()
    })
  }
  async makeJenkinsApiRequest(endpoint, extractionCallback, errorMessage) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      const url = endpoint.startsWith('computer')
        ? `${this.baseUrl}${endpoint}`
        : `${this.baseUrl}api/json?depth=1`

      xhr.open('GET', url, true)
      xhr.setRequestHeader(
        'Authorization',
        'Basic ' + btoa(`${this.username}:${this.apiToken}`)
      )

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText)
          const extractedData = extractionCallback(response)
          resolve(extractedData)
        } else {
          reject(new Error(errorMessage))
        }
      }

      xhr.onerror = () => reject(new Error(`Network error ${errorMessage}`))
      xhr.send()
    })
  }
  async getAllJobs() {
    return this.makeJenkinsApiRequest(
      'api/json?depth=1',
      response => response.jobs.map(job => job.name),
      'Failed to retrieve project list'
    )
  }
  async getAllViews() {
    return this.makeJenkinsApiRequest(
      'api/json?depth=1',
      response => response.views.map(view => view.name),
      'Failed to retrieve views list'
    )
  }
  async getAllNodes() {
    return this.makeJenkinsApiRequest(
      'computer/api/json',
      response =>
        response.computer
          .filter(node => node.displayName !== 'Built-In Node')
          .map(node => node.displayName),
      'Failed to retrieve nodes list'
    )
  }
  async makeJenkinsDeleteRequest(resourceType, resourceName) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open(
        'POST',
        `${this.baseUrl}${resourceType}/${encodeURIComponent(resourceName)}/doDelete`,
        true
      )

      xhr.setRequestHeader(
        'Authorization',
        'Basic ' + btoa(`${this.username}:${this.apiToken}`)
      )

      if (this.csrfCrumb) {
        xhr.setRequestHeader(this.csrfCrumb.name, this.csrfCrumb.value)
      }

      xhr.onload = () => {
        if (xhr.status === 200 || xhr.status === 302) {
          resolve(`Successfully deleted ${resourceType}: ${resourceName}`)
        } else {
          reject(
            new Error(
              `Failed to delete ${resourceType}: ${resourceName}. Status: ${xhr.status}`
            )
          )
        }
      }

      xhr.onerror = () =>
        reject(
          new Error(`Network error deleting ${resourceType}: ${resourceName}`)
        )
      xhr.send()
    })
  }
  async deleteJob(jobName) {
    return this.makeJenkinsDeleteRequest('job', jobName)
  }
  async deleteAllJobs(testJobs = null) {
    try {
      await this.getCsrfCrumb()
      const jobs = testJobs || (await this.getAllJobs())

      const deletionResults = await Promise.allSettled(
        jobs.map(job => this.deleteJob(job))
      )

      return deletionResults.map((result, index) => {
        const jobName = jobs[index]
        if (result.status === 'fulfilled') {
          console.log(`Job ${jobName} deleted successfully`)
          return result.value
        } else {
          console.error(`Job ${jobName} deletion failed:`, result.reason)
          return result.reason.message
        }
      })
    } catch (error) {
      console.error('Bulk deletion failed:', error)
      throw error
    }
  }
  async deleteView(viewName) {
    return this.makeJenkinsDeleteRequest('view', viewName)
  }
  async deleteAllViews(testViews = null) {
    try {
      await this.getCsrfCrumb()
      const views = (testViews || (await this.getAllViews())).filter(
        view => view !== 'all'
      )

      const deletionResults = await Promise.allSettled(
        views.map(view => this.deleteView(view))
      )

      return deletionResults.map((result, index) => {
        const viewName = views[index]
        if (result.status === 'fulfilled') {
          console.log(`View ${viewName} deleted successfully`)
          return result.value
        } else {
          console.error(`View ${viewName} deletion failed:`, result.reason)
          return result.reason.message
        }
      })
    } catch (error) {
      console.error('Bulk view deletion failed:', error)
      throw error
    }
  }
  async deleteNode(nodeName) {
    return this.makeJenkinsDeleteRequest('computer', nodeName)
  }
  async deleteAllNodes(testNodes = null) {
    try {
      await this.getCsrfCrumb()
      const nodes = testNodes || (await this.getAllNodes())

      const deletionResults = await Promise.allSettled(
        nodes.map(node => this.deleteNode(node))
      )

      return deletionResults.map((result, index) => {
        const nodeName = nodes[index]
        if (result.status === 'fulfilled') {
          console.log(`Node ${nodeName} deleted successfully`)
          return result.value
        } else {
          console.error(`Node ${nodeName} deletion failed:`, result.reason)
          return result.reason.message
        }
      })
    } catch (error) {
      console.error('Bulk node deletion failed:', error)
      throw error
    }
  }
}

Cypress.Commands.add(
  'cleanData',
  (testJobs, testViews, testNodes, all = false) => {
    const initiateBulkDeletion = function (testJobs, testViews, testNodes) {
      const jenkinsManager = new JenkinsProjectManager(
        `http://${HOST}:${PORT}/`,
        USER_NAME,
        TOKEN
      )
      const deletionPromises = []
      if (testJobs) {
        deletionPromises.push(jenkinsManager.deleteAllJobs(testJobs))
      }
      if (testViews) {
        deletionPromises.push(jenkinsManager.deleteAllViews(testViews))
      }
      if (testNodes) {
        deletionPromises.push(jenkinsManager.deleteAllNodes(testNodes))
      }
      if (all) {
        deletionPromises.push(jenkinsManager.deleteAllJobs())
        deletionPromises.push(jenkinsManager.deleteAllViews())
        deletionPromises.push(jenkinsManager.deleteAllNodes())
      }
      Promise.all(deletionPromises)
        .then(results => {
          Cypress.log({
            name: 'Bulk Deletion Complete: ',
            message: results.flat()
          })
        })
        .catch(error => {
          Cypress.log({
            name: 'Bulk Deletion Failed: ',
            message: error
          })
        })
    }
    initiateBulkDeletion(testJobs, testViews, testNodes)
  }
)
