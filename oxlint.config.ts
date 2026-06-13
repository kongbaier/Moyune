import { defineConfig } from "oxlint";

export default defineConfig({
  categories: {
    correctness: "warn",
    suspicious: "warn",
    style: "off",
  },

  rules: {
    // =====================
    // 基础 JS / TS
    // =====================
    eqeqeq: "warn",
    "no-unused-vars": "warn",
    "no-constant-condition": "warn",
    "no-duplicate-imports": "error",
  },

  overrides: [
    {
      files: ["*.vue"],
      rules: {
        "no-unused-vars": "off",
      },
    },
  ],
});