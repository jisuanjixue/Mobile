/*
 * Eslint config file
 * Documentation: https://eslint.org/docs/user-guide/configuring/
 * Install the Eslint extension before using this feature.
 */
module.exports = {
  env: {
    es6: true,
    browser: true,
    node: true,
    commonjs: true
  },
  parser: "@typescript-eslint/parser",
  ecmaFeatures: {
    modules: true
  },
  extends: ["plugin:json/recommended", "plugin:@typescript-eslint/recommended", "plugin:prettier/recommended", "eslint:recommended"],
  plugins: ["prettier", "import"],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },
  globals: {
    wx: true,
    App: true,
    Page: true,
    getCurrentPages: true,
    getApp: true,
    Component: true,
    requirePlugin: true,
    requireMiniProgram: true,
    logger: true,
    module: true
  },
  // extends: 'eslint:recommended',
  rules: {}
};
