import ManageJenkinsPage from '../pageObjects/ManageJenkinsPage'

class ConfigurePage {
  getBreadcrumbsManageJenkins = () => cy.get('[href="/manage/"]')

  clickBreadcrumbsManageJenkins() {
    this.getBreadcrumbsManageJenkins().click({ force: true })
    return new ManageJenkinsPage()
  }
}
export default ConfigurePage
