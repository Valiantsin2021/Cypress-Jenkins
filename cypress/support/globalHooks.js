const USERNAME = Cypress.env('local.admin.username')
const PASSWORD = Cypress.env('local.admin.password')
const LOCAL_PORT = Cypress.env('local.port')
const LOCAL_HOST = Cypress.env('local.host')
const isUITest = Cypress.spec.relative.includes('ui')
beforeEach(() => {
  if (isUITest) {
    chai.config.truncateThreshold = 0
    chai.config.includeStack = true
    chai.config.showDiff = true
    // cy.cleanData(null, true)
    cy.visit(`http://${LOCAL_HOST}:${LOCAL_PORT}/login`)
    cy.get('#j_username').type(USERNAME)
    cy.get('input[name="j_password"]').type(PASSWORD)
    cy.get('button[name="Submit"]').click()
  }
})
