import FolderPage from './FolderPage'
import NewJobPage from './NewJobPage'
import BasePage from './basePage'

class DashboardPage extends BasePage {
  getCreateJobButton = () => cy.contains('a[href="/view/all/newJob"]', 'New Item')
  getMainPanel = () => cy.get('div#main-panel')
  getJobTable = () => cy.get('#projectstatus')
  getJobTitleLink = name => cy.get(`a[href="${encodeURI('job/' + name)}/"]`).first()
  getManageJenkins = () => cy.get('a[href="/manage"]')
  getItemName = () => cy.get('*.jenkins-table__link span')
  getItemChevronIcon = itemName => cy.get(`span:contains('${itemName}') + .jenkins-menu-dropdown-chevron`)
  getJobTableDropdownChevron = name => this.getJobTitleLink(name).find('.jenkins-menu-dropdown-chevron')
  getJobTableDropdownItem = () => cy.get('.jenkins-dropdown__item ', { timeout: 30000 })
  getAllJobNames = () => cy.get('.jenkins-table__link span')
  getDeleteProjectDropdownMenuItem = () => cy.get('button.jenkins-dropdown__item ').contains('Delete Project')
  getDeleteOrganizationFolderDropdownMenuItem = () =>
    cy.get('[class="jenkins-dropdown__item "]').contains('Delete Organization Folder')
  getWelcomeToJenkinsHeadline = () => cy.get('.empty-state-block h1')
  getMoveTheProject = () => cy.get('a[href*="move"]')
  getRenameDropdownOption = () => cy.get('a.jenkins-dropdown__item ').contains('Rename')
  getRenameProjectDropdownMenuItem = () => cy.get('a.jenkins-dropdown__item').contains('Rename') //duplicate to getRenameFolderDropdownMenuItem, may be deleted
  getDeleteProjectDialogBox = () => cy.get('dialog.jenkins-dialog')
  getAllIconsProjectRow = projectName => cy.get(`tr[id$='${projectName}'] svg`)
  getAddViewLink = () => cy.get('[href="/newView"]')
  getViewNameInput = () => cy.get('input#name')
  getListViewRadio = () => cy.get('[for="hudson.model.ListView"]')
  getCreateViewButton = () => cy.get('button#ok')
  getSubmitViewCreationButton = () => cy.get('button[name="Submit"]') //make sure it's a correct button name
  getCurrentViewBreadcrumbsItem = () => cy.get('.jenkins-breadcrumbs__list-item').eq(1)
  getViewTab = viewName => cy.get('div.tab').contains(viewName)
  getSortingArrowOfNameColumn = () => cy.get('th[initialsortdir="down"] span.sortarrow')
  getAllItemNamesFromNameColumn = () => cy.get('table#projectstatus tbody tr a span')
  getBuildNowDropdownMenuItem = () => cy.get('button.jenkins-dropdown__item').contains('Build Now')
  getNotificationBar = () => cy.get('#notification-bar')
  getUserName = userName => cy.contains('a', userName)
  getLastStableColumn = () => cy.contains('.sortheader', 'Last Stable')
  getWeatherColumn = () => cy.get('a[href="#"]').contains('W')
  getDescriptionColumn = () => cy.get('a[href="#"]').contains('Description')
  selectNewItemFromDashboardChevron() {
    this.getJobTableDropdownItem().each($els => {
      let eText = $els.text().trim()
      if (eText === 'New Item') {
        cy.wrap($els).click({ force: true })
      }
    })
    return new NewJobPage()
  }

  clickJobTitleLink(name) {
    this.getJobTitleLink(name).click({ force: true })
  }

  clickManageJenkins() {
    this.getManageJenkins().click({ force: true })
    return this
  }

  clickItemName(projectName) {
    this.getItemName().contains(projectName).click({ force: true })
  }

  getSessionCookie(cookieName) {
    return cy.getCookies().then(cookies => cookies.find(cookie => cookie.name.includes(cookieName)).value)
  }

  openDropdownForItem(projectName) {
    this.getItemName().contains(projectName).trigger('mouseover').should('be.visible')
    this.getItemChevronIcon(projectName).click({ force: true })
    return this
  }

  clickJobName(name) {
    this.getJobTable().contains(name).click({ force: true })
    return new NewJobPage()
  }

  hoverJobTitleLink(name) {
    this.getJobTitleLink(name).trigger('mouseover')
    return this
  }

  clickProjectChevronIcon(projectName) {
    this.getItemChevronIcon(projectName).click({ force: true })
    return this
  }

  clickJobTableDropdownChevron(name) {
    this.getJobTableDropdownChevron(name).click({ force: true })
    return this
  }

  clickDeleteProjectDropdownMenuItem() {
    this.getDeleteProjectDropdownMenuItem().should('be.visible').click()
    return this
  }

  clickDeleteOrganizationFolderDropdownMenuItem() {
    this.getDeleteOrganizationFolderDropdownMenuItem().click({ force: true })
    return this
  }

  clickCreateJobLink() {
    this.getCreateJobButton().click({ force: true })
    return this
  }

  clickRenameDropdownOption() {
    this.getRenameDropdownOption().realClick({ force: true })
    return this
  }

  clickMoveDropdownOption() {
    this.getMoveTheProject().click({ force: true })
    return this
  }

  clickRenameProjectDropdownMenuItem() {
    this.getRenameProjectDropdownMenuItem().click({ force: true })
    return this
  }

  clickAddViewLink() {
    this.getAddViewLink().click({ force: true })
    return this
  }

  typeViewName(viewName) {
    this.getViewNameInput().type(viewName)
    return this
  }

  clickListViewRadio() {
    this.getListViewRadio().click({ force: true })
    return this
  }

  clickCreateViewButton() {
    this.getCreateViewButton().click({ force: true })
    return this
  }

  clickSubmitViewCreationButton() {
    this.getSubmitViewCreationButton().click({ force: true })
    return this
  }

  clickSortingArrowOfNameColumn() {
    this.getSortingArrowOfNameColumn().click({ force: true })
    return this
  }

  clickBuildNowDropdownMenuItem() {
    this.getBuildNowDropdownMenuItem().click({ force: true })
    return this
  }
  checkUserNameVisible(userName) {
    this.getUserName(userName).should('be.visible')
    return this
  }
  clickViewTab(viewName) {
    this.getViewTab(viewName).click({ force: true })
    return this
  }
  clickFolderMoveDropdownOption() {
    this.getMoveTheProject().click({ force: true })
    return new FolderPage()
  }
}

export default DashboardPage
