const LOCAL_PORT = Cypress.env('local.port')
const LOCAL_HOST = Cypress.env('local.host')
const getPerformanceMetrics = function (window, startMark, endMark) {
  const navigationTiming = window.performance.getEntriesByType('navigation')
  return {
    pageloadTiming: window.performance.timing[endMark] - window.performance.timing[startMark],
    domCompleteTiming: navigationTiming[0].domComplete
  }
}
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
describe('Performance', () => {
  endpoints.forEach(endpoint => {
    const url = `http://${LOCAL_HOST}:${LOCAL_PORT}${endpoint}`
    it(`should load ${endpoint} page in less than 2 second`, () => {
      cy.visit(url)
      cy.window().then(win => {
        const { pageloadTiming, domCompleteTiming } = getPerformanceMetrics(win, 'navigationStart', 'loadEventEnd')
        cy.log(`pageloadTiming: ${pageloadTiming}, domCompleteTiming: ${domCompleteTiming}`)
        expect(pageloadTiming, 'Load time is less than 2 seconds').to.be.lessThan(2000)
        expect(domCompleteTiming, 'domCompleteTiming is less than 2 seconds').to.be.lessThan(2000)
      })
    })
    it(`Should return response for ${endpoint} in less than 500 milliseconds`, () => {
      cy.api({ method: 'GET', url }).then(response => {
        expect(response.duration, 'Response time is less than 500 milliseconds').to.be.lessThan(500)
      })
    })
    it(`Should load ${endpoint} page with size less than 1 MB`, () => {
      cy.visit(url)
      cy.window().then(win => {
        const totalBytes = win.performance
          .getEntriesByType('resource')
          .reduce((acc, entry) => acc + entry.encodedBodySize, 0)
        expect(totalBytes, 'Total bytes is less than 1 MB').to.be.lessThan(1024 * 1024)
      })
    })
  })
})
