/// <reference types="cypress"/>

import DashboardPage from '../pageObjects/DashboardPage'
import NewJobPage from '../pageObjects/NewJobPage'
import FreestyleProjectPage from '../pageObjects/FreestyleProjectPage'
import Header from '../pageObjects/Header'
import MyViewsPage from '../pageObjects/MyViewsPage'

import genData from '../fixtures/genData'

const dashboardPage = new DashboardPage()
const newJobPage = new NewJobPage()
const freestyleProjectPage = new FreestyleProjectPage()
const header = new Header()
const myViewsPage = new MyViewsPage()

describe('US_16.002 | Dashboard > Create View', () => {
  let project = genData.newProject()
  let folder = genData.newProject()
  let view = genData.newProject()

  beforeEach(() => {
    dashboardPage.clickNewItemMenuLink()
    newJobPage
      .typeNewItemName(project.name)
      .selectFreestyleProject()
      .clickOKButton()
    freestyleProjectPage.clickSaveButton()
    header.clickJenkinsLogo()

    dashboardPage.clickNewItemMenuLink()
    newJobPage.typeNewItemName(folder.name).selectFolder().clickOKButton()
    freestyleProjectPage.clickSaveButton()
    header.clickJenkinsLogo()
  })

  it('TC_16.002.01 Create global view from the Dashboard page', () => {
    dashboardPage.clickMyViewsLink()
    myViewsPage
      .clickAddNewViewLink()
      .typeViewName(view.name)
      .clickIncludeGlobalViewButton()
      .clickCreateButton()
      .clickOkButton()

    cy.url().then(url => {
      const normalizedUrl = url.replace('%20', ' ')
      expect(normalizedUrl).to.contain(view.name)
    })
    myViewsPage.getCurrentViewBreadcrumbsItem().should('have.text', view.name)
    myViewsPage
      .clickMyViewsBreadcrumbsItem()
      .getViewTab(view.name)
      .should('be.visible')
  })
})
