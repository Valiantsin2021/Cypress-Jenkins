const { allureCypress } = require('allure-cypress/reporter')
const cypressSplit = require('cypress-split')
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  viewportWidth: 1920,
  viewportHeight: 1080,
  chromeWebSecurity: false,
  requestTimeout: 7000,
  defaultCommandTimeout: 7000,
  watchForFileChanges: false,
  e2e: {
    setupNodeEvents(on, config) {
      allureCypress(on)
      cypressSplit(on, config)
      return config
    }
  },
  video: false,
  reporter: 'junit',
  reporterOptions: {
    mochaFile: 'reports/test-results-[hash].xml'
  }
})