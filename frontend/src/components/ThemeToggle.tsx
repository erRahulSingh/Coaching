"use client";

import { useTheme } from "./AppWrapper";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-full glass-panel border border-gold/20 hover:border-gold/50 text-gold transition-all duration-300 active:scale-95"
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 transition-transform duration-300 rotate-0 scale-100" />
      ) : (
        <Moon className="w-5 h-5 transition-transform duration-300 rotate-0 scale-100 text-navy-deep" />
      )}
    </button>
  );
}
