import { user } from '@fixtures/DataBuilder.js'
import { API_STATUSES } from '@fixtures/api-statuses.js'
import {
  endpoints,
  errorMessages,
  messages,
  payloadCreateUser,
  payloadLoginWrongEmail,
  payloadLoginWrongPassword,
  payloadUpdateUser,
  payloadwithoutEmail,
  payloadwithoutPassword,
  productFieldKeys,
  registeredUser,
  requestsData,
  updatedUser,
  userFieldKeys
} from '@fixtures/api_constants.js'

const {
  BAD_REQUEST_400_STATUS,
  CREATED_201_STATUS,
  METHOD_NOT_ALLOWED_405_STATUS,
  NOT_FOUND_404_STATUS,
  SUCCESSFUL_200_STATUS
} = API_STATUSES
const {
  methodNotSupported,
  searchParamMissing,
  userExists,
  emailOrPasswordMissing,
  userNotFound,
  accountNotFound,
  emailNotFound
} = errorMessages
const {
  productsList,
  brandsList,
  searchProduct,
  verifyLogin,
  getUserDetailByEmail,
  createAccount,
  login,
  updateAccount,
  deleteAccount
} = endpoints
const { responseStatusOK, bodyMessage, responseCode, userCreated, userUpdated, accountDeleted } = messages

const assertHeaders = headers => {
  expect(headers).to.have.property('transfer-encoding', 'chunked')
  expect(headers).to.have.property('connection', 'keep-alive')
  expect(headers).to.have.property('vary', 'Accept,Cookie,Accept-Encoding')
  expect(headers).to.have.property('referrer-policy', 'same-origin')
  expect(headers).to.have.property('x-frame-options', 'DENY')
  expect(headers).to.have.property('x-content-type-options', 'nosniff')
  expect(headers).to.have.property('x-powered-by', 'Phusion Passenger(R) 6.0.23')
  expect(headers).to.have.property('status', '200 OK')
  expect(headers).to.have.property('nel', '{"success_fraction":0,"report_to":"cf-nel","max_age":604800}')
  expect(headers).to.have.property('content-encoding', 'gzip')
  expect(headers).to.have.property('alt-svc', 'h3=":443"; ma=86400')
}
const verifyStatusAndHeaders = (response, expectedGlobalCode, expectedInnerCode) => {
  const body = JSON.parse(response.body)
  assertHeaders(response.headers)
  expect(response.status, responseStatusOK).to.eq(expectedGlobalCode)
  expect(body['responseCode'], responseCode(expectedInnerCode)).to.eq(expectedInnerCode)
}
describe('Automation excersize API:', () => {
  it('API 1: Get All Products List (productsList)', () => {
    // Arrange
    // Act
    cy.api({ url: productsList }).then(response => {
      // Assert
      verifyStatusAndHeaders(response, SUCCESSFUL_200_STATUS, SUCCESSFUL_200_STATUS)
      const body = JSON.parse(response.body)
      expect(body['products'], 'Assert body["products"] is array').to.be.an('array')
      expect(body['products'], 'Assert body["products"] is array').to.be.an('array')
      expect(body['products'].length, 'Assert body["products"] have length: 34').to.eq(34)
      body['products'].forEach(product => {
        expect(product).to.have.keys(productFieldKeys)
      })
      for (let i = 0; i < body['products'].length; i++) {
        expect(body['products'][i]['id'], `Assert body["products"][${i}]["id"] is a number`).to.be.gt(0)
        expect(body['products'][i]['name'], `Assert body["products"][${i}]["name"] is a string`).to.be.a('string')
        expect(body['products'][i]['price'], `Assert body["products"][${i}]["price"] is a string`).to.be.a('string')
        expect(body['products'][i]['brand'], `Assert body["products"][${i}]["brand"] is a string`).to.be.a('string')
        expect(
          body['products'][i]['category']['usertype']['usertype'],
          `Assert body["products"][${i}]['category']['usertype']['usertype'] is a string`
        ).to.be.a('string')
        expect(
          body['products'][i]['category']['category'],
          `Assert body["products"][${i}]['category']['category'] is a string`
        ).to.be.a('string')
      }
    })
  })
  it('API 2: POST To All Products List (productsList)', () => {
    // Arrange
    // Act
    const type = 'string'
    const data = {
      id: 1,
      name: type,
      price: type,
      brand: type,
      category: {
        usertype: {
          usertype: type
        },
        category: requestsData.categories[0]
      }
    }
    cy.api({ method: 'POST', url: productsList, data }).then(response => {
      // Assert
      verifyStatusAndHeaders(response, SUCCESSFUL_200_STATUS, METHOD_NOT_ALLOWED_405_STATUS)
      const body = JSON.parse(response.body)
      expect(body['message'], bodyMessage(methodNotSupported)).to.eq(methodNotSupported)
    })
  })
  it('API 3: Get All Brands List (brandsList)', () => {
    // Arrange
    // Act
    cy.api({ url: brandsList }).then(response => {
      // Assert
      verifyStatusAndHeaders(response, SUCCESSFUL_200_STATUS, SUCCESSFUL_200_STATUS)
      const body = JSON.parse(response.body)
      expect(body['brands'], 'Assert body["brands"] is array').to.be.an('array')
      expect(body['brands'].length, 'Assert body["brands"] have length: 34').to.eq(34)
      body['brands'].forEach(brand => {
        expect(brand).to.have.keys(['id', 'brand'])
      })
      for (let i = 0; i < body['brands'].length; i++) {
        expect(body['brands'][i], `Assert body['brands'][${i}] has property "id"`).to.have.property('id')
        expect(body['brands'][i]['id'], `Assert body['brands'][${i}]['id'] is a number`).to.be.gt(0)
        expect(body['brands'][i]['brand'], `Assert body['brands'][${i}]['brand'] is a string`).to.be.a('string')
      }
    })
  })
  it('API 4: PUT To All Brands List (brandsList)', () => {
    // Arrange
    // Act
    const data = {
      id: 1,
      brand: requestsData.brands[0]
    }
    cy.api({ method: 'PUT', url: brandsList, data }).then(response => {
      // Assert
      verifyStatusAndHeaders(response, SUCCESSFUL_200_STATUS, METHOD_NOT_ALLOWED_405_STATUS)
      const body = JSON.parse(response.body)
      expect(body['message'], bodyMessage(methodNotSupported)).to.eq(methodNotSupported)
    })
  })
  it('API 5: POST To Search Products (searchProduct)', () => {
    // Arrange
    const data = {
      search_product: requestsData.products[0]
    }
    // Act
    cy.api({
      method: 'POST',
      url: searchProduct,
      form: true,
      body: data
    }).then(response => {
      // Assert
      verifyStatusAndHeaders(response, SUCCESSFUL_200_STATUS, SUCCESSFUL_200_STATUS)
      const body = JSON.parse(response.body)
      expect(body['products'], 'Assert body["products"] is array').to.be.an('array')
      expect(body['products'].length, 'Assert body["products"] has length: 1').to.eq(1)

      body['products'].forEach(product => {
        expect(product).to.have.keys(productFieldKeys)
      })
      for (let i = 0; i < body['products'].length; i++) {
        expect(body['products'][i], `Assert body["products"][${i}] has property "id"`).to.have.property('id')
        expect(body['products'][i]['id'], `Assert body["products"][${i}]["id"] is a number`).to.be.gt(0)
        expect(body['products'][i]['name'], `Assert body["products"][${i}]["name"] is a string`).to.be.a('string')
        expect(body['products'][i]['price'], `Assert body["products"][${i}]["price"] is a string`).to.be.a('string')
        expect(body['products'][i]['brand'], `Assert body["products"][${i}]["brand"] is a string`).to.be.a('string')
        expect(
          body['products'][i]['category']['usertype']['usertype'],
          `Assert body["products"][${i}]['category']['usertype']['usertype'] is a string`
        ).to.be.a('string')
        expect(
          body['products'][i]['category']['category'],
          `Assert body["products"][${i}]['category']['category'] is a string`
        ).to.be.a('string')
      }
    })
  })
  it('API 6: POST To Search Product without search_product parameter (searchProduct)', () => {
    // Arrange
    // Act
    cy.api({ method: 'POST', url: searchProduct }).then(response => {
      // Assert
      verifyStatusAndHeaders(response, SUCCESSFUL_200_STATUS, BAD_REQUEST_400_STATUS)
      const body = JSON.parse(response.body)
      expect(body['message'], bodyMessage(searchParamMissing)).to.eq(searchParamMissing)
    })
  })
  it('API 7: POST To Verify Login with valid details (verifyLogin)', () => {
    // Arrange
    const data = {
      email: registeredUser.registeredEmail,
      password: registeredUser.registeredPassword
    }
    // Act
    cy.api({
      method: 'POST',
      url: verifyLogin,
      form: true,
      body: data
    }).then(response => {
      // Assert
      verifyStatusAndHeaders(response, SUCCESSFUL_200_STATUS, SUCCESSFUL_200_STATUS)
      const body = JSON.parse(response.body)
      expect(body['message'], bodyMessage(userExists)).to.eq(userExists)
    })
  })
  for (let data of [payloadwithoutEmail, payloadwithoutPassword]) {
    it(`API 8: POST To Verify Login with invalid details (verifyLogin): ${JSON.stringify(data)}`, () => {
      // Arrange
      // Act
      cy.api({
        method: 'POST',
        url: verifyLogin,
        form: true,
        body: data
      }).then(response => {
        // Assert
        verifyStatusAndHeaders(response, SUCCESSFUL_200_STATUS, BAD_REQUEST_400_STATUS)
        const body = JSON.parse(response.body)
        expect(body['message'], bodyMessage(emailOrPasswordMissing)).to.eq(emailOrPasswordMissing)
      })
    })
  }
  it('API 9: DELETE To Verify Login endpoint (verifyLogin)', () => {
    // Arrange
    // Act
    cy.api({ method: 'DELETE', url: verifyLogin }).then(response => {
      // Assert
      verifyStatusAndHeaders(response, SUCCESSFUL_200_STATUS, METHOD_NOT_ALLOWED_405_STATUS)
      const body = JSON.parse(response.body)
      expect(body['message'], bodyMessage(methodNotSupported)).to.eq(methodNotSupported)
    })
  })
  it('API 10: POST To Verify Login with invalid details (verifyLogin)', () => {
    // Arrange
    const payloadLoginWrongEmail = {
      email: requestsData.wrongEmail,
      password: registeredUser.registeredPassword
    }
    const payloadLoginWrongPassword = {
      email: registeredUser.registeredEmail,
      password: requestsData.wrongPassword
    }
    for (let data of [payloadLoginWrongEmail, payloadLoginWrongPassword]) {
      // Act
      cy.api({
        method: 'POST',
        url: verifyLogin,
        form: true,
        body: data
      }).then(response => {
        // Assert
        verifyStatusAndHeaders(response, SUCCESSFUL_200_STATUS, NOT_FOUND_404_STATUS)
        const body = JSON.parse(response.body)
        expect(body['message'], bodyMessage(userNotFound)).to.eq(userNotFound)
      })
    }
  })
  it('API 14: GET user account detail by email (getUserDetailByEmail)', () => {
    // Arrange
    const data = {
      email: registeredUser.registeredEmail
    }
    // Act
    cy.api({ url: getUserDetailByEmail, qs: data }).then(response => {
      // Assert
      verifyStatusAndHeaders(response, SUCCESSFUL_200_STATUS, SUCCESSFUL_200_STATUS)
      const body = JSON.parse(response.body)
      expect(body['user']).to.have.keys(userFieldKeys)
      expect(body['user']['id'], 'Assert body["user"]["id"] matches a number').to.be.gt(0)
      expect(body['user']['name'], 'Assert body["user"]["name"] matches a string').to.eq(registeredUser.registeredName)
      expect(body['user']['email'], 'Assert body["user"]["email"] matches a string').to.eq(
        registeredUser.registeredEmail
      )
      expect(body['user']['title'], 'Assert body["user"]["title"] is empty').to.eq('')
      expect(body['user']['birth_day'], 'Assert body["user"]["birth_day"] matches a string').to.eq(
        registeredUser.registeredBirthday
      )
      expect(body['user']['birth_month'], 'Assert body["user"]["birth_month"] matches a string').to.eq(
        registeredUser.registeredMonth
      )
      expect(body['user']['birth_year'], 'Assert body["user"]["birth_year"] matches a string').to.eq(
        registeredUser.registeredYear
      )
      expect(body['user']['first_name'], 'Assert body["user"]["first_name"] matches a string').to.eq(
        registeredUser.registeredFirstName
      )
      expect(body['user']['last_name'], 'Assert body["user"]["last_name"] matches a string').to.eq(
        registeredUser.registeredLastName
      )
      expect(body['user']['company'], 'Assert body["user"]["company"] matches a string').to.eq(
        registeredUser.registeredCompany
      )
      expect(body['user']['address1'], 'Assert body["user"]["address1"] matches a string').to.eq(
        registeredUser.registeredAddress
      )
      expect(body['user']['address2'], 'Assert body["user"]["address2"] is empty').to.eq('')
      expect(body['user']['country'], 'Assert body["user"]["country"] matches a string').to.eq(
        registeredUser.registeredCountry
      )
      expect(body['user']['state'], 'Assert body["user"]["state"] matches a string').to.eq(
        registeredUser.registeredState
      )
      expect(body['user']['city'], 'Assert body["user"]["city"] matches a string').to.eq(registeredUser.registeredCity)
    })
  })
  it('API 15: Login registered User (login)', () => {
    // Arrange
    const data = {
      email: registeredUser.registeredEmail,
      password: registeredUser.registeredPassword
    }
    // Act

    cy.api({ url: '/' }).then(response => {
      const csrf = response.headers['set-cookie'][0].split(';')[0].split('=')[1]
      data.csrfmiddlewaretoken = csrf
      const headers = {
        Referer: `https://www.automationexercise.com/login`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
      cy.wrap(data).then(data => {
        cy.api({
          method: 'POST',
          url: login,
          form: true,
          headers,
          body: data
        }).then(response => {
          // Assert
          expect(response.status, responseStatusOK).to.eq(SUCCESSFUL_200_STATUS)
        })
      })
    })
  })
})
describe('Automation excersize API CRUD:', () => {
  it('API 11: POST To Create/Register User Account', () => {
    // Arrange
    // Act
    cy.api({
      method: 'POST',
      url: `/api${createAccount}`,
      form: true,
      body: payloadCreateUser
    }).then(response => {
      // Assert
      verifyStatusAndHeaders(response, SUCCESSFUL_200_STATUS, CREATED_201_STATUS)
      const body = JSON.parse(response.body)
      expect(body['message'], bodyMessage(userCreated)).to.eq(userCreated)
    })
  })
  it('API 11.1: GET Created User Account by email', () => {
    // Arrange
    const data = {
      email: payloadCreateUser.email
    }
    // Act
    cy.api({ url: getUserDetailByEmail, qs: data }).then(response => {
      // Assert
      verifyStatusAndHeaders(response, SUCCESSFUL_200_STATUS, SUCCESSFUL_200_STATUS)
      const body = JSON.parse(response.body)
      expect(body).to.have.keys(['responseCode', 'user'])
      expect(body['user']).to.have.keys(userFieldKeys)
      expect(body['user']['id'], 'Assert body["user"]["id"] matches a number').to.be.gt(0)
      expect(body['user']['name'], 'Assert body["user"]["name"] matches a string').to.eq(payloadCreateUser.name)
      expect(body['user']['email'], 'Assert body["user"]["email"] matches a string').to.eq(payloadCreateUser.email)
      expect(body['user']['title'], 'Assert body["user"]["title"] is empty').to.eq(user.title)
      expect(body['user']['birth_day'], 'Assert body["user"]["birth_day"] matches a string').to.eq(
        payloadCreateUser.birth_date
      )
      expect(body['user']['birth_month'], 'Assert body["user"]["birth_month"] matches a string').to.eq(
        payloadCreateUser.birth_month
      )
      expect(body['user']['birth_year'], 'Assert body["user"]["birth_year"] matches a string').to.eq(
        payloadCreateUser.birth_year
      )
      expect(body['user']['first_name'], 'Assert body["user"]["first_name"] matches a string').to.eq(
        payloadCreateUser.firstname
      )
      expect(body['user']['last_name'], 'Assert body["user"]["last_name"] matches a string').to.eq(
        payloadCreateUser.lastname
      )
      expect(body['user']['company'], 'Assert body["user"]["company"] matches a string').to.eq(
        payloadCreateUser.company
      )
      expect(body['user']['address1'], 'Assert body["user"]["address1"] matches a string').to.eq(
        payloadCreateUser.address1
      )
      expect(body['user']['address2'], 'Assert body["user"]["address2"] is empty').to.eq('')
      expect(body['user']['country'], 'Assert body["user"]["country"] matches a string').to.eq(
        payloadCreateUser.country
      )
      expect(body['user']['state'], 'Assert body["user"]["state"] matches a string').to.eq(payloadCreateUser.state)
      expect(body['user']['city'], 'Assert body["user"]["city"] matches a string').to.eq(payloadCreateUser.city)
      expect(body['user']['zipcode'], 'Assert body["user"]["zipcode"] matches a string').to.eq(
        payloadCreateUser.zipcode
      )
    })
  })
  it('API 11.2: POST To Verify Login Created User with valid details', () => {
    // Arrange
    const data = {
      email: payloadCreateUser.email,
      password: payloadCreateUser.password
    }
    // Act
    cy.api({
      method: 'POST',
      url: verifyLogin,
      form: true,
      body: data
    }).then(response => {
      // Assert
      verifyStatusAndHeaders(response, SUCCESSFUL_200_STATUS, SUCCESSFUL_200_STATUS)
      const body = JSON.parse(response.body)
      expect(body['message'], bodyMessage(userExists)).to.eq(userExists)
    })
  })
  it('API 13: PUT To Update User Account', () => {
    // Arrange
    // Act
    cy.api({
      method: 'PUT',
      url: updateAccount,
      form: true,
      body: payloadUpdateUser
    }).then(response => {
      // Assert
      verifyStatusAndHeaders(response, SUCCESSFUL_200_STATUS, SUCCESSFUL_200_STATUS)
      const body = JSON.parse(response.body)
      expect(body['message'], bodyMessage(userUpdated)).to.eq(userUpdated)
    })
  })
  it('API 13.1: GET Updated User Account by email', () => {
    // Arrange
    const data = {
      email: payloadUpdateUser.email
    }
    // Act
    cy.api({ url: getUserDetailByEmail, qs: data }).then(response => {
      // Assert
      verifyStatusAndHeaders(response, SUCCESSFUL_200_STATUS, SUCCESSFUL_200_STATUS)
      const body = JSON.parse(response.body)
      expect(body).to.have.keys(['responseCode', 'user'])
      expect(body['user']).to.have.keys(userFieldKeys)
      expect(body['user']['id'], 'Assert body["user"]["id"] matches a number').to.be.gt(0)
      expect(body['user']['name'], 'Assert body["user"]["name"] matches a string').to.eq(payloadUpdateUser.name)
      expect(body['user']['email'], 'Assert body["user"]["email"] matches a string').to.eq(payloadUpdateUser.email)
      expect(body['user']['title'], 'Assert body["user"]["title"] is empty').to.eq(updatedUser.title)
      expect(body['user']['birth_day'], 'Assert body["user"]["birth_day"] matches a string').to.eq(
        payloadUpdateUser.birth_date
      )
      expect(body['user']['birth_month'], 'Assert body["user"]["birth_month"] matches a string').to.eq(
        payloadUpdateUser.birth_month
      )
      expect(body['user']['birth_year'], 'Assert body["user"]["birth_year"] matches a string').to.eq(
        payloadUpdateUser.birth_year
      )
      expect(body['user']['first_name'], 'Assert body["user"]["first_name"] matches a string').to.eq(
        payloadUpdateUser.firstname
      )
      expect(body['user']['last_name'], 'Assert body["user"]["last_name"] matches a string').to.eq(
        payloadUpdateUser.lastname
      )
      expect(body['user']['company'], 'Assert body["user"]["company"] matches a string').to.eq(
        payloadUpdateUser.company
      )
      expect(body['user']['address1'], 'Assert body["user"]["address1"] matches a string').to.eq(
        payloadUpdateUser.address1
      )
      expect(body['user']['address2'], 'Assert body["user"]["address2"] is empty').to.eq('')
      expect(body['user']['country'], 'Assert body["user"]["country"] matches a string').to.eq(
        payloadUpdateUser.country
      )
      expect(body['user']['state'], 'Assert body["user"]["state"] matches a string').to.eq(payloadUpdateUser.state)
      expect(body['user']['city'], 'Assert body["user"]["city"] matches a string').to.eq(payloadUpdateUser.city)
      expect(body['user']['zipcode'], 'Assert body["user"]["zipcode"] matches a string').to.eq(
        payloadUpdateUser.zipcode
      )
    })
  })
  it('API 12.3: DELETE To Delete User Account with invalid details', () => {
    // Arrange
    // Act
    for (let data of [payloadLoginWrongEmail, payloadLoginWrongPassword]) {
      cy.api({
        method: 'DELETE',
        url: deleteAccount,
        form: true,
        body: data
      }).then(response => {
        // Assert
        verifyStatusAndHeaders(response, SUCCESSFUL_200_STATUS, NOT_FOUND_404_STATUS)
        const body = JSON.parse(response.body)
        expect(body['message'], bodyMessage(accountNotFound)).to.eq(accountNotFound)
      })
    }
  })
  it('API 12: DELETE To Delete Existing User Account', () => {
    //Arrange
    const data = {
      email: payloadCreateUser.email,
      password: payloadCreateUser.password
    }
    // Act
    cy.api({
      method: 'DELETE',
      url: deleteAccount,
      form: true,
      body: data
    }).then(response => {
      // Assert
      verifyStatusAndHeaders(response, SUCCESSFUL_200_STATUS, SUCCESSFUL_200_STATUS)
      const body = JSON.parse(response.body)
      expect(body['message'], bodyMessage(accountDeleted)).to.eq(accountDeleted)
    })
  })
  it('API 12.1: GET Deleted User Account by email', () => {
    // Arrange
    const data = {
      email: payloadUpdateUser.email
    }
    // Act
    cy.api({ url: getUserDetailByEmail, qs: data }).then(response => {
      // Assert
      verifyStatusAndHeaders(response, SUCCESSFUL_200_STATUS, NOT_FOUND_404_STATUS)
      const body = JSON.parse(response.body)
      expect(body['message'], bodyMessage(emailNotFound)).to.eq(emailNotFound)
    })
  })
  it('API 12.2: POST To Verify Login with Deleted User Account', () => {
    // Arrange
    const data = {
      email: payloadCreateUser.email,
      password: payloadCreateUser.password
    }
    // Act
    cy.api({
      method: 'POST',
      url: verifyLogin,
      form: true,
      body: data
    }).then(response => {
      // Assert
      verifyStatusAndHeaders(response, SUCCESSFUL_200_STATUS, NOT_FOUND_404_STATUS)
      const body = JSON.parse(response.body)
      expect(body['message'], bodyMessage(userNotFound)).to.eq(userNotFound)
    })
  })
})
