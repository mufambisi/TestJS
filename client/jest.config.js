module.exports = {
  setupFilesAfterEnv: ["<rootDir>/devTools/scripts/setup.js"],
  testEnvironment: "jest-environment-jsdom-global",
  moduleFileExtensions: ["ts", "tsx", "js"],
  moduleDirectories: ["client", "node_modules"],
  transformIgnorePatterns: [
    "/node_modules/(?!lodash-es|@babel/runtime-corejs2|@origin-digital/.*)",
  ],
  transform: {
    "^.+\\.(ts|tsx|js)$": "babel-jest",
  },
  snapshotSerializers: ["enzyme-to-json/serializer"],
  testMatch: ["<rootDir>/**/*.test.ts?(x)"],
  testURL: "http://localhost/",
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.ts?(x)",
    "!src/(config|setup|index).ts?(x)",
    "!src/(interfaces|generated|graphql-types)/**/*.ts",
    "!src/**/queries.ts",
    "!src/dashboard/WidgetDefinition.ts",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "text-summary", "lcov"],
  coverageThreshold: {
    global: {
      statements: 90,
      branches: 85,
      functions: 85,
      lines: 90,
    },
  },
  globals: {
    __DEV__: false,
    TAL: require("./tal/local.json"),
  },
  verbose: true,
};
