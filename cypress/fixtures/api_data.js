import { constants } from './constants_products.js'
import { UserBuilder, user } from './DataBuilder.js'
export const { registeredUser } = constants
export const updatedUser = new UserBuilder().setDefaults().build()
export const payloadPOST = {
  name: user.name,
  email: user.email,
  password: user.password,
  title: user.title,
  birth_date: user.day.toString(),
  birth_month: user.month.toString(),
  birth_year: user.year.toString(),
  firstname: user.firstName,
  lastname: user.lastName,
  company: user.company,
  address1: user.street,
  address2: '',
  city: user.city,
  state: user.state,
  zipcode: user.postalCode,
  country: user.country,
  mobile_number: user.phoneNumber
}
export const payloadPUT = {
  name: payloadPOST.name,
  email: payloadPOST.email,
  password: payloadPOST.password,
  title: updatedUser.title,
  birth_date: updatedUser.day.toString(),
  birth_month: updatedUser.month.toString(),
  birth_year: updatedUser.year.toString(),
  firstname: updatedUser.firstName,
  lastname: updatedUser.lastName,
  company: updatedUser.company,
  address1: updatedUser.street,
  address2: '',
  city: updatedUser.city,
  state: updatedUser.state,
  zipcode: updatedUser.postalCode,
  country: updatedUser.country,
  mobile_number: updatedUser.phoneNumber
}
export const payloadwithoutEmail = {
  password: registeredUser.registeredPassword
}
export const payloadwithoutPassword = {
  email: registeredUser.registeredEmail
}
export const payloadWrongEmail = {
  email: constants.wrongEmail,
  password: payloadPOST.password
}
export const payloadWrongPassword = {
  email: payloadPOST.email,
  password: constants.wrongPassword
}
