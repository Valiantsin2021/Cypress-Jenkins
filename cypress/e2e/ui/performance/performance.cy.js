const LOCAL_PORT = Cypress.env('local.port')
const LOCAL_HOST = Cypress.env('local.host')
const getPerformanceMetrics = function (window, startMark, endMark) {
  const navigationTiming = window.performance.getEntriesByType('navigation')
  const resourceTiming = window.performance.getEntriesByType('resource')
  const paintTiming = window.performance.getEntriesByType('paint')
  return {
    pageloadTiming: window.performance.timing[endMark] - window.performance.timing[startMark],
    domCompleteTiming: navigationTiming[0].domComplete,
    resourceTiming,
    paintTiming
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
    /* The Resource Timing API allows us to zoom in on single resources and get accurate information about how quickly they loaded.
       For example, we could specifically look at our website’s logo:
    */
    it(`Should load ${endpoint} page with resourceTiming less than 500ms`, () => {
      cy.visit(url)
      cy.window().then(win => {
        const { resourceTiming } = getPerformanceMetrics(win, 'navigationStart', 'loadEventEnd')
        const logoResourceTiming = resourceTiming.find(element => element.name.includes('.svg'))
        expect(logoResourceTiming.duration, 'Resource timing is less than 500ms').to.be.lessThan(500)
      })
    })

    /* The Paint Timing API provides information on the first paint and the first contentful paint.
       Access the entries via performance.getEntriesByType('paint') or performance.getEntriesByName('first-contentful-paint').
    */
    it(`Should load ${endpoint} page with paintTiming less than 500ms`, () => {
      cy.visit(url)
      cy.window().then(win => {
        const { paintTiming } = getPerformanceMetrics(win, 'navigationStart', 'loadEventEnd')
        paintTiming.forEach(paint => {
          expect(paint.startTime, 'Paint timing is less than 500ms').to.be.lessThan(500)
        })
      })
    })

    /* The Largest Contentful Paint API provides information on all large paints.
       Use this API to evaluate the Core Web Vital Largest Contentful Paint (LCP).
    */
    it.skip(`Should load ${endpoint} page with largestContentfulPaint less than 500ms`, () => {
      cy.visit(url)
      cy.window()
        .then(
          win =>
            new Promise(resolve => {
              new PerformanceObserver(l => {
                const entries = l.getEntries()
                // the last entry is the largest contentful paint
                const largestPaintEntry = entries.at(-1)
                resolve(largestPaintEntry.startTime)
              }).observe({
                type: 'largest-contentful-paint',
                buffered: true
              })
            })
        )
        .then(lcp => {
          expect(lcp, 'Largest Contentful Paint is less than 500ms').to.be.lessThan(500)
        })
    })

    /*The Layout Instability API provides information on all layout shifts.
      Use this API to evaluate the Core Web Vital Cumulative Layout Shift (CLS).
    */
    it.skip(`Should load ${endpoint} page with cumulativeLayoutShift less than 0.1`, () => {
      cy.visit(url)
      cy.window()
        .then(
          win =>
            new Promise(resolve => {
              let CLS = 0

              new PerformanceObserver(l => {
                const entries = l.getEntries()

                entries.forEach(entry => {
                  if (!entry.hadRecentInput) {
                    CLS += entry.value
                  }
                })

                resolve(CLS.toString())
              }).observe({
                type: 'layout-shift',
                buffered: true
              })
            })
        )
        .then(cls => {
          expect(cls, 'Cumulative Layout Shift is less than 0.1').to.be.lessThan(0.1)
        })
    })
    /*The Long Task API provides information about all JavaScript executions taking 50 milliseconds or more.
    Use this API to evaluate the Web Vital and lab metric Total Blocking Time (TBT).
    */
    it.skip(`Should load ${endpoint} page with totalBlockingTime less than 500ms`, () => {
      cy.visit(url)
      cy.window()
        .then(
          win =>
            new Promise(resolve => {
              let totalBlockingTime = 0
              new PerformanceObserver(list => {
                const perfEntries = list.getEntries()
                for (const perfEntry of perfEntries) {
                  totalBlockingTime += perfEntry.duration - 50
                }
                resolve(totalBlockingTime)
              }).observe({ type: 'longtask', buffered: true })

              // Resolve promise if there haven't been long tasks
              setTimeout(() => resolve(totalBlockingTime), 5000)
            })
        )
        .then(tbt => {
          expect(tbt, 'Total Blocking Time is less than 500ms').to.be.lessThan(500)
        })
    })
  })
})
