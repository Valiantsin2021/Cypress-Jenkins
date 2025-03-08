/* eslint-disable no-undef */
import '@testing-library/cypress/add-commands'

import newJobPageData from '../fixtures/newJobPageData.json'
import DashboardPage from '../pageObjects/DashboardPage'
import NewJobPage from '../pageObjects/NewJobPage'

const dashBoardPage = new DashboardPage()
const newJobPage = new NewJobPage()
const USER_NAME = Cypress.env('local.admin.username')
const PORT = Cypress.env('local.port')
const HOST = Cypress.env('local.host')
const TOKEN = Cypress.env('local.admin.token')
const PASSWORD = Cypress.env('local.admin.password')
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
   * Determine the resource type for a given resource name
   * @param {string} resourceName - Name of the resource
   * @returns {Promise<string>} Resource type (job, view, node, or user)
   * @private
   */
  async #determineResourceType(resourceName) {
    const resourceTypes = ['jobs', 'views', 'nodes']

    for (const type of resourceTypes) {
      const resources = await this.#listResource(type)
      if (resources.includes(resourceName)) {
        return type.slice(0, -1)
      }
    }
    return 'user'
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
        return data.computer.filter(node => node.displayName !== 'Built-In Node').map(node => node.displayName)
      default:
        throw new Error(`Unsupported resource type: ${resourceType}`)
    }
  }

  /**
   * Delete a specific resource from Jenkins
   * @param {string} resourceType - Type of resource to delete (job, view, node, or user)
   * @param {string} resourceName - Name of the resource to delete
   * @returns {Promise<string>} Deletion success message
   * @throws {Error} If resource deletion fails
   * @private
   */
  async #deleteResource(resourceType, resourceName) {
    const csrfCrumb = await this.#getCsrfCrumb()
    let deleteUrl
    switch (resourceType) {
      case 'user':
        deleteUrl = `${this.baseUrl}manage/securityRealm/user/${encodeURIComponent(resourceName)}/doDelete`
        break
      default:
        deleteUrl = `${this.baseUrl}${resourceType}/${encodeURIComponent(resourceName)}/doDelete`
    }

    const response = await fetch(deleteUrl, {
      method: 'POST',
      headers: {
        Authorization: this.#getAuthHeader(),
        [csrfCrumb.name]: csrfCrumb.value
      }
    })
    if (response.ok) {
      console.log(`Successfully deleted ${resourceType}: ${resourceName}`)
      return `Successfully deleted ${resourceType}: ${resourceName}`
    }
  }

  /**
   * Delete all resources or specific resources
   * @param {string[]} [resources=null] - Optional array of specific resources to delete
   * @param {boolean} [deleteAll=false] - Flag to delete all resources of all types
   * @returns {Promise<string[]>} Array of deletion results (success or error messages)
   * @throws {Error} If deletion fails
   */
  async deleteResources(resources = null, deleteAll = false) {
    try {
      if (deleteAll) {
        const allResourceTypes = ['jobs', 'views', 'nodes']
        const deletionResults = await Promise.allSettled(
          allResourceTypes.map(type => this.deleteAllResourcesOfType(type))
        )

        return deletionResults.flatMap((result, index) => {
          const resourceType = allResourceTypes[index]
          if (result.status === 'fulfilled') {
            return result.value
          } else {
            console.error(`${resourceType} deletion failed:`, result.reason)
            return result.reason.message
          }
        })
      }
      if (!resources || resources.length === 0) {
        return []
      }
      const deletionResults = await Promise.allSettled(
        resources.map(async resource => {
          const resourceType = await this.#determineResourceType(resource)
          return this.#deleteResource(resourceType, resource)
        })
      )

      return deletionResults.map((result, index) => {
        const resourceName = resources[index]
        if (result.status === 'fulfilled') {
          return result.value
        } else {
          console.error(`Resource ${resourceName} deletion failed:`, result.reason)
          return result.reason.message
        }
      })
    } catch (error) {
      console.error('Resource deletion failed:', error)
      throw error
    }
  }

  /**
   * Delete all resources of a specific type
   * @param {string} resourceType - Type of resource to bulk delete (jobs, views, or nodes)
   * @returns {Promise<string[]>} Array of deletion results
   * @private
   */
  async deleteAllResourcesOfType(resourceType) {
    const resources = await this.#listResource(resourceType)

    const deletionResults = await Promise.allSettled(
      resources.map(resource => this.#deleteResource(resourceType.slice(0, -1), resource))
    )

    return deletionResults.map((result, index) => {
      const resourceName = resources[index]
      if (result.status === 'fulfilled') {
        return result.value
      } else {
        console.error(`${resourceType} ${resourceName} deletion failed:`, result.reason)
        return result.reason.message
      }
    })
  }
}

// Cypress command for clean data
Cypress.Commands.add('cleanData', (resources, all = false) => {
  const jenkinsManager = new JenkinsProjectManager(`http://${HOST}:${PORT}/`, USER_NAME, TOKEN)

  return jenkinsManager
    .deleteResources(resources, all)
    .then(results => {
      Cypress.log({
        name: 'Bulk Deletion Complete',
        message: results.filter(Boolean)
      })
    })
    .catch(error => {
      Cypress.log({
        name: 'Bulk Deletion Failed',
        message: error
      })
      throw error
    })
})
/**
 * Overwrites the default `log` command to also print the message to the terminal.
 *
 * @param {function} log - The original `log` function.
 * @param {string} message - The message to log.
 * @param {...*} args - Additional arguments to log.
 *
 * @example
 * cy.log('Hello, world!')
 */
Cypress.Commands.overwrite('log', (log, message, ...args) => {
  log(message, ...args)
  cy.task('print', [message, ...args].join(', '), { log: false })
})
/**
 * Logs in to the application with the provided credentials.
 *
 * @param {string} [userName=USERNAME] - The username to use for login.
 * @param {string} [pass=PASSWORD] - The password to use for login.
 *
 * @example
 * cy.login('myuser', 'mypassword')
 */
Cypress.Commands.add('login', (userName = USERNAME, pass = PASSWORD) => {
  cy.intercept('POST', '/j_spring_security_check').as('security_check')

  cy.visit(`http://${HOST}:${PORT}/login`)
  cy.get('#j_username').type(userName)
  cy.get('input[name="j_password"]').type(pass)
  cy.get('button[name="Submit"]').click()
  cy.wait('@security_check')
})
/**
 * Creates a new item of a specific type.
 *
 * @param {string} itemName - The name of the item to create.
 * @param {string} itemType - The type of item to create.
 *
 * @example
 * cy.createItemByType('My New Item', 'Job')
 */
Cypress.Commands.add('createItemByType', (itemName, itemType) => {
  dashBoardPage.clickNewItemMenuLink()
  newJobPage.clearItemNameField().typeNewItemName(`${itemName}`).getAllItemsList().contains(itemType).click()
  newJobPage.clickOKButton().clickSaveButton()
  let endPoint = itemName.replace(/ /g, '%20')
  cy.url().should('contain', `${endPoint}`)
})
/**
 * Retrieves the crumb token for the specified base URL.
 *
 * @param {string} baseUrl - The base URL for the application.
 * @returns {Cypress.Chainable} - The crumb token and crumb field.
 */
Cypress.Commands.add('getCrumbToken', baseUrl =>
  cy
    .request({
      method: 'GET',
      url: `${baseUrl}/${newJobPageData.getCrumbEndpoint}`,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      expect(response.status).to.eq(200)
      return {
        crumb: response.body.crumb,
        crumbField: response.body.crumbRequestField
      }
    })
)
