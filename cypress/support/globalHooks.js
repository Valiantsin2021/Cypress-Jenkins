const USERNAME = Cypress.env('local.admin.username')
const PASSWORD = Cypress.env('local.admin.password')
const isUITest = Cypress.spec.relative.includes('ui') || Cypress.spec.relative.includes('performance')
beforeEach(() => {
  if (isUITest) {
    chai.config.truncateThreshold = 0
    chai.config.includeStack = true
    chai.config.showDiff = true
    // cy.cleanData(null, true) // if need to clean data totally?
    cy.login(USERNAME, PASSWORD)
  }
})
