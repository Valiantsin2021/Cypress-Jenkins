describe('US_14.001 | Visual > Main Page', () => {
  it('TC_14.001.01 | main page layout fits screenshot', () => {
    cy.compareSnapshot('mainPage', { errorThreshold: 0.2 })
  })
})
