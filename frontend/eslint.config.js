import reactHooks from "eslint-plugin-react-hooks";


const browserGlobals = {
  console: "readonly",
  document: "readonly",
  Event: "readonly",
  File: "readonly",
  FormData: "readonly",
  Intl: "readonly",
  localStorage: "readonly",
  URL: "readonly",
  window: "readonly",
};


export default [
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  {
    files: ["src/**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: browserGlobals,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      sourceType: "module",
    },
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/rules-of-hooks": "error",
    },
  },
  {
    files: ["*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },
];
