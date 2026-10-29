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
        ScrollTrigger: "readonly",
        // Only defined under Jest; main.js checks for it before exporting.
        module: "readonly"
      }
    },
    rules: {
      semi: ["error", "always"],
      "no-unused-vars": "error",
      eqeqeq: "error",
      "no-undef": "error",
      quotes: ["error", "double"]
    }
  },
  {
    files: ["tests/**/*.test.cjs"],
    languageOptions: {
      sourceType: "commonjs",
      globals: { ...globals.node, ...globals.jest, ...globals.browser }
    }
  }
];
