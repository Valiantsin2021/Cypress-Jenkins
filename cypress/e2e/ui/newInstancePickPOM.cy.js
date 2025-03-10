import DashboardPage from '@pageObjects/DashboardPage.js'
import Header from '@pageObjects/Header.js'
import NewJobPage from '@pageObjects/NewJobPage.js'

import { newInstance } from '@fixtures/ui_data/newJobPageData.json'

describe('Checking parametrization', () => {
  const dashboardPage = new DashboardPage()
  const newJobPage = new NewJobPage()
  const header = new Header()

  newInstance.forEach((instanceType, ind) => {
    it(`Checks the ${instanceType} page contains search field`, () => {
      dashboardPage.clickNewItemMenuLink()
      newJobPage.typeNewItemName(instanceType + ind)
      cy.get('label').contains(instanceType).click()
      newJobPage.clickOKButton().clickSaveButton()
      header.getSearchField().should('be.visible')
      cy.cleanData([instanceType + ind + '1'])
    })
  })
})
