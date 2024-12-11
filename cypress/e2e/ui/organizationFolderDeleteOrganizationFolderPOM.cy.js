import genData from '../../fixtures/genData'
import DashboardPage from '../../pageObjects/DashboardPage'
import Header from '../../pageObjects/Header'
import NewJobPage from '../../pageObjects/NewJobPage'
import OrganizationFolderPage from '../../pageObjects/OrganizationFolderPage'

const dashboardPage = new DashboardPage()
const newJobPage = new NewJobPage()
const organizationFolderPage = new OrganizationFolderPage()
const header = new Header()

describe('US_06.005 | Organization folder > Delete Organization Folder', () => {
  let project = genData.newProject()

  beforeEach(() => {
    dashboardPage.clickNewItemMenuLink()
    newJobPage
      .typeNewItemName(project.name)
      .selectOrganizationFolder()
      .clickOKButton()
    organizationFolderPage
      .clickSaveButton()
      .getJobHeadline()
      .should('contain.text', project.name)
  })
  afterEach(() => {
    cy.cleanData([project.name])
  })
  it('TC_06.005.01 | Delete Organization Folder from a sidebar menu', () => {
    organizationFolderPage.clickSideMenuDeleteLink().clickYesButton()
    dashboardPage.getMainPanel().should('not.contain.value', project.name)
  })

  it('TC_06.005.02 | Delete Organization Folder from breadcrumbs dropdown menu', () => {
    organizationFolderPage
      .selectBreadcrumbsFolderDropdownMenu()
      .clickBreadcrumbsFolderDropdownMenu()
      .clickDropdownMenuDeleteLink()
      .clickYesButton()
    dashboardPage.getMainPanel().should('not.contain.value', project.name)
  })

  it('TC_06.005.03 | Delete Organization Folder from project status table on Dashboard page', () => {
    header.clickJenkinsLogo()
    dashboardPage
      .clickJobTableDropdownChevron(project.name)
      .clickDeleteOrganizationFolderDropdownMenuItem()
      .clickYesButton()
    dashboardPage.getMainPanel().should('not.contain.value', project.name)
  })

  it('TC_06.005.04 | Delete Organization Folder', () => {
    organizationFolderPage.clickSideMenuDeleteLink().clickYesButton()
    dashboardPage.getMainPanel().should('not.contain.value', project.name)
  })
})
