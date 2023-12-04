module.exports = {
    root: true,
    env: { browser: true, es2020: true, node: true },
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:react-hooks/recommended",
    ],
    ignorePatterns: ["dist", ".eslintrc.cjs", "index.js"],
    parser: "@typescript-eslint/parser",
    plugins: ["react-refresh"],
    rules: {
      "no-empty-pattern": "off",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/ban-types": [
        "error",
        {
          extendDefaults: true,
          types: {
            "{}": false,
          },
        },
      ],
      // typescript does this by default.
      "@typescript-eslint/no-unused-vars": 0,
      "@typescript-eslint/ban-ts-comment": 0,
      "@typescript-eslint/no-explicit-any": 0,
    },
  };