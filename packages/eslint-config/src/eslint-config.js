module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:node/recommended",
    "eslint:recommended"
  ],
  rules: {
    complexity: ["error", { max: 7 }],
    "max-lines": ["error", { max: 200 }],
    "require-atomic-updates": ["error", { allowProperties: true }],
    "no-template-curly-in-string": 1,
    "max-lines-per-function": ["error", 50],
    "comma-dangle": 1,
    "no-self-compare": 1,
    "no-console": 0,
    // disable no-unused-vars here (tsc will catch unused vars). And include `noUnusedLocals`, `noUnusedParameters`, `strict` to true in tsconfig
    // https://stackoverflow.com/questions/63767199/typescript-eslint-no-unused-vars-false-positive-in-type-declarations
    "no-unused-vars": 0,
    "node/no-missing-import": 0,
    "node/no-unsupported-features/es-syntax": 0,
    "node/file-extension-in-import": 0,
    "node/prefer-global/buffer": ["error", "always"],
    "node/prefer-global/console": ["error", "always"],
    "node/prefer-global/process": ["error", "always"],
    "node/prefer-global/url-search-params": ["error", "always"],
    "node/prefer-global/url": ["error", "always"],
    "node/prefer-promises/dns": "error",
    "node/prefer-promises/fs": "error"
  },
  // Fix for test files producing a "node/no-unpublished-import" lint error
  // https://github.com/mysticatea/eslint-plugin-node/issues/47
  overrides: [
    {
      files: "**/*.test.ts",
      rules: {
        "node/no-unpublished-import": 0
      }
    }
  ]
};
