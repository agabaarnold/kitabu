import { defineConfig } from "oxlint";

export default defineConfig({
	categories: {
		correctness: "error",
		nursery: "warn",
		pedantic: "warn",
		perf: "warn",
		restriction: "warn",
		style: "warn",
		suspicious: "warn",
	},
	plugins: [
		"eslint",
		"import",
		"jsdoc",
		"jsx-a11y",
		"oxc",
		"promise",
		"react",
		"react-perf",
		"typescript",
		"unicorn",
	],
	rules: {
		"eslint/no-unused-vars": "error",
		"eslint/prefer-const": ["error", { destructuring: "any" }],
	},
	env: { builtin: true },
	ignorePatterns: ["src/routeTree.gen.ts"],
});
