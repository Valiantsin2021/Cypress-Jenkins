declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to clean up test data in Jenkins
     * @param {string[]} testJobs - Array of job names to delete
     * @param {string[]} testViews - Array of view names to delete
     * @param {string[]} testNodes - Array of node names to delete
     * @param {boolean} [all=false] - Flag to delete all jobs, views, and nodes if set to true
     * @returns {Promise<void>} - Promise that resolves when all data has been cleaned up
     * @example
     * // Clean up specific jobs, views, and nodes
     * cy.cleanData(['job1', 'job2'], ['view1', 'view2'], ['node1', 'node2'])
     * @example
     * // Clean up all jobs, views, and nodes
     * cy.cleanData(null, null, null, true)
     * @example
     * // Clean up specific jobs and views, but not nodes
     * cy.cleanData(['job1', 'job2'], ['view1', 'view2'])
     */
    cleanData(
      testJobs: string[],
      testViews: string[],
      testNodes: string[],
      all = false
    ): Promise<void>
    /**
     * Custom command to print to console log
     * @example cy.print({ foo: 'bar' })
     */
    print(object: object): void
  }
}
