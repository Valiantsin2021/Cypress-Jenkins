import genData from '../fixtures/genData'
import DashboardPage from '../pageObjects/DashboardPage'
import FolderPage from '../pageObjects/FolderPage'
import Header from '../pageObjects/Header'
import NewJobPage from '../pageObjects/NewJobPage'

const dashboardPage = new DashboardPage()
const newJobPage = new NewJobPage()
const folderPage = new FolderPage()
const header = new Header()
const folderName = genData.newProject()
const newFolderName = genData.newProject()

describe('US_04.001 | Folder > Rename Folder', () => {
  beforeEach(() => {
    dashboardPage.clickNewItemMenuLink()
    newJobPage.typeNewItemName(folderName.name).selectFolder().clickOKButton()
    folderPage.clickSaveButton()
    header.clickJenkinsLogo()
  })
  afterEach(() => {
    cy.cleanData([folderName.name, newFolderName.name])
  })
  it('TC_04.001.02 | Rename folder from drop-down menu', () => {
    dashboardPage
      .openDropdownForItem(folderName.name)
      .clickRenameDropdownOption()
    folderPage
      .clearNewNameField()
      .typeNewFolderName(newFolderName.name)
      .clickRenameButton()
    folderPage.verifyFolderUrl(newFolderName.name)

    folderPage
      .getFolderNameOnMainPanel()
      .should('include.text', `${newFolderName.name}`)
  })

  it('TC_04.001.06 | Successfully enter a valid folder name in the special field', () => {
    dashboardPage
      .openDropdownForItem(folderName.name)
      .clickRenameDropdownOption()
    folderPage
      .clearNewNameField()
      .typeNewFolderName(newFolderName.name)
      .getNewNameField()
      .should('have.value', newFolderName.name)
  })

  it('TC_04.001.03| Verify that error message is displayed when an invalid folder name is entered in the Rename Folder field', () => {
    dashboardPage
      .openDropdownForItem(folderName.name)
      .clickRenameDropdownOption()
    folderPage
      .clearNewNameField()
      .typeNewFolderName(newFolderName.name + '*')
      .clickRenameButton()

    folderPage
      .getFolderNameOnMainPanel()
      .should('contain', 'is an unsafe character')
  })
  it('TC_04.001.04 |Verify to rename the folder from drop-down menu of the folder element in the breadcrumbs', () => {
    header.getBreadcrumbBar().should('contain', folderName.name)
    header
      .hoverBreadcrumbsFolderName()
      .getBreadcrumbsFolderDropdownMenu()
      .click()
    dashboardPage.getRenameProjectDropdownMenuItem().click()

    folderPage
      .clearNewNameField()
      .typeNewFolderName(newFolderName.name)
      .getNewNameField()
      .should('have.value', newFolderName.name)
  })
})
