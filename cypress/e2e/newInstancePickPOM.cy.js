/// <reference types="cypress" />
import { newInstance } from '../fixtures/newJobPageData.json'
import DashboardPage from '../pageObjects/DashboardPage'
import Header from '../pageObjects/Header'
import NewJobPage from '../pageObjects/NewJobPage'

describe('Checking parametrization', () => {
  const dashboardPage = new DashboardPage()
  const newJobPage = new NewJobPage()
  const header = new Header()
  newInstance.forEach((instanceType, ind) => {
    it(`Checks the ${instanceType} page contains search field`, () => {
      dashboardPage.clickNewItemMenuLink()
      newJobPage.typeNewItemName(instanceType + ind + '1')
      cy.get('label').contains(instanceType).click()
      newJobPage.clickOKButton().clickSaveButton()
      header.getSearchField().should('be.visible')
      cy.cleanData([instanceType + ind + '1'])
    })
  })
})
