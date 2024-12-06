/// <reference types="cypress"/>

import { faker } from '@faker-js/faker'
import genData from '../fixtures/genData'
import DashboardPage from '../pageObjects/DashboardPage'
import NewJobPage from '../pageObjects/NewJobPage'
import PipelinePage from '../pageObjects/PipelinePage'
import BasePage from '../pageObjects/basePage'

const dashboardPage = new DashboardPage()
const newJobPage = new NewJobPage()
const pipelinePage = new PipelinePage()
const basePage = new BasePage()

describe('US_02.004 | Pipeline > Pipeline Configuration', () => {
  afterEach(() => {
    cy.cleanData([randomItemName, project.name])
  })
  const randomItemName = faker.commerce.productName()
  const pipelineDescription = faker.lorem.paragraph()
  const newPipelineDescription = faker.lorem.paragraph()
  let project = genData.newProject()

  it('TC_02.004.03 | Modify the description field for the pipeline', () => {
    basePage.clickNewItemMenuLink()
    newJobPage
      .typeNewItemName(randomItemName)
      .selectPipelineProject()
      .clickOKButton()
    pipelinePage
      .typePipelineDescription(pipelineDescription)
      .clickSaveButton()
      .clickConfigureLMenuOption()
      .clearPipelineDescriptionField()
      .typePipelineDescription(newPipelineDescription)
      .clickSaveButton()

    pipelinePage
      .getPipelineJobDescription()
      .should('contain.text', newPipelineDescription)
  })

  it('TC_02.004.02 | Pipeline > Pipeline Configuration >Enable/disable the project with the help of Enable/Disable toggle', () => {
    basePage.clickNewItemMenuLink()
    newJobPage
      .typeNewItemName(randomItemName)
      .selectPipelineProject()
      .clickOKButton()
    pipelinePage
      .typePipelineDescription(pipelineDescription)
      .clickOnToggle()
      .clickSaveButton()
      .getStatusDisabledText()
      .should('exist')
      .and('have.css', 'color', 'rgb(254, 130, 10)')
  })

  it('TC_02.004.04 | Verify the choice of the pipeline script directly in Jenkins, using the editor', () => {
    dashboardPage.clickCreateJobLink()
    newJobPage
      .typeNewItemName(project.name)
      .selectPipelineProject()
      .clickOKButton()
    pipelinePage
      .clickPipelineMenuOption()
      .clickPipelineScriptDropdownOption()
      .selectScriptedPipelineOption()
      .clickSaveButton()
      .clickConfigureMenuOption()
      .clickPipelineMenuOption()

    pipelinePage
      .getPipelineScriptDropdownOption()
      .should('be.selected')
      .and('be.visible')
  })
})
