const LOCAL_PORT = Cypress.env('local.port')
const LOCAL_HOST = Cypress.env('local.host')
/**
 * Gets various performance metrics for a page load.
 *
 * @param {Window} window - The window object of the page for which to get the metrics.
 * @param {string} startMark - The name of the start mark for the page load,
 *   e.g. 'navigationStart'.
 * @param {string} endMark - The name of the end mark for the page load,
 *   e.g. 'loadEventEnd'.
 * @return {Object} An object containing the following metrics:
 *   - pageloadTiming: the time from the start mark to the end mark.
 *   - domCompleteTiming: the time of the domComplete event.
 *   - resourceTiming: all resource timings.
 *   - paintTiming: all paint timings.
 */
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
/**
 * Create a performance observer for a specific performance entry type
 * @param {Window} win - The window object
 * @param {string} entryType - The type of performance entry to observe
 * @param {Function} processEntries - Function to process performance entries
 * @param {number} [timeout=5000] - Timeout for the observation
 * @returns {Promise} A promise that resolves with the processed result
 */
const observePerformanceMetric = function (win, entryType, processEntries, timeout = 5000) {
  return new Cypress.Promise((resolve, reject) => {
    // Timeout to prevent indefinite waiting
    const timeoutId = setTimeout(() => {
      resolve(processEntries([]))
    }, timeout)
    // Check if PerformanceObserver is supported
    if (!('PerformanceObserver' in win)) {
      clearTimeout(timeoutId)
      reject(new Error('PerformanceObserver not supported'))
      return
    }
    const observer = new win.PerformanceObserver(list => {
      // Filter entries by the specified type
      const entries = list.getEntries().filter(entry => entry.entryType === entryType)
      // Disconnect the observer to prevent memory leaks
      observer.disconnect()
      clearTimeout(timeoutId)
      // Process and resolve with the result
      resolve(processEntries(entries))
    })
    // Start observing
    try {
      observer.observe({ type: entryType, buffered: true })
    } catch (err) {
      clearTimeout(timeoutId)
      reject(new Error(`Failed to observe ${entryType}: ${err.message}`))
    }
  })
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
    it(`Should load ${endpoint} page with largestContentfulPaint less than 500ms`, () => {
      cy.visit(url)
      cy.window()
        .then(win =>
          observePerformanceMetric(win, 'largest-contentful-paint', entries => {
            if (entries.length === 0) return Infinity
            return entries[entries.length - 1].startTime
          })
        )
        .then(lcp => {
          expect(lcp, `Largest Contentful Paint (${lcp}ms) should be less than 500ms`).to.be.lessThan(500)
        })
    })

    /*The Layout Instability API provides information on all layout shifts.
      Use this API to evaluate the Core Web Vital Cumulative Layout Shift (CLS).
    */
    it(`Should load ${endpoint} page with cumulativeLayoutShift less than 0.1`, () => {
      cy.visit(url)
      cy.window()
        .then(win =>
          observePerformanceMetric(win, 'layout-shift', entries => {
            let CLS = 0
            entries.forEach(entry => {
              if (!entry.hadRecentInput) {
                CLS += entry.value
              }
            })
            return CLS.toString()
          })
        )
        .then(cls => {
          const clsValue = parseFloat(cls)
          expect(clsValue, `Cumulative Layout Shift (${clsValue}) should be less than 0.1`).to.be.lessThan(0.1)
        })
    })
    /*The Long Task API provides information about all JavaScript executions taking 50 milliseconds or more.
    Use this API to evaluate the Web Vital and lab metric Total Blocking Time (TBT).
    */
    it(`Should load ${endpoint} page with totalBlockingTime less than 500ms`, () => {
      cy.visit(url)
      cy.window()
        .then(win =>
          observePerformanceMetric(win, 'longtask', entries => {
            let totalBlockingTime = 0
            entries.forEach(perfEntry => {
              const blockingTime = Math.max(perfEntry.duration - 50, 0)
              totalBlockingTime += blockingTime
            })
            return totalBlockingTime
          })
        )
        .then(tbt => {
          expect(tbt, `Total Blocking Time (${tbt}ms) should be less than 500ms`).to.be.lessThan(500)
        })
    })
  })
})
