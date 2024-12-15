/* eslint-disable no-undef */
import '@bahmutov/cy-api'
import '@cypress-audit/lighthouse/commands'
import '@cypress-audit/pa11y/commands'
import 'allure-cypress'
import 'cypress-real-events'
import 'wick-a11y'

import './commands'
import './globalHooks'
import './logger'

const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/
Cypress.on(
  'uncaught:exception',
  err => {
    /* returning false here prevents Cypress from failing the test */
    if (resizeObserverLoopErrRe.test(err.message)) {
      return false
    }
    if (test.state === 'failed') {
      let item = runnable
      const nameParts = [runnable.title]

      while (item.parent) {
        nameParts.unshift(item.parent.title)
        item = item.parent
      }

      const fullTestName = nameParts.filter(Boolean).join(' -- ')
      const imageUrl = `screenshots/${Cypress.spec.name}/${fullTestName} (failed).png`

      addContext({ test }, imageUrl)
    }
  },
  Cypress.Screenshot.defaults({
    capture: 'viewport'
  })
)
