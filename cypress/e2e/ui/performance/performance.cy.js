const LOCAL_PORT = Cypress.env('local.port')
const LOCAL_HOST = Cypress.env('local.host')
const endpoints = [
  '/',
  '/view/all/newJob',
  '/view/all/builds',
  '/me/my-views/view/all/',
  '/user/admin/',
  '/user/admin/configure',
  '/user/admin/my-views/view/all/',
  '/user/admin/credentials/',
  '/user/admin/builds'
]
Cypress.config('defaultCommandTimeout', 15000)
describe('Performance with unified command', () => {
  endpoints.forEach(endpoint => {
    const url = `http://${LOCAL_HOST}:${LOCAL_PORT}${endpoint}`
    it(`Should load ${endpoint} page in less than 2 second`, () => {
      cy.visit(url)
      cy.performance().then(metrics => {
        cy.log(`pageloadTiming: ${metrics.pageloadTiming}ms`)
        cy.log(`domCompleteTiming: ${metrics.domCompleteTiming}ms`)
        expect(metrics.pageloadTiming).to.be.lessThan(2000)
        expect(metrics.domCompleteTiming).to.be.lessThan(2000)
      })
    })
    it(`Should load ${endpoint} page with resourceTiming less than 500ms`, () => {
      cy.visit(url)
      cy.performance().then(metrics => {
        cy.log(`Resource timing: ${metrics.resourceTiming('.svg').duration}ms`)
        expect(metrics.resourceTiming('.svg').duration, 'Resource timing is less than 500ms').to.be.lessThan(500)
      })
    })
    it(`Should return response for ${endpoint} in less than 500 milliseconds`, () => {
      cy.api({ method: 'GET', url }).then(response => {
        cy.log(`Response time: ${response.duration}ms`)
        expect(response.duration, 'Response time is less than 500 milliseconds').to.be.lessThan(500)
      })
    })
    it(`Should load ${endpoint} page with size less than 1 MB`, () => {
      cy.visit(url)
      cy.performance().then(results => {
        cy.log(`Total bytes: ${results.totalBytes} bytes`)
        expect(results.totalBytes, 'Total bytes is less than 1 MB').to.be.lessThan(1024 * 1024)
      })
    })
    it(`Should measure paint timings for ${endpoint}`, () => {
      cy.visit(url)
      cy.performance().then(results => {
        cy.log(`First Contentful Paint time: ${results.paint.firstContentfulPaint}ms`)
        cy.log(`First Paint timing: ${results.paint.firstPaint}ms`)
        expect(results.paint.firstContentfulPaint, 'First Contentful Paint is less than 1500ms').to.be.lessThan(1500)
        expect(results.paint.firstPaint, 'First Paint is less than 1500ms').to.be.lessThan(1500)
      })
    })
    it(`Should measure largestContentfulPaint for ${endpoint}`, () => {
      cy.visit(url)
      cy.performance().then(results => {
        cy.log(`Largest Contentful Paint timing: ${results.largestContentfulPaint}ms`)
        expect(
          results.largestContentfulPaint,
          `Largest Contentful Paint (${results.largestContentfulPaint}ms) should be less than 500ms`
        ).to.be.lessThan(500)
      })
    })
    it(`Should measure cumulativeLayoutShift for ${endpoint}`, () => {
      cy.visit(url)
      cy.performance().then(results => {
        cy.log(`Cumulative Layout Shift: ${results.cumulativeLayoutShift}`)
        expect(
          results.cumulativeLayoutShift,
          `Cumulative Layout Shift (${results.cumulativeLayoutShift}) should be less than 0.1`
        ).to.be.lessThan(0.1)
      })
    })
    it(`Should measure totalBlockingTime for ${endpoint}`, () => {
      cy.visit(url)
      cy.performance().then(results => {
        cy.log(`Total Blocking Time: ${results.totalBlockingTime}ms`)
        expect(
          results.totalBlockingTime,
          `Total Blocking Time (${results.totalBlockingTime}ms) should be less than 500ms`
        ).to.be.lessThan(500)
      })
    })
  })
})
