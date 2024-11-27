/// <reference types="cypress" />

import { faker } from '@faker-js/faker'

import Header from '../pageObjects/Header'
import DashboardPage from '../pageObjects/DashboardPage'
import NewJobPage from '../pageObjects/NewJobPage'

import { newItem } from '../fixtures/messages.json'

const header = new Header()
const dashboardPage = new DashboardPage()
const newJobPage = new NewJobPage()

describe('US_00.000 | New Item > Create New item', () => {
  const randomItemName = faker.lorem.words()
  const wrongJobName = 'Item#1'

  it('TC_00.000.01| Create new item from "Create a job" button| Invalid data', () => {
    dashboardPage.clickCreateJobButton()

    newJobPage.addUnsaveNameItem(wrongJobName).getUnsaveItemInvalidName().should('be.visible').and('have.class', 'input-validation-message').contains(newItem.newItemNameInvalidMessage)

    newJobPage.addEmptyNameItem().getEmptyItemInvalidName().should('be.visible').and('have.class', 'input-validation-message').contains(newItem.emptyNameFieldReminder)
  })

  it('TC_00.000.02 | Create new item from "Create a job" button', () => {
    dashboardPage
      .getMainPanel()
      .contains(randomItemName)
      .should('not.exist')
      .then(() => {
        dashboardPage.clickCreateJobButton()
      })
    newJobPage.addNewProjectName(randomItemName).selectFreestyleProject().clickOKButton()
    header.clickJenkinsLogo()
    dashboardPage.getJobTable().contains(randomItemName).should('exist')
  })
})
