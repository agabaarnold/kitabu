import { defineConfig } from "oxlint";

export default defineConfig({
	plugins: [
		"eslint",
		"typescript",
		"oxc",
		"unicorn",
		"react",
		"jsx-a11y",
		"import",
		"promise",
		"react-perf",
		"node",
	],

	options: { typeAware: true, reportUnusedDisableDirectives: "warn" },

	categories: {
		correctness: "error",
		suspicious: "warn",
		perf: "warn",
	},

	env: {
		builtin: true,
		browser: true,
	},

	settings: {
		react: {
			linkComponents: [{ name: "Link", attribute: "to" }],
		},
	},

	rules: {
		// JavaScript and TypeScript hygiene
		"eslint/no-unused-vars": [
			"error",
			{
				argsIgnorePattern: "^_",
				caughtErrorsIgnorePattern: "^_",
				varsIgnorePattern: "^_",
			},
		],

		"eslint/prefer-const": ["error", { destructuring: "any" }],

		"typescript/no-explicit-any": "warn",
		"typescript/no-non-null-assertion": "warn",

		"react-perf/jsx-no-jsx-as-prop": "off",
		"react/react-in-jsx-scope": "off",
		"react-perf/jsx-no-new-array-as-prop": "off",
		"react-perf/jsx-no-new-object-as-prop": "off",
		"react-perf/jsx-no-new-function-as-prop": "off",

		// Import correctness and dependency structure
		"import/no-cycle": "error",
		"import/no-duplicates": ["error", { preferInline: true }],
		"import/no-self-import": "error",
		"import/first": "error",

		// Suspicious import patterns
		"import/no-named-as-default": "warn",
		"import/no-named-as-default-member": "warn",
	},

	ignorePatterns: [
		// TanStack Router's generated route tree
		"**/routeTree.gen.ts",
		"**/routeTree.gen.js",

		// Build and test artifacts
		"dist/**",
		"coverage/**",
	],

	overrides: [
		{
			// Build-tool configuration runs in Node, not just the browser.
			files: [
				"vite.config.*",
				"vitest.config.*",
				"tsr.config.*",
				"*.config.ts",
				"*.config.mts",
				"*.config.js",
				"*.config.mjs",
			],
			env: {
				node: true,
			},
		},
	],
});
