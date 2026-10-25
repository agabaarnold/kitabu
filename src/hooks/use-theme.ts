import { useContext } from "react";

import {
	ThemeContext,
	type ThemeContextValue,
} from "#/components/shared/theme/theme-context.tsx";

export function useTheme(): ThemeContextValue {
	const context = useContext(ThemeContext);

	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}

	return context;
}
