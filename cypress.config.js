const { allureCypress } = require('allure-cypress/reporter')
const cypressSplit = require('cypress-split')
const { defineConfig } = require('cypress')
import * as os from 'node:os'

module.exports = defineConfig({
  projectId: '347hg6',
  viewportWidth: 1920,
  viewportHeight: 1080,
  chromeWebSecurity: false,
  requestTimeout: 7000,
  defaultCommandTimeout: 7000,
  watchForFileChanges: false,
  e2e: {
    baseUrl: 'https://www.automationexercise.com',
    setupNodeEvents(on, config) {
      on('task', {
        print(s) {
          console.log(s)
          return null
        }
      })
      allureCypress(on, config, {
        environmentInfo: {
          os_platform: os.platform(),
          os_release: os.release(),
          os_version: os.version(),
          node_version: process.version
        }
      })
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
