import { faker } from '@faker-js/faker'
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)]
}
const statuses = ['active', 'inactive']
const countries = ['India', 'United States', 'Canada', 'Australia', 'New Zealand', 'Israel', 'Singapore']
export class UserBuilder {
  constructor() {
    /**
     * The user object being constructed.
     * @type {Object}
     * @private
     */
    this.user = {}
  }
  /**
   * Set default values for user properties using faker library.
   *
   * @return {Object} The updated object with default values set.
   */

  setDefaults() {
    this.user.id = faker.string.uuid()
    this.user.firstName = faker.person.firstName('male')
    this.user.lastName = faker.person.lastName('male')
    this.user.name = faker.person.firstName('male') + ' ' + faker.person.lastName('male')
    this.user.title = faker.person.prefix()
    this.user.email = faker.internet.email().toLowerCase()
    this.user.countryCode = faker.number.int({ min: 0, max: 30 })
    this.user.password = faker.internet.password()
    this.user.phoneNumber = faker.string.numeric(9)
    this.user.street = faker.location.streetAddress({ useFullAddress: true })
    this.user.city = faker.location.city()
    this.user.state = faker.location.state()
    this.user.postalCode = faker.location.zipCode()
    this.user.country = getRandomItem(countries) || faker.location.country()
    this.user.dateOfBirth = faker.date.birthdate().toISOString().slice(0, 10)
    this.user.day = faker.number.int({ min: 1, max: 31 }).toString()
    this.user.month = faker.date.month()
    this.user.year = faker.date.birthdate().toISOString().slice(0, 4)
    this.user.cardNumber = faker.finance.creditCardNumber()
    this.user.cvc = faker.finance.creditCardCVV()
    this.user.gender = faker.person.sex()
    this.user.status = getRandomItem(statuses)
    this.user.company = faker.company.name()
    this.user.message = faker.lorem.sentence()
    return this
  }
  /**
   * Set the first name for the user.
   *
   * @param {string} firstName - the first name to be set
   * @return {object} this - for method chaining
   */
  withFirstName(firstName) {
    this.user.firstName = firstName
    return this
  }
  /**
   * Set the last name of the user.
   *
   * @param {string} lastName - the last name to set
   * @return {object} - the current object for chaining
   */
  withLastName(lastName) {
    this.user.lastName = lastName
    return this
  }
  /**
   * Set the email for the user.
   *
   * @param {string} email - the email to be set for the user
   * @return {Object} - the current object instance
   */
  withEmail(email) {
    this.user.email = email
    return this
  }
  /**
   * Sets the country code for the user.
   *
   * @param {number} code - The country code to set for the user
   * @return {Object} - The updated object with the country code set
   */
  withCountryCode(code) {
    this.user.countryCode = code
    return this
  }
  /**
   * Set the password for the user.
   *
   * @param {string} password - the password to set for the user
   * @return {Object} - the current object instance
   */
  withPassword(password) {
    this.user.password = password
    return this
  }
  /**
   * Assigns a phone number to the user.
   *
   * @param {number} number - the phone number to assign
   * @return {Object} the current object instance
   */
  withPhoneNumber(number) {
    this.user.phoneNumber = number
    return this
  }
  /**
   * Set the street for the user.
   *
   * @param {string} street - The street to set for the user
   * @return {Object} - The current object instance
   */
  withStreet(street) {
    this.user.street = street
    return this
  }
  /**
   * Set the city for the user.
   *
   * @param {string} city - the city to set for the user
   * @return {Object} this - the object with the updated city
   */
  withCity(city) {
    this.user.city = city
    return this
  }
  /**
   * Set the state of the user and return the updated object.
   *
   * @param {string} state - the new state to set for the user
   * @return {Object} the updated object with the new state
   */
  withState(state) {
    this.user.state = state
    return this
  }
  /**
   * Sets the postal code for the user.
   *
   * @param {string} zip - The postal code to be set
   * @return {Object} this - The current object for method chaining
   */
  withPostalCode(zip) {
    this.user.postalCode = zip
    return this
  }
  /**
   * Sets the country for the user.
   *
   * @param {string} country - the country to set for the user
   * @return {Object} - the updated object with the country set
   */
  withCountry(country) {
    this.user.country = country
    return this
  }
  /**
   * Set the user's date of birth.
   *
   * @param {Date} dateOfBirth - the user's date of birth
   * @return {Object} - the current object instance
   */
  withDateOfBirth(dateOfBirth) {
    this.user.dateOfBirth = dateOfBirth
    return this
  }
  /**
   * Set the gender of the user.
   *
   * @param {string} sex - the gender to set for the user
   * @return {Object} - the current object instance
   */
  withGender(sex) {
    this.user.gender = sex
    return this
  }
  /**
   * Sets the status for the user and returns the instance.
   *
   * @param {string} status - the status to set for the user
   * @return {object} - the instance with the updated status
   */
  withStatus(status) {
    this.user.status = status
    return this
  }
  /**
   * Set the company for the user.
   *
   * @param {string} companyName - the name of the company to set
   * @return {Object} - the updated object with the company set
   */
  withCompany(companyName) {
    this.user.company = companyName
    return this
  }
  /**
   * A method to build user object.
   *
   * @return {Object} the user object
   */
  build() {
    return this.user
  }
}
export const user = new UserBuilder().setDefaults().build()
