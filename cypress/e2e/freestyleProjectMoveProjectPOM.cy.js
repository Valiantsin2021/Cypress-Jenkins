/// <reference types="cypress"/>

import { faker } from '@faker-js/faker'

import DashboardPage from '../pageObjects/DashboardPage'
import NewJobPage from '../pageObjects/NewJobPage'
import Header from '../pageObjects/Header'
import FreestyleProjectPage from '../pageObjects/FreestyleProjectPage'

import newJobPageData from '../fixtures/newJobPageData.json'

const dashboardPage = new DashboardPage()
const newJobPage = new NewJobPage()
const header = new Header()
const freestyleProjectPage = new FreestyleProjectPage()

describe('US_01.006 | FreestyleProject > Move project', () => {
  it('TC_01.006.06 | Choose from a list of existing folders', () => {
    context('should create 5 folders and verify they exist', () => {
      dashboardPage.clickNewItemMenuLink()
      newJobPage.typeNewItemName(newJobPageData.projectName).selectFreestyleProject().clickOKButton()
      freestyleProjectPage.clickSaveButton()
      header.clickJenkinsLogo()

      for (let i = 1; i <= 5; i++) {
        const uniqueFolderName = `${newJobPageData.folderName} ${i}`
        dashboardPage.clickNewItemMenuLink()
        newJobPage.typeNewItemName(uniqueFolderName).selectFolder().clickOKButton()
        header.clickJenkinsLogo()
        cy.contains(uniqueFolderName).should('exist')
      }
    })

    const randomFolderNumber = faker.number.int({ min: 1, max: 5 })
    const selectedFolder = `${newJobPageData.folderName} ` + randomFolderNumber
    dashboardPage.openProjectPage(newJobPageData.projectName)
    freestyleProjectPage.clickMoveMenuItem().selectNewProjectDestination(`/${selectedFolder}`).clickMoveButton()

    freestyleProjectPage.getProjectInfoSection().should('contain', `Full project name: ${selectedFolder}/${newJobPageData.projectName}`)
  })
})
