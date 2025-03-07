/* eslint-disable chai-friendly/no-unused-expressions */
import { lighthouse, prepareAudit } from '@cypress-audit/lighthouse'
import { pa11y } from '@cypress-audit/pa11y'
import { allureCypress } from 'allure-cypress/reporter'
import { defineConfig } from 'cypress'
import cypressSplit from 'cypress-split'
import { configureVisualRegression } from 'cypress-visual-regression'
import fs from 'fs'
import os from 'os'
import addAccessibilityTasks from 'val-a11y/accessibility-tasks'

export default defineConfig({
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
    env: {
      visualRegressionType: 'regression'
    },
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
      configureVisualRegression(on)
      return config
    }
  },
  screenshotsFolder: './cypress/snapshots/actual',
  video: false,
  reporter: 'junit',
  reporterOptions: {
    mochaFile: 'reports/test-results-[hash].xml'
  }
})
