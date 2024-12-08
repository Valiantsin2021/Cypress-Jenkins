import DashboardPage from '../pageObjects/DashboardPage'
import FreestyleProjectPage from '../pageObjects/FreestyleProjectPage'
import Header from '../pageObjects/Header'
import NewJobPage from '../pageObjects/NewJobPage'

import configurePageData from '../fixtures/configurePageData.json'
import { confirmationMessage } from '../fixtures/deleteProjectData.json'
import genData from '../fixtures/genData'
import newJobPageData from '../fixtures/newJobPageData.json'

const dashboardPage = new DashboardPage()
const newJobPage = new NewJobPage()
const freestyleProjectPage = new FreestyleProjectPage()
const header = new Header()

describe('US_01.004 | FreestyleProject > Delete Project', () => {
  let project = genData.newProject()

  beforeEach(() => {
    dashboardPage.clickNewItemMenuLink()
    newJobPage
      .typeNewItemName(project.name)
      .selectFreestyleProject()
      .clickOKButton()
    freestyleProjectPage
      .typeJobDescription(project.description)
      .clickSaveButton()
    header.clickJenkinsLogo()
  })
  afterEach(() => {
    cy.cleanData([project.name])
  })
  it('TC_01.004.05 | Cancel deletion', () => {
    dashboardPage.clickJobName(project.name)
    freestyleProjectPage
      .clickDeleteMenuItem()
      .clickCancelButton()
      .clickDashboardBreadcrumbsLink()
    dashboardPage.getAllJobNames().should('contain.text', project.name)
  })

  it('TC_01.004.10 | Verify Freestyle Project is deleted from Dashboard page', () => {
    cy.log('Deleting Freestyle project')
    dashboardPage
      .hoverJobTitleLink(project.name)
      .clickJobTableDropdownChevron(project.name)
      .clickDeleteProjectDropdownMenuItem()
      .clickYesButton()

    cy.log('Verifying Freestyle Project is deleted from Dashboard page')
    dashboardPage.getMainPanel().contains(project.name).should('not.exist')
  })

  it('TC_01.004.11 | Verify user is able to cancel project deleting', () => {
    dashboardPage
      .hoverJobTitleLink(project.name)
      .clickProjectChevronIcon(project.name)
      .clickDeleteProjectDropdownMenuItem()

    dashboardPage.getCancelButton().should('be.visible')

    dashboardPage
      .clickCancelButton()
      .getItemName()
      .should('contain', project.name)
  })

  it('TC_01.004.14 | Verify Freestyle Project is deleted from Project page', () => {
    dashboardPage.clickJobTitleLink(project.name)
    freestyleProjectPage
      .getJobHeadline()
      .should('be.visible')
      .and('have.text', project.name)
    freestyleProjectPage.clickDeleteMenuItem().clickYesButton()
    dashboardPage.getMainPanel().should('not.contain.value', project.name)
  })

  it('TC_01.004.15 | Verify user cancels Project deletion', () => {
    dashboardPage
      .hoverJobTitleLink(project.name)
      .clickJobTableDropdownChevron(project.name)
      .clickDeleteProjectDropdownMenuItem()
      .clickCancelButton()
      .getJobTable()
      .should('contain.text', project.name)
      .and('be.visible')
  })

  it('TC_01.004.04 | FreestyleProject > Delete Project|Delete a project from the Project Page', () => {
    //Create a project
    dashboardPage.clickNewItemMenuLink()
    newJobPage
      .typeNewItemName(newJobPageData.projectName)
      .selectFreestyleProject()
      .clickOKButton()
    freestyleProjectPage
      .typeJobDescription(configurePageData.projectDescription)
      .clickSaveButton()

    //Delete the project
    freestyleProjectPage.clickDeleteMenuItem().clickYesButton()
  })

  it('TC_01.004.17 | Delete project from the Project Page', () => {
    dashboardPage.clickJobName(project.name)
    freestyleProjectPage.clickDeleteMenuItem().clickYesButton()
  })

  it('TC_01.004.07 | Verify confirmation appears before deletion', () => {
    dashboardPage
      .openDropdownForItem(project.name)
      .clickDeleteProjectDropdownMenuItem()

      .getDeleteProjectDialogBox()
      .should('exist')
      .and('contain.text', `${confirmationMessage.question} ‘${project.name}’?`)
    dashboardPage.getYesButton().should('exist').and('not.be.disabled')
    dashboardPage.getCancelButton().should('exist').and('not.be.disabled')
  })

  it('TC_01.004.12 | Verify confirmation message appears after attempting to delete a project', () => {
    dashboardPage.clickJobName(project.name)

    freestyleProjectPage.clickDeleteMenuItem()

    freestyleProjectPage.getConfirmationMessageDialog().should('be.visible')
    freestyleProjectPage
      .getConfirmationMessageTitle()
      .should('have.text', confirmationMessage.title)
    freestyleProjectPage
      .getConfirmationMessageQuestion()
      .should('have.text', `${confirmationMessage.question} ‘${project.name}’?`)
  })
})
