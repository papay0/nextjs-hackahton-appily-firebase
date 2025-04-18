module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
    "/generated/**/*", // Ignore generated files.
  ],
  plugins: [
    "@typescript-eslint",
    "import",
  ],
  rules: {
    "quotes": ["error", "double"],
    "import/no-unresolved": 0,
    "indent": ["error", 2],
    // Add these rules:
    "object-curly-spacing": ["error", "never"],
    "max-len": "off",
    "no-trailing-spaces": "error",
    "comma-dangle": ["error", "always-multiline"],
    "eol-last": ["error", "always"],
    "require-jsdoc": "off", // Turn off JSDoc requirements
    "valid-jsdoc": "off", // Turn off JSDoc validation
    "import/no-duplicates": "warn", // Keep as warning
    "@typescript-eslint/no-unused-vars": "warn", // Keep as warning
    "@typescript-eslint/no-inferrable-types": "off", // Turn off if you prefer explicit types
    "padded-blocks": "off", // Turn off if you want blank lines
  },
};
