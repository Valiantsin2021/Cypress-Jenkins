import DashboardPage from '@pageObjects/DashboardPage.js'
import FolderPage from '@pageObjects/FolderPage.js'
import Header from '@pageObjects/Header.js'
import NewJobPage from '@pageObjects/NewJobPage.js'

import genData from '@fixtures/genData.js'

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
    folderPage.clickSaveButton().clickJenkinsLogo()
  })
  afterEach(() => {
    cy.cleanData([folderName.name, newFolderName.name])
  })
  it('TC_04.001.02 | Rename folder from drop-down menu', () => {
    dashboardPage.openDropdownForItem(folderName.name).clickRenameDropdownOption()
    folderPage.clearNewNameField().typeNewFolderName(newFolderName.name).clickRenameButton()
    folderPage.verifyFolderUrl(newFolderName.name)

    folderPage.getFolderNameOnMainPanel().should('include.text', `${newFolderName.name}`)
  })

  it('TC_04.001.06 | Successfully enter a valid folder name in the special field', () => {
    dashboardPage.openDropdownForItem(folderName.name).clickRenameDropdownOption()
    folderPage
      .clearNewNameField()
      .typeNewFolderName(newFolderName.name)
      .getNewNameField()
      .should('have.value', newFolderName.name)
  })

  it('TC_04.001.03| Verify that error message is displayed when an invalid folder name is entered in the Rename Folder field', () => {
    dashboardPage.openDropdownForItem(folderName.name).clickRenameDropdownOption()
    folderPage
      .clearNewNameField()
      .typeNewFolderName(newFolderName.name + '*')
      .clickRenameButton()

    folderPage.getFolderNameOnMainPanel().should('contain', 'is an unsafe character')
  })

  it('TC_04.001.04 |Verify to rename the folder from drop-down menu of the folder element in the breadcrumbs', () => {
    header.hoverBreadcrumbsFolderName().getBreadcrumbsFolderDropdownMenu().click({ force: true })
    dashboardPage.getRenameProjectDropdownMenuItem().click()

    folderPage
      .clearNewNameField()
      .typeNewFolderName(newFolderName.name)
      .getNewNameField()
      .should('have.value', newFolderName.name)
  })

  it('TC_04.001.05 | Rename folder from drop-down menu', () => {
    dashboardPage.openDropdownForItem(folderName.name).clickRenameDropdownOption()
    folderPage.clearNewNameField().typeNewFolderName(newFolderName.name).clickRenameButton()
    folderPage.getFolderNameOnMainPanel().should('include.text', `${newFolderName.name}`)
  })
  it('TC_04.001.12 | Verify that there is "Display Name" field and hint sign in the Configure section', () => {
    dashboardPage.clickItemName(folderName.name)
    folderPage.clickConfigureLMenuOption()
    folderPage.getDisplayNameField().should('exist').and('be.visible')
    folderPage.getDisplayNameTooltip().should('exist').and('be.visible')
  })
})
