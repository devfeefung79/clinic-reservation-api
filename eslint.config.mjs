import globals from "globals";

/** @type {import('eslint').Linter.Config} */
export default {
  files: ["**/*.js"],
  languageOptions: {
    sourceType: "commonjs",
    globals: {
      ...globals.browser,
      ...globals.node
    }
  },
  extends: ["eslint:recommended", "airbnb-base"],
  rules: {
    "no-unused-vars": "warn",
    "no-console": "off",
    "eqeqeq": "error"
  }
};
