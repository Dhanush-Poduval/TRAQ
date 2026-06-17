import React from "react";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center h-6 w-11 rounded-full border border-border/60 transition-colors duration-400 ease-in-out focus:outline-none"
      style={{
        backgroundColor: isDark ? "var(--accent)" : "var(--card)",
      }}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle theme"
    >
      <span
        className="inline-flex items-center justify-center w-4 h-4 rounded-full transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{
          backgroundColor: isDark ? "var(--accent-foreground)" : "var(--foreground)",
          transform: isDark ? "translateX(22px)" : "translateX(3px)",
        }}
      >
        <Sun
          className="absolute transition-all duration-300"
          style={{
            width: 9, height: 9,
            color: isDark ? "var(--accent)" : "var(--background)",
            opacity: isDark ? 0 : 1,
            transform: isDark ? "rotate(-45deg) scale(0)" : "rotate(0) scale(1)",
          }}
        />
        <Moon
          className="absolute transition-all duration-300"
          style={{
            width: 9, height: 9,
            color: "var(--accent)",
            opacity: isDark ? 1 : 0,
            transform: isDark ? "rotate(0) scale(1)" : "rotate(45deg) scale(0)",
          }}
        />
      </span>
    </button>
  );
};
