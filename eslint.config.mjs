import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Instantiate FlatCompat and extend configurations
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Use FlatCompat to extend ESLint configurations correctly
const eslintConfig = compat.extends("next/core-web-vitals");

export default eslintConfig;
