import { faker } from '@faker-js/faker'

export default {
  newProject: function () {
    let Project = {
      name: faker.company.buzzNoun() + faker.number.int({ min: 1, max: 100 }),
      longName: faker.commerce.productName() + faker.number.int({ min: 1, max: 100 }),
      newName: faker.company.buzzNoun() + faker.number.int({ min: 1, max: 100 }),
      description: faker.lorem.sentences(3),
      newDescription: faker.lorem.sentences(2),
      folderName: faker.company.buzzNoun() + faker.number.int({ min: 1, max: 100 }),
      longDescription: faker.lorem.sentences(50),
      userName: faker.person.lastName(),
      tokenName: faker.person.lastName()
    }
    return Project
  }
}
