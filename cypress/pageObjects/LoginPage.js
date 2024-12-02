class LoginPage {
  getHeader = () => cy.get('h1').contains('Sign in to Jenkins')
  getSignInButton = () => cy.get('button.jenkins-button--primary')

  getSessionCookie(cookieName) {
    return cy
      .getCookies()
      .then(
        cookies =>
          cookies.find(cookie => cookie.name.includes(cookieName)).value
      )
  }
}
export default LoginPage
