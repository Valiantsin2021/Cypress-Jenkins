class Header {
  getSearchField = () => cy.get('#search-box')
  getSearchAutoCompletionBox = () => cy.get('div#search-box-completion li')
  getUserDropdownlink = () => cy.get('#page-header .jenkins-menu-dropdown-chevron')
  getDropdownConfigureItem = () => cy.get('.jenkins-dropdown > [href*="/configure"]')
  getJenkinsLogo = () => cy.get('a#jenkins-home-link')
  getUserNameLink = () => cy.get('[href^="/user"]')
  getUserDropdownMenu = () => cy.get('.jenkins-dropdown')
  getUserDropdownIcon = () => cy.get('.jenkins-dropdown__item__icon')
  getSearchAutofillSuggestionList = () => cy.get('li[style]:not([style="display: none;"])')
  getLogOutButton = () => cy.get('a[href="/logout"]')

  getBreadcrumps = () => cy.get('.jenkins-breadcrumbs')
  getDashboardBreadcrumbsLink = () => cy.get('#breadcrumbs a[href="/"]')
  getDashboardLink = () => cy.get('a[href="/"].model-link')
  getBreadcrumbBar = () => cy.get('#breadcrumbBar')
  getDashboardBreadcrumb = () => cy.get('a[href="/"].model-link')
  getDashboardBreadcrumbChevron = () => cy.get('a[href="/"] .jenkins-menu-dropdown-chevron')
  getBreadcrumbsFolderName = () => cy.get(':nth-child(3) > .model-link')
  getBreadcrumbsFolderDropdownMenu = () =>
    cy.get(':nth-child(3) > .model-link > .jenkins-menu-dropdown-chevron').first()
  getHeader = () => cy.get('#page-header')

  typeSearchTerm(term) {
    this.getSearchField().type(term)
    return this
  }
  clearSearchField() {
    this.getSearchField().clear()
    return this
  }
  clickFirstOptionFromACBox() {
    this.getSearchAutoCompletionBox().first().click()
    return this
  }

  searchTerm() {
    this.getSearchField().type('{enter}')
    return this
  }

  search(input) {
    this.getSearchField().type(`${input}{enter}`)
    return this
  }

  clickUserDropdownLink() {
    this.getUserDropdownlink().realHover().click({ force: true })
    return this
  }

  clickUserConfigureItem() {
    this.getDropdownConfigureItem().click({ force: true })
    return this
  }

  clickJenkinsLogo() {
    this.getJenkinsLogo().click({ force: true })
    return this
  }

  clickLogOutButton() {
    this.getLogOutButton().click({ force: true })
    return this
  }

  clickDashboardBtn() {
    this.getBreadcrumps().contains('Dashboard').click({ force: true })
    return this
  }

  clickDashboardBreadcrumbsLink() {
    this.getDashboardBreadcrumbsLink().click({ force: true })
    return this
  }

  hoverDashboardDropdownChevron() {
    this.getDashboardBreadcrumb().realHover()
    return this
  }

  hoverBreadcrumbsFolderName() {
    this.getBreadcrumbsFolderName().realHover()
    return this
  }
  clickDashboardDropdownChevron() {
    this.getDashboardBreadcrumbChevron().click({ force: true })
    return this
  }

  verifyAutoCompletionNotVisible() {
    this.getSearchAutoCompletionBox().should('not.be.visible')
    return this
  }

  clickUserName() {
    this.getUserNameLink().first().click({ force: true })
    return this
  }

  verifyAutoCompletionVisible(searchTerm) {
    this.getSearchAutofillSuggestionList().each($row => {
      cy.wrap($row).invoke('text').should('contain', searchTerm)
    })
    return this
  }

  tabAndClickLogoutButton() {
    const getLogoutButton = 'a[href="/logout"]'

    for (let attempts = 0; attempts < 10; attempts++) {
      cy.realPress('Tab')

      cy.focused().then($focusedElement => {
        if ($focusedElement.is(getLogoutButton)) {
          cy.realPress('Enter')
          return
        }
      })
    }
    return this
  }
}

export default Header
