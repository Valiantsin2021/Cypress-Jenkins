import DashboardPage from '@pageObjects/DashboardPage.js'
import FolderPage from '@pageObjects/FolderPage.js'
import NewJobPage from '@pageObjects/NewJobPage.js'

const dashboardPage = new DashboardPage()
const newJobPage = new NewJobPage()
const folderPage = new FolderPage()
const folder1 = 'Folder'

describe('US_04.003 | Folder > Delete Folder', () => {
  beforeEach(() => {
    dashboardPage.clickNewItemMenuLink()
    newJobPage.typeNewItemName(folder1).selectFolder().clickOKButton()
    folderPage.clickSaveButton().clickJenkinsLogo()
  })

  it('TC_04.003.01 | Verify that the user able to delete folder on a FolderPage', () => {
    dashboardPage.clickItemName(folder1)
    folderPage.clickDeleteFolderFromMenu().clickYesOptionInPopUpWindow()
  })
  afterEach(() => {
    cy.cleanData([folder1])
  })
})
