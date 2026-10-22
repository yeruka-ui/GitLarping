import js from "@eslint/js";
import globals from "globals";

export default [
  {
    ignores: ["node_modules/", "_site/"]
  },
  js.configs.recommended,
  {
    files: ["js/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      // main.js is loaded as a classic <script>, not a module.
      sourceType: "script",
      globals: {
        ...globals.browser,
        gsap: "readonly",
        ScrollTrigger: "readonly"
      }
    },
    rules: {
      semi: ["error", "always"],
      "no-unused-vars": "error",
      eqeqeq: "error",
      "no-undef": "error",
      quotes: ["error", "double"]
    }
  }
];
