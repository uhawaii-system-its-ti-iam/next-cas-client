# Contributing to next-cas-client

Thanks for taking the time to contribute to `next-cas-client`! This document will help get you started and provide guidelines on how to add a new ticket validator.

## Getting Started

### Setup

1. Install LTS version of Node.js
2. Install the Prettier extension in your IDE.
3. Fork and clone the repo
4. Set remote upstream in git
5. Run `npm install` to install dependencies

### Working on an Issue

1. Create/select an issue
2. Create a new branch
3. Make changes in the /src folder
4. Write tests in the /test folder (Ensuring 100% code coverage!)
5. Create a pull request linked to the issue

### Testing Changes Locally

1. Run `npm run build` to build the project
2. Run `npm link`
3. Run `npm link next-cas-client` in another project that imports `next-cas-client` as a dependency
4. Now test the changes

### Running Tests

1. Run `npm run test` to run the Jest tests
2. Run `npm run test:coverage` to view the test coverage

## Adding a New Validator

1. Create a new `.ts` file in src/lib/validators.
2. Create a class that implements the `Validator` interface. _Note that you cannot extend a class because Next.js prevents the use of classes in Server components._
3. Update the ValidatorProtocol enum and ValidatorFactory.getValidator() method in src/lib/validators/validator.ts.
