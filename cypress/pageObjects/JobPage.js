class JobPage {
  getHeadlineIndex = () => cy.get('h1.job-index-headline.page-headline')

  getTextFromHeadlineIndex() {
    return this.getHeadlineIndex().then($el => $el.text())
  }

  getProjectDescription = () => cy.get('[id="description"]')
}
export default JobPage
