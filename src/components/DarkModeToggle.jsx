import { useState, useEffect } from "react";
import { MdDarkMode } from "react-icons/md";
import { CiLight } from "react-icons/ci";

const DarkModeToggle = () => {
  // Initial theme: localStorage or system preference
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "mytheme"; // DaisyUI custom light theme
  });

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark"); // Tailwind dark
      root.setAttribute("data-theme", "dark"); // DaisyUI dark
    } else {
      root.classList.remove("dark"); // Tailwind light
      root.setAttribute("data-theme", "mytheme"); // DaisyUI custom light
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  // Toggle function
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "mytheme" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-sm btn-outline btn-primary flex items-center gap-2"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <>
          <CiLight size={18} />
          Light
        </>
      ) : (
        <>
          <MdDarkMode size={18} />
          Dark
        </>
      )}
    </button>
  );
};

export default DarkModeToggle;
