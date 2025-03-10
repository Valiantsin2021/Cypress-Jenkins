import DashboardPage from '@pageObjects/DashboardPage.js'
import FolderPage from '@pageObjects/FolderPage.js'
import NewJobPage from '@pageObjects/NewJobPage.js'

import genData from '@fixtures/helpers/genData.js'

const dashboardPage = new DashboardPage()
const newJobPage = new NewJobPage()
const folderPage = new FolderPage()

let folder = genData.newProject()

describe('US_00.004 | New item > Create Folder', () => {
  it('TC_00.004.01 | Create Folder using New Item menu link, with unique name and default configuration', () => {
    dashboardPage.clickNewItemMenuLink()
    newJobPage.typeNewItemName(folder.name).selectFolder().clickOKButton()
    folderPage.verifyTitleConfigurationIsVisible().clickSaveButton()

    folderPage.getFolderNameOnMainPanel().should('contain.text', folder.name)
    folderPage.getBreadcrumps().should('contain.text', folder.name)
    folderPage.clickJenkinsLogo()
    dashboardPage.getItemName().should('be.visible')
    cy.cleanData([folder.name])
  })
})
