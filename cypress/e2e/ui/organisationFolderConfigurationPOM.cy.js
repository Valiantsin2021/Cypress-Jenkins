import { faker } from '@faker-js/faker'
import DashboardPage from '@pageObjects/DashboardPage.js'
import Header from '@pageObjects/Header.js'
import NewJobPage from '@pageObjects/NewJobPage.js'
import OrganizationFolderPage from '@pageObjects/OrganizationFolderPage.js'

const dashboardPage = new DashboardPage()
const newJobPage = new NewJobPage()
const header = new Header()
const organizationFolderPage = new OrganizationFolderPage()

describe('US_06.001 | Organisation folder > Configuration', () => {
  let orgFolderName = faker.commerce.productName()
  const encodedOrgFolderName = encodeURIComponent(orgFolderName)
  let displayName = faker.commerce.productName()
  let description = faker.lorem.sentences()
  it('TC_06.001.01 | Change Display Name and Description from empty values', () => {
    cy.log('Preconditions:')
    dashboardPage.clickNewItemMenuLink()
    newJobPage.typeNewItemName(orgFolderName).selectOrganizationFolder().clickOKButton()
    header.clickJenkinsLogo()

    cy.log('Steps:')
    dashboardPage.clickItemName(orgFolderName)
    organizationFolderPage
      .clickConfigureLMenuOption()
      .typeDisplayName(displayName)
      .typeDescription(description)
      .clickSaveButton()

    organizationFolderPage
      .getDisplayName()
      .invoke('text')
      .then(text => {
        expect(text.trim()).to.equal(displayName)
      })

    organizationFolderPage.getDescription().should('have.text', description)

    organizationFolderPage.getFolderName().should('contain.text', `Folder name: ${orgFolderName}`)

    cy.url().should('match', new RegExp(`${encodedOrgFolderName}\/?$`))

    header.clickJenkinsLogo()
    dashboardPage.getItemName().contains(displayName).should('be.visible')
    cy.cleanData([orgFolderName])
  })

  it('TC_06.001.02 | Can see a Preview of the added Description by clicking on the Preview button', () => {
    cy.log('create a new org folder')
    dashboardPage.clickNewItemMenuLink()
    newJobPage.typeNewItemName(orgFolderName).selectOrganizationFolder().clickOKButton()

    cy.log('before clicking Preview link')
    organizationFolderPage.typeDescription(description).checkPreviewDescriptionBeforeClick()

    cy.log('after clicking Preview link')
    organizationFolderPage
      .clickPreviewDescriptionLink()
      .getHidePreviewLink()
      .should('be.visible')
      .and('have.css', 'color', 'rgb(0, 111, 230)')
      .and('have.text', 'Hide preview')
    organizationFolderPage.getPreviewDescriptionField().should('be.visible').and('have.text', description)

    cy.log('after clicking Hide preview')
    organizationFolderPage.clickHidePreviewLink().checkPreviewDescriptionBeforeClick()
    cy.cleanData([orgFolderName])
  })
})
