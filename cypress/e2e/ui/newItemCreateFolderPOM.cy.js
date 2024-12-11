import genData from '../../fixtures/genData'
import DashboardPage from '../../pageObjects/DashboardPage'
import FolderPage from '../../pageObjects/FolderPage'
import NewJobPage from '../../pageObjects/NewJobPage'
const LOCAL_PORT = Cypress.env('local.port')
const LOCAL_HOST = Cypress.env('local.host')
const dashboardPage = new DashboardPage()
const newJobPage = new NewJobPage()
const folderPage = new FolderPage()

let folder = genData.newProject()

describe('US_00.004 | New item > Create Folder', () => {
  const endPoint = folder.name.replace(' ', '%20')
  beforeEach(() => {
    cy.intercept('GET', `/view/all/checkJobName?value=${endPoint}`).as(
      'command'
    )
    cy.intercept(
      'POST',
      `/job/${endPoint}/descriptorByName/com.cloudbees.hudson.plugins.folder.Folder/checkDisplayNameOrNull`
    ).as('checkName')
  })

  it('TC_00.004.01 | Create Folder using New Item menu link, with unique name and default configuration', () => {
    dashboardPage.clickNewItemMenuLink()
    newJobPage.typeNewItemName(folder.name).selectFolder()
    cy.wait('@command')
    newJobPage.clickOKButton()
    folderPage.verifyTitleConfigurationIsVisible().clickSaveButton()
    cy.wait('@checkName')
    cy.request(
      'GET',
      `http://${LOCAL_HOST}:${LOCAL_PORT}/job/${endPoint}/`
    ).then(response => {
      //comment for educational purpose only: uncomment to see that respose simply return an html page
      //cy.log(response.body)
      expect(response.status).to.eq(200)
      //expect(response.body).to.contain(folder.name);
    })
    folderPage.getFolderNameOnMainPanel().should('contain.text', folder.name)
    folderPage.getBreadcrumps().should('contain.text', folder.name)
    folderPage.clickJenkinsLogo()
    dashboardPage.getItemName(folder.name).should('be.visible')
    cy.cleanData([folder.name])
  })
})
