import { useEffect, useState } from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";

const LIGHT_THEME = "light";
const DARK_THEME = "dark";
const STORAGE_KEY = "theme";

function getInitialTheme() {
  if (typeof window === "undefined") {
    return LIGHT_THEME;
  }

  try {
    const savedTheme = window.localStorage.getItem(STORAGE_KEY);

    if (savedTheme === DARK_THEME || savedTheme === LIGHT_THEME) {
      return savedTheme;
    }
  } catch {
    // Continue with system preference if localStorage is unavailable.
  }

  if (
    window.matchMedia?.("(prefers-color-scheme: dark)").matches
  ) {
    return DARK_THEME;
  }

  return LIGHT_THEME;
}

const DarkModeToggle = () => {
  const [theme, setTheme] = useState(getInitialTheme);

  const isDark = theme === DARK_THEME;

  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle("dark", isDark);
    root.setAttribute("data-theme", theme);
    root.style.colorScheme = isDark ? "dark" : "light";

    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Theme still works for the current session.
    }
  }, [theme, isDark]);

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME
    );
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-0 bg-transparent p-0 text-slate-700 outline-none transition-transform duration-200 hover:scale-110 hover:text-amber-500 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 active:scale-95 dark:text-slate-200 dark:hover:text-amber-300 dark:focus-visible:ring-offset-slate-950"
    >
      {isDark ? (
        <MdDarkMode
          size={25}
          className="transition-transform duration-200"
          aria-hidden="true"
        />
      ) : (
        <MdLightMode
          size={25}
          className="text-amber-500 transition-transform duration-200"
          aria-hidden="true"
        />
      )}
    </button>
  );
};

export default DarkModeToggle;