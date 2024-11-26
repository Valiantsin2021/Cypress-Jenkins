# ProjectJS_2024_fall

## Static Code Analysis, Formatting, and Pre-commit Hooks Setup

This project uses ESLint and Prettier for static code analysis and formatting, along with pre-commit hooks to ensure code quality.

### ESLint

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

### Prettier

Prettier is used for code formatting. It is configured to run on various file types including JavaScript, TypeScript, and JSON files.

You can format your code with the following command:

```sh
npm run format
```

Prettier rules can be configured in `.prettierrc.json` file

### Pre-commit Hooks

Pre-commit hooks are set up using lint-staged to run ESLint and Prettier on staged files before committing. This ensures that only properly linted and formatted code is committed.

#### To add hooks - copy the contents of the .hooks directory to .git/hooks

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

### Commitlint

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
- These can be modified by your own configuration.

### Setup

#### To set up the project, install the dependencies:

`npm install`

This will install all necessary dependencies for ESLint, Prettier, and the pre-commit hooks.

### Usage

- Linting: `npm run lint`
- Formatting: `npm run format`
- Pre-commit hooks: Automatically run on git commit
