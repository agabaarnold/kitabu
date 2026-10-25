import { defineConfig } from "oxfmt";

export default defineConfig({
	printWidth: 80,
	useTabs: true,
	sortImports: {
		groups: [
			"type-import",
			["value-builtin", "value-external"],
			"type-internal",
			"value-internal",
			["type-parent", "type-sibling", "type-index"],
			["value-parent", "value-sibling", "value-index"],
			"unknown",
		],
	},
	sortTailwindcss: { functions: ["cn"], stylesheet: "src/styles.css" },
	sortPackageJson: { sortScripts: false },
	ignorePatterns: ["src/routeTree.gen.ts"],
});
