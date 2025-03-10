import { faker } from '@faker-js/faker'
import DashboardPage from '@pageObjects/DashboardPage.js'
import Header from '@pageObjects/Header.js'
import NewJobPage from '@pageObjects/NewJobPage.js'

import genData from '@fixtures/helpers/genData.js'
import { newItem } from '@fixtures/ui_data/messages.json'
import allKeys from '@fixtures/ui_data/newJobPageData.json'
import xmlPipelinePageConfiguration from '@fixtures/ui_data/xmlPageConfiguration.js'

const dashboardPage = new DashboardPage()
const newJobPage = new NewJobPage()
const header = new Header()

const LOCAL_PORT = Cypress.env('local.port')
const LOCAL_HOST = Cypress.env('local.host')
const { projectNameInvalid, errorMessageColor } = allKeys

describe('US_00.002 | New Item > Create Pipeline Project', () => {
  let project = genData.newProject()

  const randomItemName = faker.commerce.productName()
  const baseUrl = `http://${LOCAL_HOST}:${LOCAL_PORT}`
  afterEach(() => {
    cy.cleanData([project.name, randomItemName])
  })

  it('TC_00.002.01 | Special characters are not allowed in the project name', () => {
    dashboardPage.clickNewItemMenuLink()
    newJobPage
      .typeNewItemName(projectNameInvalid)
      .getItemNameInvalidErrorMessage()
      .should('have.text', newItem.newItemNameInvalidMessage)
      .and('have.css', 'color', errorMessageColor)
  })

  it('TC_00.002.02 | Pipeline item type is highlighted when selected ', () => {
    dashboardPage.clickNewItemMenuLink()
    newJobPage.typeNewItemName(randomItemName).selectPipelineProject()

    newJobPage.getPipelineSelectedState().should('have.attr', 'aria-checked', 'true')
  })

  it('TC_00.002.04 | Create Pipeline Project with an empty item name field', () => {
    dashboardPage.clickNewItemMenuLink()
    newJobPage
      .selectPipelineProject()
      .getEmptyItemInvalidName()
      .should('have.text', newItem.emptyNameFieldReminder)
      .and('have.css', 'color', errorMessageColor)
  })

  it('TC_00.002.05 | Create Pipeline Project with an already existing name of a project', () => {
    cy.log('Precondition: create Pipeline project')
    dashboardPage.clickNewItemMenuLink()
    newJobPage.typeNewItemName(randomItemName).selectPipelineProject().clickOKButton()
    header.clickJenkinsLogo()

    cy.log('Create project with an existing name')
    dashboardPage.clickNewItemMenuLink()

    newJobPage
      .clearItemNameField()
      .typeNewItemName(randomItemName)
      .getItemNameInvalidErrorMessage()
      .should('have.text', `${newItem.duplicateNotAllowedMessage} ‘${randomItemName}’`)
      .and('have.css', 'color', errorMessageColor)

    newJobPage.getOKButton().should('be.disabled')
  })

  it('TC_00.002.14 | Create Pipeline Project', () => {
    dashboardPage.clickCreateJobLink()
    newJobPage.typeNewItemName(project.name).selectPipelineProject().clickOKButton().clickSaveButton()
    header.clickJenkinsLogo()

    dashboardPage.getItemName().should('be.visible').and('contain.text', project.name)
    dashboardPage.getJobTable().should('contain.text', project.name).and('be.visible')
  })

  it('TC_00.002.15 | The url of the configure page contains new project name', () => {
    dashboardPage.clickNewItemMenuLink()
    newJobPage
      .typeNewItemName(project.name)
      .selectPipelineProject()
      .clickOKButton()

      .getBreadcrumbsListItem()
      .should('have.text', 'Configuration')
    newJobPage.getUrlConfigurePageField().should('include', encodeURIComponent(project.name))
  })

  it('TC_00.002.007 | New Pipeline Project check Item name valid', () => {
    dashboardPage.clickNewItemMenuLink()
    for (let i = 0; i < allKeys.projectNameSpecialSymbols.length; i++) {
      newJobPage
        .clearItemNameField()
        .verifyItemInvalidNameMessageNotExist()
        .typeNewItemName(allKeys.projectNameSpecialSymbols[i])
        .verifyItemInvalidNameMessageExist()
        .getItemNameInvalidErrorMessage()
        .should('have.text', `» ‘${allKeys.projectNameSpecialSymbols[i]}’ is an unsafe character`)
        .and('have.css', 'color', errorMessageColor)
    }
    newJobPage
      .clearItemNameField()
      .typeNewItemName(allKeys.projectNameSpecialSymbolDot)
      .verifyItemInvalidNameMessageExist()
      .getItemNameInvalidErrorMessage()
      .should('have.text', newItem.itemNameDotWarningMessage)
      .and('have.css', 'color', errorMessageColor)
  })

  it('TC_00.002.17 | Create a Pipeline Project using API', () => {
    cy.getCrumbToken(baseUrl).then(({ crumb, crumbField }) => {
      cy.log('Creating a new Pipeline Project via API.')
      cy.request({
        method: 'POST',
        url: `${baseUrl}/createItem?name=${project.name}`,
        headers: {
          'Content-Type': 'application/xml',
          [crumbField]: crumb
        },
        body: xmlPipelinePageConfiguration
      })

      cy.log('Verifying the Pipeline Project was created.')
      cy.request({
        method: 'GET',
        url: `${baseUrl}/job/${project.name}/api/json`
      }).then(getResponse => {
        expect(getResponse.status).to.eq(200)
        expect(getResponse.body.displayName).to.eq(project.name)
      })
    })
  })
})
