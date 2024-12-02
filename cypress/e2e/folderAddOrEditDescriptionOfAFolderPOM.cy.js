/// <reference types="cypress"/>

import DashboardPage from '../pageObjects/DashboardPage'
import NewJobPage from '../pageObjects/NewJobPage'
import FolderPage from '../pageObjects/FolderPage.js'
import genData from '../fixtures/genData'

const dashboardPage = new DashboardPage()
const newJobPage = new NewJobPage()
const folderPage = new FolderPage()
let folder = genData.newProject()

describe('US_04.004 | Folder > Add or Edit Description of a Folder', () => {
  it('TC_04.004.04 | Enter a long text in the description field', () => {
    dashboardPage.clickNewItemMenuLink()
    newJobPage.typeNewItemName(folder.name).selectFolder().clickOKButton()
    folderPage
      .typeDescription(folder.longDescription)
      .clickSaveBtn()

      .getFolderDescription()
      .should('be.visible')
      .and('have.text', folder.longDescription)
  })
})
