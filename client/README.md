## Core Technologies

- [React](https://reactjs.org/)
- [Styled Components](https://www.styled-components.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Jest](https://facebook.github.io/jest/)
- [Webpack](https://webpack.js.org/)
- [Docker](https://www.docker.com)

## Commands

```sh
# Start the app in development mode
# This will start local stub server, stub the mock APIs and start the dev server
yarn start

# Lint all files under the /src and /functional-test directory
yarn lint

# Type checks all files under the /functional-test directory
yarn type:check

# Format all code under the /src directory according to the rules in origin-scripts
yarn format

# Run unit tests and display code coverage
yarn test

# Run functional tests
yarn test:func

```

### Functional Test Options

- `--noclean` - Stops the dist from being rebuilt
- `-f "[Fixture Name]"` - Run a specific fixure
- `-t "[Test Name]"` - Run all tests with a specific name
- `-c [concurrency]` - Run with a specific concurrency

```sh
# Any combination of these options can be combined. Here is an example of using all of the above options at once
yarn test:func --noclean -c 1 -f "My fixture" -t "My specific test"
```

## Browser Support

Please see the [Browser Support](https://origindd.atlassian.net/wiki/spaces/DIG/pages/313688065/MFR+Browser+Support) matrix.

## Contributing

Please see the [Contributing](CONTRIBUTING.md) guidelines.
