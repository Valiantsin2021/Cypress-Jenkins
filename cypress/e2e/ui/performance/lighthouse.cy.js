const LOCAL_PORT = Cypress.env('local.port')
const LOCAL_HOST = Cypress.env('local.host')
describe(`Lighthouse`, () => {
  const thresholds = {
    performance: 50,
    accessibility: 70,
    'first-contentful-paint': 2500,
    'largest-contentful-paint': 3000,
    'cumulative-layout-shift': 0.1,
    'total-blocking-time': 500,
    'best-practices': 80,
    interactive: 100000,
    seo: 70,
    pwa: 20
  }
  const opts = {
    formFactor: 'desktop',
    screenEmulation: {
      mobile: false,
      disable: true,
      width: Cypress.config('viewportWidth'),
      height: Cypress.config('viewportHeight'),
      deviceScaleRatio: 1
    },
    output: 'html'
  }
  const desktopConfig = {
    formFactor: 'desktop',
    screenEmulation: {
      width: 1350,
      height: 940,
      deviceScaleRatio: 1,
      mobile: false,
      disable: false
    },
    throttling: {
      rttMs: 40,
      throughputKbps: 11024,
      cpuSlowdownMultiplier: 1,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0
    },
    output: 'html'
  }
  const pa11yConf = {
    rules: {
      'color-contrast': {
        enabled: false
      }
    },
    level: 'critical',
    standard: 'WCAG2A',
    includeWarnings: false,
    includeNotices: false,
    threshold: 11
  }
  it(`measures the performance of the home page of the website with separate config for mobile`, () => {
    cy.fixture('lighthouse-config.json').then(configuration => {
      cy.lighthouse(configuration.threshold, configuration.lighthouseConfig)
      cy.pa11y(pa11yConf)
    })
  })

  it(`measures the performance of the newJob page of the website with config for desktop`, () => {
    cy.visit(`http://${LOCAL_HOST}:${LOCAL_PORT}/view/all/newJob`)
    cy.lighthouse(thresholds, opts)
    cy.pa11y(pa11yConf)
  })
})
