import { user } from '../../fixtures/DataBuilder.js'
import {
  payloadPOST,
  payloadPUT,
  payloadwithoutEmail,
  payloadwithoutPassword,
  payloadWrongEmail,
  payloadWrongPassword,
  registeredUser,
  updatedUser
} from '../../fixtures/api_data.js'
import { constants } from '../../fixtures/constants_products.js'
const assertHeaders = headers => {
  const headersArr = Object.entries(headers)
  expect(headersArr).to.deep.include(['transfer-encoding', 'chunked'])
  expect(headersArr).to.deep.include(['connection', 'keep-alive'])
  expect(headersArr).to.deep.include(['vary', 'Accept,Cookie,Accept-Encoding'])
  expect(headersArr).to.deep.include(['referrer-policy', 'same-origin'])
  expect(headersArr).to.deep.include(['x-frame-options', 'DENY'])
  expect(headersArr).to.deep.include(['x-content-type-options', 'nosniff'])
  expect(headersArr).to.deep.include([
    'x-powered-by',
    'Phusion Passenger(R) 6.0.23'
  ])
  expect(headersArr).to.deep.include(['status', '200 OK'])
  expect(headersArr).to.deep.include([
    'nel',
    '{"success_fraction":0,"report_to":"cf-nel","max_age":604800}'
  ])
  expect(headersArr).to.deep.include(['content-encoding', 'gzip'])
  expect(headersArr).to.deep.include(['alt-svc', 'h3=":443"; ma=86400'])
}
describe('Automation excersize API:', () => {
  it('API 1: Get All Products List (productsList)', () => {
    // Arrange
    // Act
    cy.api({ url: '/api/productsList' }).then(response => {
      // Assert
      const body = JSON.parse(response.body)
      expect(response.status, 'Response status OK').to.eq(200)
      cy.log(Object.entries(response.headers))
      assertHeaders(response.headers)
      expect(body['responseCode']).to.eq(200)
      expect(body['products'], 'Assert body["products"] is array').to.be.an(
        'array'
      )
      expect(
        body['products'].length,
        'Assert body["products"] have length: 34'
      ).to.eq(34)
      body['products'].forEach(product => {
        expect(product).to.have.keys([
          'id',
          'name',
          'price',
          'brand',
          'category'
        ])
      })
      for (let i = 0; i < body['products'].length; i++) {
        expect(
          body['products'][i]['id'],
          `Assert body["products"][${i}]["id"] is a number`
        ).to.be.a('number')
        expect(
          body['products'][i]['name'],
          `Assert body["products"][${i}]["name"] is a string`
        ).to.be.a('string')
        expect(
          body['products'][i]['price'],
          `Assert body["products"][${i}]["price"] is a string`
        ).to.be.a('string')
        expect(
          body['products'][i]['brand'],
          `Assert body["products"][${i}]["brand"] is a string`
        ).to.be.a('string')
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
    const data = {
      id: 1,
      name: 'string',
      price: 'string',
      brand: 'string',
      category: {
        usertype: {
          usertype: 'string'
        },
        category: constants.categories[0]
      }
    }
    cy.api({ method: 'POST', url: '/api/productsList', data }).then(
      response => {
        // Assert
        const body = JSON.parse(response.body)
        assertHeaders(response.headers)
        expect(response.status, 'Response status OK').to.eq(200)
        expect(
          body['responseCode'],
          'Assert body["responseCode"] matches a number'
        ).to.eq(405)
        expect(
          body['message'],
          'Assert body["message"] matches a string'
        ).to.eq('This request method is not supported.')
      }
    )
  })
  it('API 3: Get All Brands List (brandsList)', () => {
    // Arrange
    // Act
    cy.api({ url: '/api/brandsList' }).then(response => {
      // Assert
      const body = JSON.parse(response.body)
      assertHeaders(response.headers)
      expect(response.status, 'Response status OK').to.eq(200)
      expect(
        body['responseCode'],
        'Assert body["responseCode"] matches a number'
      ).to.eq(200)
      expect(body['brands'], 'Assert body["brands"] is array').to.be.an('array')
      expect(
        body['brands'].length,
        'Assert body["brands"] have length: 34'
      ).to.eq(34)
      body['brands'].forEach(brand => {
        expect(brand).to.have.keys(['id', 'brand'])
      })
      for (let i = 0; i < body['brands'].length; i++) {
        expect(
          body['brands'][i],
          `Assert body['brands'][${i}] has property "id"`
        ).to.have.property('id')
        expect(
          body['brands'][i]['id'],
          `Assert body['brands'][${i}]['id'] is a number`
        ).to.be.a('number')
        expect(
          body['brands'][i]['brand'],
          `Assert body['brands'][${i}]['brand'] is a string`
        ).to.be.a('string')
      }
    })
  })
  it('API 4: PUT To All Brands List (brandsList)', () => {
    // Arrange
    // Act
    const data = {
      id: 1,
      brand: constants.brands[0]
    }
    cy.api({ method: 'PUT', url: '/api/brandsList', data }).then(response => {
      // Assert
      const body = JSON.parse(response.body)
      assertHeaders(response.headers)
      expect(response.status, 'Response status OK').to.eq(200)
      expect(
        body['responseCode'],
        'Assert body["responseCode"] matches a number'
      ).to.eq(405)
      expect(body['message'], 'Assert body["message"] matches a string').to.eq(
        'This request method is not supported.'
      )
    })
  })
  it('API 5: POST To Search Products (searchProduct)', () => {
    // Arrange
    const data = {
      search_product: constants.products[0]
    }
    // Act
    cy.api({
      method: 'POST',
      url: '/api/searchProduct?search_product=top',
      form: true,
      body: data
    }).then(response => {
      // Assert
      const body = JSON.parse(response.body)
      assertHeaders(response.headers)
      expect(response.status, 'Response status OK').to.eq(200)
      expect(
        body['responseCode'],
        'Assert body["responseCode"] matches a number'
      ).to.eq(200)
      expect(body['products'], 'Assert body["products"] is array').to.be.an(
        'array'
      )
      expect(
        body['products'].length,
        'Assert body["products"] has length: 1'
      ).to.eq(1)
      body['products'].forEach(product => {
        expect(product).to.have.keys([
          'id',
          'name',
          'price',
          'brand',
          'category'
        ])
      })
      for (let i = 0; i < body['products'].length; i++) {
        expect(
          body['products'][i],
          `Assert body["products"][${i}]has property "id"`
        ).to.have.property('id')
        expect(
          body['products'][i]['id'],
          `Assert body["products"][${i}]["id"] is a number`
        ).to.be.a('number')
        expect(
          body['products'][i]['name'],
          `Assert body["products"][${i}]["name"] is a string`
        ).to.be.a('string')
        expect(
          body['products'][i]['price'],
          `Assert body["products"][${i}]["price"] is a string`
        ).to.be.a('string')
        expect(
          body['products'][i]['brand'],
          `Assert body["products"][${i}]["brand"] is a string`
        ).to.be.a('string')
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
    cy.api({ method: 'POST', url: '/api/searchProduct' }).then(response => {
      // Assert
      const body = JSON.parse(response.body)
      assertHeaders(response.headers)
      expect(response.status, 'Response status OK').to.eq(200)
      expect(
        body['responseCode'],
        'Assert body["responseCode"] matches a number'
      ).to.eq(400)
      expect(body['message'], 'Assert body["message"] matches a string').to.eq(
        'Bad request, search_product parameter is missing in POST request.'
      )
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
      url: '/api/verifyLogin',
      form: true,
      body: data
    }).then(response => {
      // Assert
      const body = JSON.parse(response.body)
      assertHeaders(response.headers)
      expect(response.status, 'Response status OK').to.eq(200)
      expect(
        body['responseCode'],
        'Assert body["responseCode"] matches a number'
      ).to.eq(200)
      expect(body['message'], 'Assert body["message"] matches a string').to.eq(
        'User exists!'
      )
    })
  })
  for (let data of [payloadwithoutEmail, payloadwithoutPassword]) {
    it(`API 8: POST To Verify Login with invalid details (verifyLogin): ${JSON.stringify(data.form)}`, () => {
      // Arrange
      // Act
      cy.api({
        method: 'POST',
        url: '/api/verifyLogin',
        form: true,
        body: data
      }).then(response => {
        // Assert
        const body = JSON.parse(response.body)
        assertHeaders(response.headers)
        expect(response.status, 'Response status OK').to.eq(200)
        expect(
          body['responseCode'],
          'Assert body["responseCode"] matches a number'
        ).to.eq(400)
        expect(
          body['message'],
          'Assert body["message"] matches a string'
        ).to.eq(
          'Bad request, email or password parameter is missing in POST request.'
        )
      })
    })
  }
  it('API 9: DELETE To Verify Login endpoint (verifyLogin)', () => {
    // Arrange
    // Act
    cy.api({ method: 'DELETE', url: '/api/verifyLogin' }).then(response => {
      // Assert
      const body = JSON.parse(response.body)
      assertHeaders(response.headers)
      expect(response.status, 'Response status OK').to.eq(200)
      expect(
        body['responseCode'],
        'Assert body["responseCode"] matches a number'
      ).to.eq(405)
      expect(body['message'], 'Assert body["message"] matches a string').to.eq(
        'This request method is not supported.'
      )
    })
  })
  it('API 10: POST To Verify Login with invalid details (verifyLogin)', () => {
    // Arrange
    const payloadWrongEmail = {
      email: constants.wrongEmail,
      password: registeredUser.registeredPassword
    }
    const payloadWrongPassword = {
      email: registeredUser.registeredEmail,
      password: constants.wrongPassword
    }
    for (let data of [payloadWrongEmail, payloadWrongPassword]) {
      // Act
      cy.api({
        method: 'POST',
        url: '/api/verifyLogin',
        form: true,
        body: data
      }).then(response => {
        // Assert
        const body = JSON.parse(response.body)
        assertHeaders(response.headers)
        expect(response.status, 'Response status OK').to.eq(200)
        expect(
          body['responseCode'],
          'Assert body["responseCode"] matches a number'
        ).to.eq(404)
        expect(
          body['message'],
          'Assert body["message"] matches a string'
        ).to.eq('User not found!')
      })
    }
  })
  it('API 14: GET user account detail by email (getUserDetailByEmail)', () => {
    // Arrange
    const data = {
      email: registeredUser.registeredEmail
    }
    // Act
    cy.api({ url: '/api/getUserDetailByEmail', qs: data }).then(response => {
      // Assert
      const body = JSON.parse(response.body)
      assertHeaders(response.headers)
      expect(body['user']).to.have.keys([
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
      ])
      expect(response.status, 'Response status OK').to.eq(200)
      expect(
        body['user']['id'],
        'Assert body["user"]["id"] matches a number'
      ).to.be.gt(0)
      expect(
        body['user']['name'],
        'Assert body["user"]["name"] matches a string'
      ).to.eq(registeredUser.registeredName)
      expect(
        body['user']['email'],
        'Assert body["user"]["email"] matches a string'
      ).to.eq(registeredUser.registeredEmail)
      expect(
        body['user']['title'],
        'Assert body["user"]["title"] is empty'
      ).to.eq('')
      expect(
        body['user']['birth_day'],
        'Assert body["user"]["birth_day"] matches a string'
      ).to.eq(registeredUser.registeredBirthday)
      expect(
        body['user']['birth_month'],
        'Assert body["user"]["birth_month"] matches a string'
      ).to.eq(registeredUser.registeredMonth)
      expect(
        body['user']['birth_year'],
        'Assert body["user"]["birth_year"] matches a string'
      ).to.eq(registeredUser.registeredYear)
      expect(
        body['user']['first_name'],
        'Assert body["user"]["first_name"] matches a string'
      ).to.eq(registeredUser.registeredFirstName)
      expect(
        body['user']['last_name'],
        'Assert body["user"]["last_name"] matches a string'
      ).to.eq(registeredUser.registeredLastName)
      expect(
        body['user']['company'],
        'Assert body["user"]["company"] matches a string'
      ).to.eq(registeredUser.registeredCompany)
      expect(
        body['user']['address1'],
        'Assert body["user"]["address1"] matches a string'
      ).to.eq(registeredUser.registeredAddress)
      expect(
        body['user']['address2'],
        'Assert body["user"]["address2"] is empty'
      ).to.eq('')
      expect(
        body['user']['country'],
        'Assert body["user"]["country"] matches a string'
      ).to.eq(registeredUser.registeredCountry)
      expect(
        body['user']['state'],
        'Assert body["user"]["state"] matches a string'
      ).to.eq(registeredUser.registeredState)
      expect(
        body['user']['city'],
        'Assert body["user"]["city"] matches a string'
      ).to.eq(registeredUser.registeredCity)
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
      cy.api({
        method: 'POST',
        url: '/createAccount',
        form: true,
        headers: {
          Referer: `https://www.automationexercise.com/login`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: data
      }).then(response => {
        // Assert
        expect(response.status, 'Response status OK').to.eq(200)
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
      url: '/api/createAccount',
      form: true,
      body: payloadPOST
    }).then(response => {
      // Assert
      const body = JSON.parse(response.body)
      assertHeaders(response.headers)
      expect(response.status, 'Response status OK').to.eq(200)
      expect(
        body['responseCode'],
        'Assert body["responseCode"] matches a number'
      ).to.eq(201)
      expect(body['message'], 'Assert body["message"] matches a string').to.eq(
        'User created!'
      )
    })
  })
  it('API 11.1: GET Created User Account by email', () => {
    // Arrange
    const data = {
      email: payloadPOST.email
    }
    // Act
    cy.api({ url: '/api/getUserDetailByEmail', qs: data }).then(response => {
      // Assert
      const body = JSON.parse(response.body)
      assertHeaders(response.headers)
      expect(response.status, 'Response status OK').to.eq(200)
      expect(body).to.have.keys(['responseCode', 'user'])
      expect(body['user']).to.have.keys([
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
      ])
      expect(
        body['responseCode'],
        'Assert body["responseCode"] matches a number'
      ).to.eq(200)
      expect(
        body['user']['id'],
        'Assert body["user"]["id"] matches a number'
      ).to.be.gt(0)
      expect(
        body['user']['name'],
        'Assert body["user"]["name"] matches a string'
      ).to.eq(payloadPOST.name)
      expect(
        body['user']['email'],
        'Assert body["user"]["email"] matches a string'
      ).to.eq(payloadPOST.email)
      expect(
        body['user']['title'],
        'Assert body["user"]["title"] is empty'
      ).to.eq(user.title)
      expect(
        body['user']['birth_day'],
        'Assert body["user"]["birth_day"] matches a string'
      ).to.eq(payloadPOST.birth_date)
      expect(
        body['user']['birth_month'],
        'Assert body["user"]["birth_month"] matches a string'
      ).to.eq(payloadPOST.birth_month)
      expect(
        body['user']['birth_year'],
        'Assert body["user"]["birth_year"] matches a string'
      ).to.eq(payloadPOST.birth_year)
      expect(
        body['user']['first_name'],
        'Assert body["user"]["first_name"] matches a string'
      ).to.eq(payloadPOST.firstname)
      expect(
        body['user']['last_name'],
        'Assert body["user"]["last_name"] matches a string'
      ).to.eq(payloadPOST.lastname)
      expect(
        body['user']['company'],
        'Assert body["user"]["company"] matches a string'
      ).to.eq(payloadPOST.company)
      expect(
        body['user']['address1'],
        'Assert body["user"]["address1"] matches a string'
      ).to.eq(payloadPOST.address1)
      expect(
        body['user']['address2'],
        'Assert body["user"]["address2"] is empty'
      ).to.eq('')
      expect(
        body['user']['country'],
        'Assert body["user"]["country"] matches a string'
      ).to.eq(payloadPOST.country)
      expect(
        body['user']['state'],
        'Assert body["user"]["state"] matches a string'
      ).to.eq(payloadPOST.state)
      expect(
        body['user']['city'],
        'Assert body["user"]["city"] matches a string'
      ).to.eq(payloadPOST.city)
      expect(
        body['user']['zipcode'],
        'Assert body["user"]["zipcode"] matches a string'
      ).to.eq(payloadPOST.zipcode)
    })
  })
  it('API 11.2: POST To Verify Login Created User with valid details', () => {
    // Arrange
    const data = {
      email: payloadPOST.email,
      password: payloadPOST.password
    }
    // Act
    cy.api({
      method: 'POST',
      url: '/api/verifyLogin',
      form: true,
      body: data
    }).then(response => {
      // Assert
      const body = JSON.parse(response.body)
      assertHeaders(response.headers)
      expect(response.status, 'Response status OK').to.eq(200)
      expect(
        body['responseCode'],
        'Assert body["responseCode"] matches a number'
      ).to.eq(200)
      expect(body['message'], 'Assert body["message"] matches a string').to.eq(
        'User exists!'
      )
    })
  })
  it('API 13: PUT To Update User Account', () => {
    // Arrange
    // Act
    cy.api({
      method: 'PUT',
      url: '/api/updateAccount',
      form: true,
      body: payloadPUT
    }).then(response => {
      // Assert
      const body = JSON.parse(response.body)
      assertHeaders(response.headers)
      expect(response.status, 'Response status OK').to.eq(200)
      expect(
        body['responseCode'],
        'Assert body["responseCode"] matches a number'
      ).to.eq(200)
      expect(body['message'], 'Assert body["message"] matches a string').to.eq(
        'User updated!'
      )
    })
  })
  it('API 13.1: GET Updated User Account by email', () => {
    // Arrange
    const data = {
      email: payloadPUT.email
    }
    // Act
    cy.api({ url: '/api/getUserDetailByEmail', qs: data }).then(response => {
      // Assert
      const body = JSON.parse(response.body)
      assertHeaders(response.headers)
      expect(body).to.have.keys(['responseCode', 'user'])
      expect(body['user']).to.have.keys([
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
      ])
      expect(response.status, 'Response status OK').to.eq(200)
      expect(
        body['responseCode'],
        'Assert body["responseCode"] matches a number'
      ).to.eq(200)
      expect(
        body['user']['id'],
        'Assert body["user"]["id"] matches a number'
      ).to.be.gt(0)
      expect(
        body['user']['name'],
        'Assert body["user"]["name"] matches a string'
      ).to.eq(payloadPUT.name)
      expect(
        body['user']['email'],
        'Assert body["user"]["email"] matches a string'
      ).to.eq(payloadPUT.email)
      expect(
        body['user']['title'],
        'Assert body["user"]["title"] is empty'
      ).to.eq(updatedUser.title)
      expect(
        body['user']['birth_day'],
        'Assert body["user"]["birth_day"] matches a string'
      ).to.eq(payloadPUT.birth_date)
      expect(
        body['user']['birth_month'],
        'Assert body["user"]["birth_month"] matches a string'
      ).to.eq(payloadPUT.birth_month)
      expect(
        body['user']['birth_year'],
        'Assert body["user"]["birth_year"] matches a string'
      ).to.eq(payloadPUT.birth_year)
      expect(
        body['user']['first_name'],
        'Assert body["user"]["first_name"] matches a string'
      ).to.eq(payloadPUT.firstname)
      expect(
        body['user']['last_name'],
        'Assert body["user"]["last_name"] matches a string'
      ).to.eq(payloadPUT.lastname)
      expect(
        body['user']['company'],
        'Assert body["user"]["company"] matches a string'
      ).to.eq(payloadPUT.company)
      expect(
        body['user']['address1'],
        'Assert body["user"]["address1"] matches a string'
      ).to.eq(payloadPUT.address1)
      expect(
        body['user']['address2'],
        'Assert body["user"]["address2"] is empty'
      ).to.eq('')
      expect(
        body['user']['country'],
        'Assert body["user"]["country"] matches a string'
      ).to.eq(payloadPUT.country)
      expect(
        body['user']['state'],
        'Assert body["user"]["state"] matches a string'
      ).to.eq(payloadPUT.state)
      expect(
        body['user']['city'],
        'Assert body["user"]["city"] matches a string'
      ).to.eq(payloadPUT.city)
      expect(
        body['user']['zipcode'],
        'Assert body["user"]["zipcode"] matches a string'
      ).to.eq(payloadPUT.zipcode)
    })
  })
  it('API 12.3: DELETE To Delete User Account with invalid details', () => {
    // Arrange
    // Act
    for (let data of [payloadWrongEmail, payloadWrongPassword]) {
      cy.api({
        method: 'DELETE',
        url: '/api/deleteAccount',
        form: true,
        body: data
      }).then(response => {
        // Assert
        const body = JSON.parse(response.body)
        assertHeaders(response.headers)
        expect(response.status, 'Response status OK').to.eq(200)
        expect(
          body['responseCode'],
          'Assert body["responseCode"] matches a number'
        ).to.eq(404)
        expect(
          body['message'],
          'Assert body["message"] matches a string'
        ).to.eq('Account not found!')
      })
    }
  })
  it('API 12: DELETE To Delete Existing User Account', () => {
    //Arrange
    const data = {
      email: payloadPOST.email,
      password: payloadPOST.password
    }
    // Act
    cy.api({
      method: 'DELETE',
      url: '/api/deleteAccount',
      form: true,
      body: data
    }).then(response => {
      // Assert
      const body = JSON.parse(response.body)
      assertHeaders(response.headers)
      expect(response.status, 'Response status OK').to.eq(200)
      expect(
        body['responseCode'],
        'Assert body["responseCode"] matches a number'
      ).to.eq(200)
      expect(body['message'], 'Assert body["message"] matches a string').to.eq(
        'Account deleted!'
      )
    })
  })
  it('API 12.1: GET Deleted User Account by email', () => {
    // Arrange
    const data = {
      email: payloadPUT.email
    }
    // Act
    cy.api({ url: '/api/getUserDetailByEmail', qs: data }).then(response => {
      // Assert
      const body = JSON.parse(response.body)
      assertHeaders(response.headers)
      expect(response.status, 'Response status OK').to.eq(200)
      expect(
        body['responseCode'],
        'Assert body["responseCode"] matches a number'
      ).to.eq(404)
      expect(body['message'], 'Assert body["message"] matches a string').to.eq(
        'Account not found with this email, try another email!'
      )
    })
  })
  it('API 12.2: POST To Verify Login with Deleted User Account', () => {
    // Arrange
    const data = {
      email: payloadPOST.email,
      password: payloadPOST.password
    }
    // Act
    cy.api({
      method: 'POST',
      url: '/api/verifyLogin',
      form: true,
      body: data
    }).then(response => {
      // Assert
      const body = JSON.parse(response.body)
      assertHeaders(response.headers)
      expect(response.status, 'Response status OK').to.eq(200)
      expect(
        body['responseCode'],
        'Assert body["responseCode"] matches a number'
      ).to.eq(404)
      expect(body['message'], 'Assert body["message"] matches a string').to.eq(
        'User not found!'
      )
    })
  })
})
