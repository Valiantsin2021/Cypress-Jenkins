import { newInstance } from '../fixtures/newJobPageData.json'
import DashboardPage from '../pageObjects/DashboardPage'
import Header from '../pageObjects/Header'
import NewJobPage from '../pageObjects/NewJobPage'

const dashBoardPage = new DashboardPage()
const newJobPage = new NewJobPage()
const header = new Header()

describe('US_08.001 | Build history > Start to build a project', () => {
  newInstance
    .filter(
      item =>
        !['Folder', 'Organization Folder', 'Multibranch Pipeline'].includes(
          item
        )
    )
    .forEach(item => {
      it(`TC_08.001.01 | Verify build status icon for "Not built" ${item} is shown on "Dashboard" page`, () => {
        dashBoardPage.clickNewItemMenuLink()
        newJobPage
          .clearItemNameField()
          .typeNewItemName(`New ${item}`)
          .getAllItemsList()
          .contains(item)
          .click()
        newJobPage.clickOKButton().clickSaveButton()
        header.clickDashboardBtn()

        dashBoardPage
          .getAllIconsProjectRow(item)
          .eq(0)
          .should('have.attr', 'tooltip', 'Not built')
          .and('be.visible')
        cy.cleanData([`New ${item}`])
      })
    })
})
