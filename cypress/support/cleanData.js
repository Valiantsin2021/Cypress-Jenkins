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
    async getAllJobs() {
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

    async deleteJob(jobName) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open(
          'POST',
          `${this.baseUrl}job/${encodeURIComponent(jobName)}/doDelete`,
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
            resolve(`Successfully deleted job: ${jobName}`)
          } else {
            reject(
              new Error(
                `Failed to delete job: ${jobName}. Status: ${xhr.status}`
              )
            )
          }
        }

        xhr.onerror = () =>
          reject(new Error(`Network error deleting project: ${jobName}`))
        xhr.send()
      })
    }

    async deleteAllJobs() {
      try {
        await this.getCsrfCrumb()

        const jobs = await this.getAllJobs()

        const deletionResults = []
        for (const job of jobs) {
          try {
            const result = await this.deleteJob(job)
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

  const initiateBulkDeletion = function () {
    const jenkinsManager = new JenkinsProjectManager(
      `http://${HOST}:${PORT}/`,
      USER_NAME,
      TOKEN
    )

    jenkinsManager
      .deleteAllJobs()
      .then(results => {
        console.log('Bulk Deletion Complete', results)
      })
      .catch(error => {
        console.error('Bulk Deletion Failed', error)
      })
  }
  initiateBulkDeletion()
})
