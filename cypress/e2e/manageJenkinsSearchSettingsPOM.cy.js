/// <reference types="cypress" />

import { faker } from '@faker-js/faker'

import DashboardPage from '../pageObjects/DashboardPage'
import ManageJenkinsPage from '../pageObjects/ManageJenkinsPage'

import messages from '../fixtures/messages.json'

const dashboardPage = new DashboardPage()
const manageJenkinsPage = new ManageJenkinsPage()

const randomSearchWord = faker.animal.type() + faker.finance.accountNumber(3)
const listOfPossibleSearchResults = ['System', 'Tools', 'Security', 'Credentials', 'Credential Providers']

describe('US_09.001 | Manage Jenkins > Search settings', () => {
  it('TC_09.001.02 | Verify "No results" is shown if no settings match the search criteria', () => {
    dashboardPage.clickManageJenkins()
    manageJenkinsPage.typeSearchWord(randomSearchWord)
    manageJenkinsPage.getNoResultsErrorMessage().should('be.visible').and('have.text', messages.searchSettings.noResultsError)
  })

  it('TC_09.001.03 | Verify search suggestion dropdown displays all matches available', () => {
    dashboardPage.clickManageJenkins()
    manageJenkinsPage.typeSearchWord('t').getSearchResultList().should('have.length', listOfPossibleSearchResults.length)

    listOfPossibleSearchResults.forEach(dropDownItem => {
      manageJenkinsPage.getSearchResultList().should('contain', dropDownItem)
    })
  })
})