describe.skip('Accessibility', { tags: ['@accessibility'] }, () => {
  // NOTE: AXE analysis can spend quite some time, so it is recommended to increase the default command timeout for such tests
  Cypress.config('defaultCommandTimeout', 15000)
  it('Default analysis', () => {
    //    Default settings:
    //   - Analyze entire document
    //   - includedImpacts: ['critical', 'serious']
    //   - runOnly:['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] }
    //   - generateReport: true
    //   - iframes: true

    cy.checkAccessibility()
  })
  it('All levels of severity', () => {
    cy.checkAccessibility(null, { includedImpacts: ['critical', 'serious', 'moderate', 'minor'] })
  })
  it('Custom colors by severity', () => {
    const customImpactStyling = {
      serious: { icon: '🟢', style: 'fill: #42C600; fill-opacity: 0; stroke: #42C600; stroke-width: 7;' },
      moderate: {
        icon: '🟣',
        style: 'fill: #886DE7; fill-opacity: 0.3; stroke: #886DE7; stroke-width: 6; stroke-dasharray: 5,3;'
      },
      minor: { style: 'fill: #4598FF; fill-opacity: 0; stroke: #4598FF; stroke-width: 14; ' },
      fixme: { icon: '🪓' }
    }

    cy.checkAccessibility(null, {
      impactStyling: customImpactStyling,
      includedImpacts: ['critical', 'serious', 'moderate', 'minor']
    })
  })
  it('Disable rules "contrast" and "valid-lang"', () => {
    cy.checkAccessibility(null, { rules: { 'color-contrast': { enabled: false }, 'valid-lang': { enabled: false } } })
  })
  it('Context Exclude Test', () => {
    cy.checkAccessibility({ exclude: '#side-panel' })
  })
  it('Context Include Test', () => {
    cy.checkAccessibility({ include: '#side-panel' })
  })
  it('Only Critical Severity Test', () => {
    cy.checkAccessibility(null, { includedImpacts: ['critical'] })
  })
  it('Only Rule Tag wcag20 Test', () => {
    cy.checkAccessibility(null, { runOnly: ['wcag2a', 'wcag2aa'] })
  })
  it('Only Rule Tag wcag20aa Test', () => {
    cy.checkAccessibility(null, { runOnly: ['wcag2aa'] })
  })
  it('Disable report generation', () => {
    cy.checkAccessibility(null, {
      generateReport: false,
      includedImpacts: ['critical', 'serious', 'moderate', 'minor']
    })
  })
  it('Provide context as Array of CSS selectors', () => {
    cy.checkAccessibility(['#side-panel, #page-header'], {
      includedImpacts: ['critical', 'serious', 'moderate', 'minor'],
      runOnly: ['best-practice']
    })
  })
  it('Provide context as HTML Element', () => {
    cy.document().then(doc => {
      cy.checkAccessibility(doc.getElementById('side-panel'), {
        includedImpacts: ['critical', 'serious', 'moderate', 'minor']
      })
    })
  })
  it('Provide context as Array of HTML Elements', () => {
    cy.document().then(doc => {
      cy.checkAccessibility([doc.getElementById('side-panel'), doc.getElementById('page-header')], {
        includedImpacts: ['critical', 'serious', 'moderate', 'minor']
      })
    })
  })
  it('Provide context as HTML NodeList', () => {
    cy.document().then(doc => {
      cy.checkAccessibility(doc.querySelectorAll('div.task'), {
        includedImpacts: ['critical', 'serious', 'moderate', 'minor']
      })
    })
  })
  it('Provide context as Object with "exclude" and "include"', () => {
    cy.checkAccessibility(
      { exclude: '.task', include: '#side-panel' },
      { includedImpacts: ['critical', 'serious', 'moderate', 'minor'] }
    )
  })
  it('Provide context as object with "include" that is an Array of CSS selectors', () => {
    cy.checkAccessibility(
      { include: ['div[role="banner"]', 'ul'] },
      { includedImpacts: ['critical', 'serious', 'moderate', 'minor'], runOnly: ['best-practice'] }
    )
  })
})
