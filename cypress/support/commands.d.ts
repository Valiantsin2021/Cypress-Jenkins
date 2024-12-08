declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to clean up test data in Jenkins
     * @param {string[]} resources - Array of resources to delete
     * @param {boolean} [all=false] - Flag to delete all jobs, views, and nodes if set to true
     * @returns {Promise<void>} - Promise that resolves when all data has been cleaned up
     * @example
     * // Clean up specific jobs, views, and nodes
     * cy.cleanData(['job1', 'job2', 'view1', 'node1', 'node2'])
     * @example
     * // Clean up all jobs, views, and nodes
     * cy.cleanData(null, true)
     */
    cleanData(resources: string[], all = false): Promise<void>
    /**
     * Custom command to print to console log
     * @example cy.print({ foo: 'bar' })
     */
    print(object: object): void
  }
}
