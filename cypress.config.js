/* eslint-disable chai-friendly/no-unused-expressions */
const { allureCypress } = require('allure-cypress/reporter')
const cypressSplit = require('cypress-split')
const { defineConfig } = require('cypress')
const os = require('os')
const addAccessibilityTasks = require('wick-a11y/accessibility-tasks')
const { lighthouse, prepareAudit } = require('@cypress-audit/lighthouse')
const { pa11y } = require('@cypress-audit/pa11y')
const fs = require('fs')

module.exports = defineConfig({
  viewportWidth: 1920,
  viewportHeight: 1080,
  chromeWebSecurity: false,
  requestTimeout: 7000,
  defaultCommandTimeout: 7000,
  watchForFileChanges: false,
  accessibilityFolder: 'reports',
  env: {
    enableAccessibilityVoice: true
  },
  e2e: {
    baseUrl: 'https://www.automationexercise.com',
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser = {}, launchOptions) => {
        prepareAudit(launchOptions)
      })

      on('task', {
        lighthouse: lighthouse(lighthouseReport => {
          console.log('---- Writing lighthouse report to disk ----')

          fs.writeFile('./reports/lighthouse.html', lighthouseReport.report, error => {
            error ? console.log(error) : console.log('Report created successfully')
          })
        }),
        pa11y: pa11y(console.log.bind(console))
      })
      addAccessibilityTasks(on)
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
