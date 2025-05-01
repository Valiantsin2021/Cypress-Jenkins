/* eslint-disable no-console */
/* eslint-disable chai-friendly/no-unused-expressions */
import { lighthouse, prepareAudit } from '@cypress-audit/lighthouse'
import { pa11y } from '@cypress-audit/pa11y'
import { allureCypress } from 'allure-cypress/reporter'
import { ApiCoverage } from 'api-coverage-tracker'
import { defineConfig } from 'cypress'
import cypressSplit from 'cypress-split'
import { configureVisualRegression } from 'cypress-visual-regression'
import fs from 'fs'
import os from 'os'
import sslCheck from 'ssl-checker'
import addAccessibilityTasks from 'val-a11y/accessibility-tasks'

import config from './config.json' with { type: 'json' }

const apiCoverage = new ApiCoverage(config)

export default defineConfig({
  viewportWidth: 1920,
  viewportHeight: 1080,
  chromeWebSecurity: false,
  requestTimeout: 7000,
  defaultCommandTimeout: 7000,
  watchForFileChanges: false,
  accessibilityFolder: 'report',
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

          fs.writeFile('./report/lighthouse.html', lighthouseReport.report, error => {
            error ? console.log(error) : console.log('Report created successfully')
          })
        }),
        // Task to load the OpenAPI spec
        loadApiSpec(specPath) {
          return apiCoverage.loadSpec(specPath).then(() => {
            console.log('API spec loaded successfully')
            return null
          })
        },
        getSSLValidity: host =>
          // The "host" param will be the URL we need to verify
          sslCheck(host),
        // Task to register an API request
        registerApiRequest({ method, url, response }) {
          apiCoverage.registerRequest(method, url, response)
          return null
        },

        // Task to save API history
        saveApiHistory() {
          return apiCoverage.saveHistory().then(() => null)
        },
        // Task to generate the API coverage report
        generateApiReport() {
          return apiCoverage.generateReport().then(() => {
            console.log('API coverage report generated')
            return null
          })
        },
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
        resultsDir: 'report/allure-results',
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
    mochaFile: 'report/test-results-[hash].xml'
  }
})
