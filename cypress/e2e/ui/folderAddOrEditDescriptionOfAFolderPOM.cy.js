import FolderPage from '@pageObjects/FolderPage.js'
import NewJobPage from '@pageObjects/NewJobPage.js'
import BasePage from '@pageObjects/basePage.js'

import genData from '@fixtures/helpers/genData.js'

const basePage = new BasePage()
const newJobPage = new NewJobPage()
const folderPage = new FolderPage()
let folder = genData.newProject()

describe('US_04.004 | Folder > Add or Edit Description of a Folder', () => {
  beforeEach(() => {
    basePage.clickNewItemMenuOption()
    newJobPage.typeNewItemName(folder.name).selectFolder().clickOKButton()
  })
  it('TC_04.004.04 | Enter a long text in the description field', () => {
    folderPage
      .typeDescription(folder.longDescription)
      .clickSaveButton()

      .getFolderDescription()
      .should('be.visible')
      .and('have.text', folder.longDescription)
    cy.cleanData([folder.name])
  })
})
