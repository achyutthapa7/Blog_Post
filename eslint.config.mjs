import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname, // Ensure this is supported in your Node.js version
});

const eslintConfig = [
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "react/no-unescaped-entities": "off", // Disable unescaped entity errors
      "react-hooks/exhaustive-deps": "off", // Disable missing dependencies warning
      "@typescript-eslint/no-explicit-any": "off", // Allow 'any' usage
    },
  }),
];

export default eslintConfig;
