import { newInstance } from '../fixtures/newJobPageData.json'
import DashboardPage from '../pageObjects/DashboardPage'
import Header from '../pageObjects/Header'
import NewJobPage from '../pageObjects/NewJobPage'

const dashBoardPage = new DashboardPage()
const newJobPage = new NewJobPage()
const header = new Header()

describe('US_08.001 | Build history > Start to build a project', () => {
  function createItemByType(itemsType, itemsName) {
    dashBoardPage.clickNewItemMenuLink()
    newJobPage
      .clearItemNameField()
      .typeNewItemName(`New ${itemsName}`)
      .getAllItemsList()
      .contains(itemsType)
      .click()
    newJobPage.clickOKButton().clickSaveButton()
    header.clickDashboardBtn()
  }
  const itemsForBuilding = newInstance.filter(
    item =>
      !['Folder', 'Organization Folder', 'Multibranch Pipeline'].includes(item)
  )

  itemsForBuilding.forEach(item => {
    it(`TC_08.001.01 | Build status icon for "Not built" ${item} is shown on "Dashboard" page`, () => {
      createItemByType(item, `New ${item}`)
      dashBoardPage
        .getAllIconsProjectRow(item)
        .eq(0)
        .should('have.attr', 'tooltip', 'Not built')
        .and('be.visible')
      cy.cleanData([`New New ${item}`])
    })
  })

  itemsForBuilding.forEach(item => {
    it(`TC_08.001.02 | The build is triggered from the ${item}'s dropdown menu`, () => {
      createItemByType(item, `New ${item}`)
      dashBoardPage
        .openDropdownForItem(`New ${item}`)
        .clickBuildNowDropdownMenuItem()
        .getNotificationBar()
        .should('not.have.class', 'jenkins-notification--hidden')
        .and('contain.text', 'Build Now: Done.')

      dashBoardPage.clickItemName(`New ${item}`)
      dashBoardPage
        .getBuildHistoryRows()
        .should('have.length', 1)
        .contains('1')
        .should('be.visible')
      cy.cleanData([`New New ${item}`])
    })
  })
})
