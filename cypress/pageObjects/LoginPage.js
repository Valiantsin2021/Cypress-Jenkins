class LoginPage {
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
