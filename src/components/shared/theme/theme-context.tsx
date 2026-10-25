import { ScriptOnce } from "@tanstack/react-router";
import {
	createContext,
	useCallback,
	useEffect,
	useMemo,
	useSyncExternalStore,
	type ReactNode,
} from "react";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

type ThemeProviderProps = {
	children: ReactNode;
	defaultTheme?: Theme;
	storageKey?: string;
};

export type ThemeContextValue = {
	theme: Theme;
	resolvedTheme: ResolvedTheme;
	isReady: boolean;
	setTheme: (theme: Theme) => void;
};

export const ThemeContext = createContext<ThemeContextValue | undefined>(
	undefined,
);

const THEME_CHANGE_EVENT = "kitabu:theme-change";

function subscribeToNothing() {
	return () => {};
}

function getReadySnapshot() {
	return true;
}

function getServerReadySnapshot() {
	return false;
}

function isTheme(value: unknown): value is Theme {
	return value === "light" || value === "dark" || value === "system";
}

function readStoredTheme(storageKey: string, fallback: Theme): Theme {
	try {
		const stored = window.localStorage.getItem(storageKey);
		return isTheme(stored) ? stored : fallback;
	} catch {
		// Storage may be unavailable in restricted browser environments.
		return fallback;
	}
}

function getSystemTheme(): ResolvedTheme {
	try {
		return window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light";
	} catch {
		return "light";
	}
}

/**
 * Escape values embedded in an inline script.
 * In particular, prevent a configured storage key from closing the
 * surrounding HTML script element.
 */
function toInlineScriptString(value: string): string {
	return JSON.stringify(value)
		.replace(/</g, "\\u003c")
		.replace(/\u2028/g, "\\u2028")
		.replace(/\u2029/g, "\\u2029");
}

/**
 * Runs during HTML parsing, before React hydrates.
 * Keep this script self-contained because it executes outside React.
 */
function getThemeScript(storageKey: string, defaultTheme: Theme): string {
	const key = toInlineScriptString(storageKey);
	const fallback = toInlineScriptString(defaultTheme);

	return `(function () {
		var theme = ${fallback};

		try {
			var stored = window.localStorage.getItem(${key});
			if (
				stored === "light" ||
				stored === "dark" ||
				stored === "system"
			) {
				theme = stored;
			}
		} catch (_) {
			// Continue with the default theme if storage is unavailable.
		}

		var resolved = theme;

		if (theme === "system") {
			var prefersDark = false;

			try {
				prefersDark =
					typeof window.matchMedia === "function" &&
					window.matchMedia("(prefers-color-scheme: dark)").matches;
			} catch (_) {
				// Fall back to light when system preference detection fails.
			}

			resolved = prefersDark ? "dark" : "light";
		}

		var root = document.documentElement;

		root.classList.remove("light", "dark");
		root.classList.add(resolved);
		root.style.colorScheme = resolved;
	})();`;
}

export function ThemeProvider({
	children,
	defaultTheme = "system",
	storageKey = "theme",
}: ThemeProviderProps) {
	const subscribeToTheme = useCallback(
		(onStoreChange: () => void) => {
			const handleStorage = (event: StorageEvent) => {
				if (event.key === storageKey || event.key === null) {
					onStoreChange();
				}
			};
			window.addEventListener("storage", handleStorage);
			window.addEventListener(THEME_CHANGE_EVENT, onStoreChange);

			return () => {
				window.removeEventListener("storage", handleStorage);
				window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange);
			};
		},
		[storageKey],
	);
	const getThemeSnapshot = useCallback(
		() => readStoredTheme(storageKey, defaultTheme),
		[defaultTheme, storageKey],
	);
	const getThemeServerSnapshot = useCallback(
		() => defaultTheme,
		[defaultTheme],
	);
	const theme = useSyncExternalStore(
		subscribeToTheme,
		getThemeSnapshot,
		getThemeServerSnapshot,
	);

	const subscribeToSystemTheme = useCallback((onStoreChange: () => void) => {
		const media = window.matchMedia("(prefers-color-scheme: dark)");
		if (typeof media.addEventListener === "function") {
			media.addEventListener("change", onStoreChange);
			return () => media.removeEventListener("change", onStoreChange);
		}

		media.addListener(onStoreChange);
		return () => media.removeListener(onStoreChange);
	}, []);
	const systemTheme = useSyncExternalStore(
		subscribeToSystemTheme,
		getSystemTheme,
		(): ResolvedTheme => "light",
	);
	const isReady = useSyncExternalStore(
		subscribeToNothing,
		getReadySnapshot,
		getServerReadySnapshot,
	);

	const resolvedTheme: ResolvedTheme = theme === "system" ? systemTheme : theme;

	// Synchronize the actual document with React state.
	useEffect(() => {
		if (!isReady) {
			return;
		}

		const root = document.documentElement;

		root.classList.remove("light", "dark");
		root.classList.add(resolvedTheme);
		root.style.colorScheme = resolvedTheme;
	}, [isReady, resolvedTheme]);

	const setTheme = useCallback(
		(nextTheme: Theme) => {
			// The UI should remain responsive even when persistence fails.
			try {
				window.localStorage.setItem(storageKey, nextTheme);
			} catch {
				// The preference will apply for this mounted session.
			}

			window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
		},
		[storageKey],
	);

	const contextValue = useMemo<ThemeContextValue>(
		() => ({
			theme,
			resolvedTheme,
			isReady,
			setTheme,
		}),
		[theme, resolvedTheme, isReady, setTheme],
	);

	return (
		<ThemeContext.Provider value={contextValue}>
			<ScriptOnce>{getThemeScript(storageKey, defaultTheme)}</ScriptOnce>

			{children}
		</ThemeContext.Provider>
	);
}
