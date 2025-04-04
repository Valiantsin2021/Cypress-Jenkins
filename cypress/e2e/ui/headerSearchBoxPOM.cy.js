import { faker } from '@faker-js/faker'
import DashboardPage from '@pageObjects/DashboardPage.js'
import FolderPage from '@pageObjects/FolderPage.js'
import FreestyleProjectPage from '@pageObjects/FreestyleProjectPage.js'
import Header from '@pageObjects/Header.js'
import NewJobPage from '@pageObjects/NewJobPage.js'
import PipelinePage from '@pageObjects/PipelinePage.js'
import SearchResuls from '@pageObjects/SearchResultsPage.js'
import UserPage from '@pageObjects/UserPage.js'

import genData from '@fixtures/helpers/genData.js'
import messages from '@fixtures/messages.json'
import configurePageData from '@fixtures/ui_data/configurePageData.json'
import firstCharacterSearchResultsData from '@fixtures/ui_data/firstCharacterSearchResultsData.js'
import headerData from '@fixtures/ui_data/headerData.json'
import newJobPageData from '@fixtures/ui_data/newJobPageData.json'
import searchResultsData from '@fixtures/ui_data/searchResultsData.json'

const header = new Header()
const newJobPage = new NewJobPage()
const dashboardPage = new DashboardPage()
const searchResults = new SearchResuls()
const userPage = new UserPage()
const freestyleProjectPage = new FreestyleProjectPage()
const folderPage = new FolderPage()
const pipelinePage = new PipelinePage()

let searchTermNoMatches = faker.string.alpha(10)
let project = genData.newProject()

const createFreestyleProject = function (jobName) {
  dashboardPage.clickNewItemMenuLink()
  newJobPage.typeNewItemName(jobName).selectFreestyleProject().clickOKButton()
  freestyleProjectPage.clickSaveButton()
}

describe('US_14.002 | Header > Search Box', () => {
  it('TC_14.002.05 | User can select suggestion to auto-fill and complete the search', () => {
    dashboardPage.clickNewItemMenuLink()
    newJobPage.typeNewItemName(newJobPageData.projectName).selectFreestyleProject().clickOKButton()
    freestyleProjectPage.typeJobDescription(configurePageData.projectDescription).clickSaveButton()
    header.typeSearchTerm(newJobPageData.projectName).clickFirstOptionFromACBox().searchTerm()

    freestyleProjectPage.getJobHeadline().should('contain.text', newJobPageData.projectName)
    cy.cleanData([newJobPageData.projectName])
  })

  it('TC_14.002.06 | Multiple matches are displayed on the result page', () => {
    header.search('conf')

    searchResults.getConfigItem().should('contain.text', 'config')
    searchResults.getConfigureItem().should('contain.text', 'configure')
  })

  it('TC_14.002.07 | Verify the search box provides auto-completion', () => {
    header.typeSearchTerm(headerData.search.input.matchForCon)

    header
      .getSearchAutoCompletionBox()
      .filter(':visible')
      .should('have.length', headerData.search.autoCompletionItems.length)
      .each((item, index) => {
        cy.wrap(item).should('have.text', headerData.search.autoCompletionItems[index])
      })
  })

  it('TC_14.002.09 | Verify that the selection of an auto-complete suggestion redirects to the relevant page', () => {
    header.typeSearchTerm(headerData.search.input.matchForLo).clickFirstOptionFromACBox().searchTerm()

    searchResults.getTitle().should('include.text', searchResultsData.title.logRecorders)
  })

  it('TC_14.002.03 | Verify that user can not see suggested results searched with with Upper Case characters with Insensitive mode being on', () => {
    header.clickUserDropdownLink().clickUserConfigureItem()
    userPage.checkCheckBox().clickSaveButton()

    header.typeSearchTerm(headerData.search.input.upperCaseMatchForManage)

    header.getSearchAutoCompletionBox().eq(0).should('contain.text', headerData.search.searchSuggestions.manage)
  })

  it('TC_14.002.10 | Verify that the warning message is displayed when no matches are found', () => {
    header.search(headerData.search.input.noMatches)

    searchResults.getNoMatchesErrorMessage().should('have.text', messages.search.noMatchesError)
  })

  it('TC_14.002-08 | Case insensitive search', () => {
    header.clickUserDropdownLink()
    header.clickUserConfigureItem()

    userPage.getInsensitiveSearchLabel().should('contain', 'Insensitive search tool')
    userPage.getInsensitiveSearchCheckBox().should('exist').and('be.checked')
  })

  it('TC_14.002.04 | Message that no matches found', () => {
    header.search(searchTermNoMatches)
    searchResults.getTitle().and('have.text', `${searchResultsData.heading.text} '${searchTermNoMatches}'`)
    searchResults.getNoMatchesErrorMessage().and('have.text', searchResultsData.error.text)
  })

  it('TC_14.002.15 | Verify suggestions in the search box', () => {
    dashboardPage.clickNewItemMenuLink()
    newJobPage.typeNewItemName('New Folder TC_14.002.15_A').selectFolder().clickOKButton()
    folderPage.clickSaveButton().clickNewItemMenuOption()
    newJobPage.typeNewItemName('Project TC_14.002.15_A').selectPipelineProject().clickOKButton()
    pipelinePage.clickSaveButton()
    header.getJenkinsLogo()
    header.typeSearchTerm('Pro').clickFirstOptionFromACBox().typeSearchTerm('{enter}')

    freestyleProjectPage.getJobHeadline().should('have.text', 'Project TC_14.002.15_A')
    cy.cleanData(['New Folder TC_14.002.15_A', 'Project TC_14.002.15_A'])
  })

  it('TC_14.002.02| Verify error message appears when no matches found', () => {
    header.typeSearchTerm(searchTermNoMatches).verifyAutoCompletionNotVisible().searchTerm()
    searchResults.getNoMatchesErrorMessage().should('contain', searchResultsData.error.text)
  })

  it('TC_14.002.13 | Verify auto-fill suggestions contain the search term', () => {
    cy.log('create a job')
    dashboardPage.clickNewItemMenuLink()
    newJobPage.typeNewItemName(project.name).selectFolder().clickOKButton()
    folderPage.clickSaveButton()

    cy.log('start search')
    header
      .typeSearchTerm(project.name.slice(0, 4))
      .getSearchAutofillSuggestionList()
      .each($row => {
        cy.wrap($row).invoke('text').should('contain', project.name.slice(0, 4))
      })
    cy.cleanData([project.name])
  })

  it('TC_14.002.16 | Finds a build by its number', () => {
    cy.log('spy on build history call')
    cy.intercept('GET', encodeURI(`/job/${project.name}/buildHistory/**`)).as('buildHistory')
    cy.log('create a job and build it')
    createFreestyleProject(project.name)
    freestyleProjectPage.clickBuildNowMenuOption()
    freestyleProjectPage.clickBuildNowMenuOption()

    cy.log('wait till build history call is completed')
    cy.wait('@buildHistory')

    freestyleProjectPage.retrieveBuildNumberAndDate().then(array => {
      array.forEach(el => {
        header
          .typeSearchTerm(`${project.name} ${el.buildNumber}`)
          .verifyAutoCompletionVisible(`${project.name} ${el.buildNumber}`)
          .searchTerm()
        searchResults.getTitle().should('contain', el.buildNumber)
        cy.url().should('include', encodeURI(`/${project.name}/${el.buildNumber.slice(1)}`))
      })
    })
    cy.cleanData([project.name])
  })

  it('TC_14.002.11 | Verify that Dashboard page has a Search box on its top right', () => {
    header.getDashboardLink().should('be.visible')
    header.getHeader().should('exist')
    header.getSearchField().should('exist')
  })
  it.skip('TC_14.002.19 | Verify the search results for Lower and Uppercase characters are the same when insensitive search option is activated', () => {
    const { firstSearchCharacter, characterSearchResults } = firstCharacterSearchResultsData
    const randomFirstSearchCharacter = faker.helpers.arrayElement(firstSearchCharacter)
    header.clickUserDropdownLink().clickUserConfigureItem()
    userPage.checkCheckBox().clickSaveButton()
    header.typeSearchTerm(randomFirstSearchCharacter.toUpperCase()).searchTerm()

    cy.log('Verifying the search results contain the values, corresponding to the specified random Uppercase character')
    const { [randomFirstSearchCharacter]: expectedResults } = characterSearchResults
    searchResults.retrieveSearchResults().then(uiResults => {
      expect(uiResults).to.contain.members(expectedResults)

      header.clearSearchField().typeSearchTerm(randomFirstSearchCharacter.toLowerCase()).searchTerm()
      searchResults.fetchAutoCompletionSuggestions().then(lowerCaseSuggestions => {
        header.clearSearchField().typeSearchTerm(randomFirstSearchCharacter.toUpperCase()).searchTerm()

        cy.log('Verifying the auto - completion suggested variants of the Upper and Lowercase characters are the same')
        searchResults.fetchAutoCompletionSuggestions().then(upperCaseSuggestions => {
          expect(lowerCaseSuggestions).to.contain.members(upperCaseSuggestions)
        })
      })
    })
  })
})
