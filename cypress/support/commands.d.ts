type MetricsOptions = {
  startMark?: keyof PerformanceTiming // Default: 'navigationStart'
  endMark?: keyof PerformanceTiming // Default: 'loadEventEnd'
  timeout?: number // Timeout in milliseconds (default: 10000)
  initialDelay?: number // Initial delay in milliseconds (default: 1000)
  retryTimeout?: number // Retry timeout in milliseconds (default: 5000)
}

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to clean up test data in Jenkins
     * @param {string[]} resources - Array of resources to delete
     * @param {boolean} [all=false] - Flag to delete all jobs, views, and nodes if set to true
     * @returns {Promise<void>} - Promise that resolves when all data has been cleaned up
     * @example
     * // Clean up specific jobs, views, and nodes
     * cy.cleanData(['job1', 'job2', 'view1', 'node1', 'node2', 'user1'])
     * @example
     * // Clean up all jobs, views, and nodes
     * cy.cleanData(null, true)
     */
    cleanData(resources: string[], all: boolean): Promise<void>
    /**
     * Custom command to print to console log
     * @example cy.print({ foo: 'bar' })
     */
    print(object: object): void
    /**
     * Creates a new item of a specific type.
     *
     * @param itemName - The name of the item to create.
     * @param itemType - The type of item to create.
     *
     * @example
     * cy.createItemByType('My New Item', 'Job');
     */
    createItemByType(itemName: string, itemType: string): Chainable<void>
    /**
     * Logs in to the application with the provided credentials.
     *
     * @param userName - The username to use for login. Defaults to `USERNAME`.
     * @param pass - The password to use for login. Defaults to `PASSWORD`.
     *
     * @example
     * cy.login('myuser', 'mypassword');
     */
    login(userName?: string, pass?: string): Chainable<void>
  }
}
