import { click } from 'cypress-real-events/commands/click'

import DashboardPage from '../pageObjects/DashboardPage'
import ConfigurePage from './ConfigurePage'

class ManageJenkinsPage extends DashboardPage {
  getSettingsSearchField = () => cy.get('#settings-search-bar')
  getNoResultsErrorMessage = () => cy.get('.jenkins-search__results__no-results-label')
  getSearchResultList = () => cy.get('.jenkins-search__results > *')
  getXButtonSearchField = () => cy.get('.jenkins-search__shortcut')
  getUsersIcon = () => cy.get('a[href="securityRealm/"]')
  getMenuItems = () => cy.get('.jenkins-section__items dl dt')

  typeSearchWord(word) {
    this.getSettingsSearchField().type(word)
    return this
  }

  clearSearchField() {
    this.getSettingsSearchField().clear()
    return this
  }

  assertSearchResult(word) {
    this.getSearchResultList().should('contain', word)
    return this
  }
  clickXButtonSearchField() {
    this.getXButtonSearchField().click()
    return this
  }

  clickUsersIcon() {
    this.getUsersIcon().click()
    return this
  }

  clickSearchResult(word) {
    this.getSearchResultList().contains(`${word}`).click()
    return new ConfigurePage()
  }
}

export default ManageJenkinsPage
