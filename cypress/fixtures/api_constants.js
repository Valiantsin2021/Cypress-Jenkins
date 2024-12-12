import { UserBuilder, user } from './DataBuilder.js'

export const endpoints = {
  productsList: '/api/productsList',
  brandsList: '/api/brandsList',
  searchProduct: '/api/searchProduct',
  verifyLogin: '/api/verifyLogin',
  getUserDetailByEmail: '/api/getUserDetailByEmail',
  createAccount: '/createAccount',
  login: '/login',
  updateAccount: '/api/updateAccount',
  deleteAccount: '/api/deleteAccount'
}
export const errorMessages = {
  methodNotSupported: 'This request method is not supported.',
  searchParamMissing: 'Bad request, search_product parameter is missing in POST request.',
  userExists: 'User exists!',
  emailOrPasswordMissing: 'Bad request, email or password parameter is missing in POST request.',
  userNotFound: 'User not found!',
  accountNotFound: 'Account not found!',
  emailNotFound: 'Account not found with this email, try another email!'
}
export const messages = {
  userCreated: 'User created!',
  userUpdated: 'User updated!',
  accountDeleted: 'Account deleted!',
  responseStatusOK: 'Response status OK',
  responseCode: code => `Assert response code is ${code}`,
  bodyMessage: message => `Assert body message is ${message}`
}
export const requestsData = {
  csrfToken: 'TTvArnAzfisskvkgFA4ta0SWgwc6psw2Becs5GRFO2v4ZAZI2kyxzd0EVOPWMYJR',
  wrongEmail: '12345qwert@co.co',
  wrongPassword: '12345qwert',
  categories: ['WOMEN', 'MEN', 'KIDS'],
  brands: [' Polo', ' H&M', ' Madame', ' Mast & Harbour', ' Babyhug', ' Allen Solly Junior', ' Kookie Kids', ' Biba'],
  products: [
    'Blue Top',
    'Men Tshirt',
    'Sleeveless Dress',
    'Stylish Dress',
    'Winter Top',
    'Summer White Top',
    'Madame Top For Women',
    'Fancy Green Top',
    'Sleeves Printed Top - White',
    'Half Sleeves Top Schiffli Detailing - Pink',
    'Frozen Tops For Kids',
    'Full Sleeves Top Cherry - Pink',
    'Printed Off Shoulder Top - White',
    'Sleeves Top and Short - Blue & Pink',
    'Little Girls Mr. Panda Shirt',
    'Sleeveless Unicorn Patch Gown - Pink',
    'Cotton Mull Embroidered Dress',
    'Blue Cotton Indie Mickey Dress',
    'Long Maxi Tulle Fancy Dress Up Outfits -Pink',
    'Sleeveless Unicorn Print Fit & Flare Net Dress - Multi',
    'Colour Blocked Shirt – Sky Blue',
    'Pure Cotton V-Neck T-Shirt',
    'Green Side Placket Detail T-Shirt',
    'Premium Polo T-Shirts',
    'Pure Cotton Neon Green Tshirt',
    'Soft Stretch Jeans',
    'Regular Fit Straight Jeans',
    'Grunt Blue Slim Fit Jeans',
    'Rose Pink Embroidered Maxi Dress',
    'Cotton Silk Hand Block Print Saree',
    'Rust Red Linen Saree',
    'Beautiful Peacock Blue Cotton Linen Saree',
    'Lace Top For Women',
    'GRAPHIC DESIGN MEN T SHIRT - BLUE'
  ]
}
export const registeredUser = {
  registeredEmail: 'TestApplication@1.co',
  registeredPassword: 'TestApplication',
  registeredName: 'TestApplication',
  registeredBirthday: '18',
  registeredMonth: '1',
  registeredYear: '2007',
  registeredFirstName: 'TestApplication',
  registeredLastName: 'TestApplication',
  registeredCompany: 'TestApplication',
  registeredAddress: 'TestApplication123',
  registeredCountry: 'United States',
  registeredState: 'CA',
  registeredCity: 'TestApplication'
}
export const updatedUser = new UserBuilder().setDefaults().build()
export const payloadCreateUser = {
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
export const payloadUpdateUser = {
  name: payloadCreateUser.name,
  email: payloadCreateUser.email,
  password: payloadCreateUser.password,
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
export const payloadLoginWithoutEmail = {
  password: registeredUser.registeredPassword
}
export const payloadLoginWithoutPassword = {
  email: registeredUser.registeredEmail
}
export const payloadLoginWrongEmail = {
  email: requestsData.wrongEmail,
  password: payloadCreateUser.password
}
export const payloadLoginWrongPassword = {
  email: payloadCreateUser.email,
  password: requestsData.wrongPassword
}
export const userFieldKeys = [
  'id',
  'name',
  'email',
  'title',
  'birth_day',
  'birth_month',
  'birth_year',
  'first_name',
  'last_name',
  'company',
  'address1',
  'address2',
  'country',
  'state',
  'city',
  'zipcode'
]
export const productFieldKeys = ['id', 'name', 'price', 'brand', 'category']
