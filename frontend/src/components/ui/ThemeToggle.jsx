import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../theme/ThemeContext";

const ThemeToggle = ({ className = "" }) => {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={`relative flex h-10 w-[68px] items-center rounded-full border border-border
        bg-surface-2 px-1.5 shadow-soft transition-colors ${className}`}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        className={`absolute h-7 w-7 rounded-full bg-brand shadow-md ${
          isDark ? "left-[34px]" : "left-1.5"
        }`}
      />
      <span className="relative z-10 flex w-full items-center justify-between px-1">
        <Sun size={16} className={isDark ? "text-muted" : "text-brand-fg"} />
        <Moon size={16} className={isDark ? "text-brand-fg" : "text-muted"} />
      </span>
    </button>
  );
};

export default ThemeToggle;
