const USER_NAME = Cypress.env('local.admin.username')
const PORT = Cypress.env('local.port')
const HOST = Cypress.env('local.host')
const TOKEN = Cypress.env('local.admin.token')
Cypress.Commands.add('cleanData', () => {
  class JenkinsProjectManager {
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

        // Basic authentication
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
    async getAllProjects() {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('GET', `${this.baseUrl}api/json?depth=1`, true)
        xhr.setRequestHeader(
          'Authorization',
          'Basic ' + btoa(`${this.username}:${this.apiToken}`)
        )

        xhr.onload = () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText)
            const jobNames = response.jobs.map(job => job.name)
            resolve(jobNames)
          } else {
            reject(new Error('Failed to retrieve project list'))
          }
        }

        xhr.onerror = () =>
          reject(new Error('Network error retrieving projects'))
        xhr.send()
      })
    }

    async deleteProject(projectName) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open(
          'POST',
          `${this.baseUrl}job/${encodeURIComponent(projectName)}/doDelete`,
          true
        )

        // Basic authentication
        xhr.setRequestHeader(
          'Authorization',
          'Basic ' + btoa(`${this.username}:${this.apiToken}`)
        )

        // Add CSRF protection header if crumb was retrieved
        if (this.csrfCrumb) {
          xhr.setRequestHeader(this.csrfCrumb.name, this.csrfCrumb.value)
        }

        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 302) {
            resolve(`Successfully deleted project: ${projectName}`)
          } else {
            reject(
              new Error(
                `Failed to delete project: ${projectName}. Status: ${xhr.status}`
              )
            )
          }
        }

        xhr.onerror = () =>
          reject(new Error(`Network error deleting project: ${projectName}`))
        xhr.send()
      })
    }

    async deleteAllProjects() {
      try {
        // First, get CSRF crumb
        await this.getCsrfCrumb()

        // Then get all projects
        const projects = await this.getAllProjects()

        // Delete projects sequentially
        const deletionResults = []
        for (const project of projects) {
          try {
            const result = await this.deleteProject(project)
            deletionResults.push(result)
            console.log(result)
          } catch (error) {
            console.error(error)
            deletionResults.push(error.message)
          }
        }

        return deletionResults
      } catch (error) {
        console.error('Bulk deletion failed:', error)
        throw error
      }
    }
  }

  function initiateBulkDeletion() {
    // Replace with your Jenkins instance details
    const jenkinsManager = new JenkinsProjectManager(
      `http://${HOST}:${PORT}/`,
      USER_NAME,
      TOKEN
    )

    jenkinsManager
      .deleteAllProjects()
      .then(results => {
        console.log('Bulk Deletion Complete', results)
      })
      .catch(error => {
        console.error('Bulk Deletion Failed', error)
      })
  }
  initiateBulkDeletion()
})
