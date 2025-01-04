import Header from '../pageObjects/Header'

class BasePage extends Header {
  getNewItemMenuOption = () => cy.get('[href $= "/newJob"]')
  getMoveMenuItem = () => cy.get('a[href$="/move"]') //please rename to getMoveMenuOption
  getRenameMenuOption = () => cy.get('[href*="rename"]')
  getBuildNowMenuOption = () => cy.contains('a[href*="build"]', 'Build Now')
  getNewItemLink = () => cy.get('a[href="/view/all/newJob"]') //please delete as duplicate for getNewItemMenuOption
  getConfigureMenuOption = () => cy.get('#side-panel [href$="configure"]')

  getMoveButton = () => cy.contains('button', /Move/)
  getYesButton = () => cy.contains('button', /Yes/)
  getSaveButton = () => cy.contains('button', /Save/)
  getRenameButton = () => cy.get('button.jenkins-submit-button')
  getCancelButton = () => cy.contains('button', /Cancel/)
  getOKButton = () => cy.contains('button', /OK/) //y.get('#ok-button').contains('OK');

  getJobHeadline = () => cy.get('#main-panel h1') // please rename to getItemTitle since we have it in multiple places
  getBuildHistoryRows = () => cy.get('#buildHistory td[class="build-row-cell"]')

  clickNewItemMenuOption() {
    this.getNewItemMenuOption().click()
    return this
  }

  clickNewItemMenuLink() {
    //please delete as duplicate to clickNewItemMenuOption, make sure to replase all
    this.getNewItemLink().click({ force: true })
    return this
  }

  clickMoveMenuOption() {
    this.getMoveMenuItem().click()
    return this
  }

  clickRenameMenuOption() {
    this.getRenameMenuOption().click()
    return this
  }

  clickBuildNowMenuOption() {
    this.getBuildNowMenuOption().click()
    return this
  }

  clickConfigureLMenuOption() {
    this.getConfigureMenuOption().click()
    return this
  }

  clickSaveButton() {
    this.getSaveButton().click()
    return this
  }

  clickYesButton() {
    this.getYesButton().click()
    return this
  }

  clickOKButton() {
    this.getOKButton().click()
    return this
  }

  clickRenameButton() {
    this.getRenameButton().click()
    return this
  }

  clickMoveButton() {
    this.getMoveButton().click()
    return this
  }

  clickCancelButton() {
    this.getCancelButton().click()
    return this
  }
}
export default BasePage
