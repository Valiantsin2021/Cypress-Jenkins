import { faker } from '@faker-js/faker'
import genData from '../../fixtures/genData'
import pipelinePageData from '../../fixtures/pipelinePageData.json'
import DashboardPage from '../../pageObjects/DashboardPage'
import NewJobPage from '../../pageObjects/NewJobPage'
import PipelinePage from '../../pageObjects/PipelinePage'
import BasePage from '../../pageObjects/basePage'

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
    newJobPage.typeNewItemName(randomItemName).selectPipelineProject().clickOKButton()
    pipelinePage
      .typePipelineDescription(pipelineDescription)
      .clickSaveButton()
      .clickConfigureLMenuOption()
      .clearPipelineDescriptionField()
      .typePipelineDescription(newPipelineDescription)
      .clickSaveButton()

    pipelinePage.getPipelineJobDescription().should('contain.text', newPipelineDescription)
  })

  it('TC_02.004.02 | Pipeline > Pipeline Configuration >Enable/disable the project with the help of Enable/Disable toggle', () => {
    basePage.clickNewItemMenuLink()
    newJobPage.typeNewItemName(randomItemName).selectPipelineProject().clickOKButton()
    pipelinePage
      .typePipelineDescription(pipelineDescription)
      .clickOnToggle()
      .clickSaveButton()
      .getStatusDisabledText()
      .should('exist')
  })

  it('TC_02.004.04 | Verify the choice of the pipeline script directly in Jenkins, using the editor', () => {
    dashboardPage.clickCreateJobLink()
    newJobPage.typeNewItemName(project.name).selectPipelineProject().clickOKButton()
    pipelinePage
      .clickPipelineMenuOption()
      .clickPipelineScriptDropdownOption()
      .selectScriptedPipelineOption()
      .clickSaveButton()
      .clickConfigureMenuOption()
      .clickPipelineMenuOption()

    pipelinePage.getPipelineScriptDropdownOption().should('be.selected').and('be.visible')
  })

  it('TC_02.004.05 | Verify the choice of linking the pipeline to a Jenkinsfile stored in source control', () => {
    dashboardPage.clickCreateJobLink()
    newJobPage.typeNewItemName(project.name).selectPipelineProject().clickOKButton()
    pipelinePage
      .clickPipelineMenuOption()
      .selectPipelineScriptFromSCMDropdownOption()
      .selectGitOption()
      .typeRepositoryURL(pipelinePageData.repositoryURL)
    pipelinePage.clickSaveButton().clickConfigureMenuOption().clickPipelineMenuOption()

    cy.log('Verifying that the "Pipeline script from SCM" is selected and the "Repository URL" is visible')
    pipelinePage
      .getDefinitionDropdown()
      .find('option:selected')
      .should('contain.text', 'Pipeline script from SCM')
      .and('be.visible')
    pipelinePage.getRepositoryURLInputField().should('have.value', pipelinePageData.repositoryURL).and('be.visible')
  })
})
