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
     * cy.cleanData(['job1', 'job2', 'view1', 'node1', 'node2'])
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
     * Unified command to get performance metrics or observe specific performance metrics
     * @example
     * cy.performance({ startMark: 'navigationStart', endMark: 'loadEventEnd', timeout: 10000, initialDelay: 1000, retryTimeout: 5000 })
     *   .then(results => {
     *     expect(results.pageloadTiming).to.be.lessThan(2000)
     *     expect(results.domCompleteTiming).to.be.lessThan(2000)
     *     const logoResourceTiming = results.resourceTiming('.svg')
     *     expect(logoResourceTiming.duration, 'Resource timing is less than 500ms').to.be.lessThan(500)
     *     expect(results.totalBytes, 'Total bytes is less than 500kb').to.be.lessThan(500000)
     *   })
     * @example
     * cy.performance().then(results => {
     *   expect(results.largestContentfulPaint).to.be.lessThan(500)
     *   expect(results.totalBlockingTime).to.be.lessThan(500)
     *   expect(results.paint.firstContentfulPaint).to.be.lessThan(500)
     *   expect(results.paint.firstPaint).to.be.lessThan(500)
     *   expect(results.cumulativeLayoutShift).to.be.lessThan(0.1)
     * })
     */
    performance(options?: MetricsOptions): Chainable<{
      pageloadTiming: number
      domCompleteTiming: number | null
      resourceTiming: Function
      largestContentfulPaint: number
      totalBlockingTime: number
      paint: { firstContentfulPaint: number; firstPaint: number }
      cumulativeLayoutShift: number
      totalBytes: number
    }>
  }
}
