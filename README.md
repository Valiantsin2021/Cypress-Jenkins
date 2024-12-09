# ProjectJS_2024_fall [![CI](https://github.com/Valiantsin2021/Cypress-Jenkins/actions/workflows/parallel.yml/badge.svg)](https://github.com/Valiantsin2021/Cypress-Jenkins/actions/workflows/parallel.yml) ![cypress version](https://img.shields.io/badge/cypress-13.16.0-brightgreen)

Project report - https://valiantsin2021.github.io/Cypress-Jenkins/

**How to start working in our project?**

1. Clone repository to your machine.

2. Navigate to project root folder.

3. Run command ```npm ci``` in terminal VScode.

4. Copy and paste the file ```cypress.env.json.example``` to project root folder. Сhange the file name to ```cypress.env.json```. Put your own credentials for login in json file.

5. After, execute ```npx cypress open```  to run tests.

**Project Coding Convention**

Naming conventions:
We shall use Camelcase for naming conventions: ```camelCase```

Spec names:
student should create the spec containing the name of the userstory (US): ```header.cy.js``` 


**Spec structure:**

- Each block ```describe``` should contain the name of spec file
- Each test (```it```) should contain name of test case (```TC```) 

example:
describe('Header', () => {

    it('Verify logo jenkins is visible on the header', function () {
        ...
    })

    it('Verify logo jenkins is clickable and redirects to homePage', function () {
        ...
    })
})

**Attention!**

Students are not allowed to install any libraries, plugins, etc. to avoid changing configuration files. 

**!!Do not push changed files as:**

```package.json```
```package.lock.json```
```cypress.config.js```
```e2e.js```
```ci.yml```
```cancel.yml```
```globalHooks.js```
```cleanData.js```

**How to use faker library**

Our project utilises Faker.js library. You can find more info here: https://v6.fakerjs.dev/guide/
Use this import in your file: 
import { faker } from '@faker-js/faker';

**How to use testing library**

You can find more info here: https://testing-library.com/docs/cypress-testing-library/intro/

### Static Code Analysis, Formatting, and Pre-commit Hooks Setup

This project uses ESLint and Prettier for static code analysis and formatting, along with pre-commit hooks to ensure code quality.

**ESLint**

ESLint is configured to use the following plugins:
- `eslint-config-prettier`: Disables ESLint rules that might conflict with Prettier.
- `eslint-plugin-chai-friendly`: Lints Chai assertions.
- `eslint-plugin-cypress`: Lints Cypress tests.
- `eslint-plugin-no-only-tests`: Prevents committing `.only` tests.

You can run ESLint with the following command:
```sh
npm run lint
```

ESLint rules can be configured in `eslint.config.mjs` file

**Prettier**

Prettier is used for code formatting. It is configured to run on various file types including JavaScript, TypeScript, and JSON files.

You can format your code with the following command:
```sh
npm run format
```

Prettier rules can be configured in `.prettierrc.json` file

**Pre-commit Hooks**

Pre-commit hooks are set up using lint-staged to run ESLint and Prettier on staged files before committing. This ensures that only properly linted and formatted code is committed.

** To add hooks - copy the contents of the .hooks directory to .git/hooks

On commit the staged code will be automatically formatted and linted. Commit will not be finished if there are linting errors found.

The configuration in package.json is as follows:

```json
"lint-staged": {
  "**/*.+(cjs|js|ts|tsx)": [
    "eslint --fix"
  ],
  "**/*.+(cjs|js|ts|json)": [
    "prettier --cache --write"
  ]
}
```

**Commitlint**

Commitlint (https://commitlint.js.org/) is used to enforce conventional commit messages. It is configured to use the @commitlint/config-conventional preset. 

Rules: https://commitlint.js.org/reference/rules 

Common types according to commitlint-config-conventional can be:

- build
- chore
- ci
- docs
- feat
- fix
- perf
- refactor
- revert
- style
- test
- 
These can be modified by your own configuration.

**Usage**

- Linting: ```npm run lint```
- Formatting: ```npm run format```
- Pre-commit hooks: Automatically run on git commit

- run Jenkins on Docker:
  
`docker run --name jenkins -p 8081:8080 -p 50000:50000 --restart=on-failure -v ${PWD}/jenkins_home:/var/jenkins_home  --user root jenkins/jenkins:2.462.3-jdk17`
