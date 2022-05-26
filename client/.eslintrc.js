module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends:
    "./node_modules/@origin-digital/origin-scripts/dist/config/eslintrc.js",
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parser: "@typescript-eslint/parser",

  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx", "js", "jsx", "json"],
    },
    "import/resolver": {
      typescript: {}, // use <root>/tsconfig.json
    },
  },
  plugins: ["@typescript-eslint", "react", "react-hooks"],
  rules: {
    "one-var": 0,
    "babel/camelcase": 0,
    "import/order": 0,
    "require-await": 0,
    "@typescript-eslint/camelcase": 0,
    "@typescript-eslint/interface-name-prefix": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/no-use-before-define": 0,
  },
};
