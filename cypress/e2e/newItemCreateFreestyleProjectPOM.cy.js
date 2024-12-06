/// <reference types="cypress" />

import { faker } from '@faker-js/faker'

import DashboardPage from '../pageObjects/DashboardPage'
import FolderPage from '../pageObjects/FolderPage'
import FreestyleProjectPage from '../pageObjects/FreestyleProjectPage'
import Header from '../pageObjects/Header'
import NewJobPage from '../pageObjects/NewJobPage'

import genData from '../fixtures/genData'
import message, { newItem } from '../fixtures/messages.json'

const dashboardPage = new DashboardPage()
const newJobPage = new NewJobPage()
const freestyleProjectPage = new FreestyleProjectPage()
const header = new Header()
const folderPage = new FolderPage()

const folderName = faker.commerce.product()

describe('US_00.001 | New item > Create Freestyle Project', () => {
  let project = genData.newProject()
  afterEach(() => {
    cy.cleanData([folderName, project.name])
  })
  it('TC_00.001.19 | New freestyle project is created if user enter projects name, choose project type and save it', () => {
    dashboardPage.clickNewItemMenuLink()
    newJobPage
      .typeNewItemName(folderName)
      .selectFreestyleProject()
      .clickOKButton()
    freestyleProjectPage.clickSaveButton()

    cy.url().should('include', folderName)
    freestyleProjectPage
      .getJobHeadline()
      .should('be.visible')
      .and('have.text', folderName)
  })

  it('TC_00.001.10 | Create Freestyle Project using the "New Item" button', () => {
    dashboardPage.clickNewItemMenuLink()
    newJobPage
      .typeNewItemName(folderName)
      .selectFreestyleProject()
      .clickOKButton()

    freestyleProjectPage.clickSaveButton()
    header.clickJenkinsLogo()

    dashboardPage.getProjectName().should('contain', folderName)
  })

  it('TC_00.001.13 | Verify that duplicate names are not allowed during project creation', () => {
    dashboardPage.clickNewItemMenuLink()
    newJobPage
      .typeNewItemName(folderName)
      .selectFreestyleProject()
      .clickOKButton()
    freestyleProjectPage.clickSaveButton()
    header.clickDashboardBtn()

    dashboardPage.clickNewItemMenuLink()

    newJobPage
      .typeNewItemName(folderName)
      .getItemNameInvalidErrorMessage()
      .should(
        'contain.text',
        `${newItem.duplicateNotAllowedMessage} ‘${folderName}’`
      )

    newJobPage.getOKButton().should('be.disabled')
  })

  it('TC_00.001.11 | Create Freestyle Project by clicking on Create a Job', () => {
    dashboardPage.clickCreateJobLink()
    newJobPage
      .typeNewItemName(project.name)
      .selectFreestyleProject()
      .clickOKButton()
      .clickSaveButton()

    freestyleProjectPage
      .getJobHeadline()
      .should('be.visible')
      .and('have.text', project.name)
  })

  it('TC_00.001.07 | Verify that duplicate names are not accepted during project creation', () => {
    dashboardPage.clickNewItemMenuLink()
    newJobPage
      .typeNewItemName(folderName)
      .chooseRandomItemFromList()
      .clickOKButton()
    freestyleProjectPage.clickSaveButton().clickDashboardBreadcrumbsLink()
    dashboardPage.clickNewItemMenuLink()
    newJobPage.typeNewItemName(folderName).selectFreestyleProject()

    newJobPage
      .getItemNameInvalidErrorMessage()
      .should(
        'have.text',
        `${newItem.duplicateNotAllowedMessage} ‘${folderName}’`
      )

    newJobPage.getOKButton().should('be.disabled').and('be.visible')
  })

  it('TC_00.001.03 | Create a new Freestyle Project using the "New Item" button from the Dashboard', () => {
    dashboardPage.clickNewItemMenuLink()
    newJobPage
      .typeNewItemName(project.name)
      .selectFreestyleProject()
      .clickOKButton()
      .clickSaveButton()
    freestyleProjectPage.getJobHeadline().should('have.text', project.name)
    freestyleProjectPage.getBreadcrumbBar().should('contain', project.name)
  })

  it('TC_00.001.14 | Create Freestyle Project from the Dashboard Menu', () => {
    dashboardPage.clickNewItemMenuLink()
    newJobPage
      .typeNewItemName(project.name)
      .selectFreestyleProject()
      .clickOKButton()
      .clickSaveButton()
    freestyleProjectPage.getJobHeadline().should('have.text', project.name)
  })

  it('TC_00.001.02 | Verify a new freestyle project can be created from the Dahsboard page', () => {
    dashboardPage.clickNewItemMenuLink()
    newJobPage
      .typeNewItemName(project.name)
      .selectFreestyleProject()
      .clickOKButton()
    freestyleProjectPage.clickSaveButton()

    freestyleProjectPage.getJobHeadline().should('have.text', project.name)
  })

  it('TC_00.001.04 | Verify a friendly reminder appeared when attempting to create a new Freestyle Project without a name', () => {
    dashboardPage.clickNewItemMenuLink()
    newJobPage.selectFreestyleProject()

    newJobPage
      .getEmptyNameFieldReminder()
      .should('have.text', message.newItem.emptyNameFieldReminder)
  })

  it('TC_00.001.05 | Verify a description can be added when creating a new Freestyle Project', () => {
    dashboardPage.clickNewItemMenuLink()
    newJobPage
      .typeNewItemName(project.name)
      .selectFreestyleProject()
      .clickOKButton()
    freestyleProjectPage
      .typeJobDescription(project.description)
      .clickSaveButton()

    freestyleProjectPage
      .getJobDescription()
      .should('have.text', project.description)
  })

  it('TC_00.001.06 | Verify a new Freestyle Project can be created from a new Folder', () => {
    dashboardPage.clickNewItemMenuLink()
    newJobPage
      .typeNewItemName(project.folderName)
      .selectFolder()
      .clickOKButton()
    folderPage.clickSaveButton().clickCreateAJobLink()
    newJobPage
      .typeNewItemName(project.name)
      .selectFreestyleProject()
      .clickOKButton()
    freestyleProjectPage.clickSaveButton()

    freestyleProjectPage.getJobHeadline().should('have.text', project.name)
    freestyleProjectPage
      .getProjectInfoSection()
      .should('include.text', `${project.folderName}/${project.name}`)
  })
})
