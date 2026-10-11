import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

const variants = {
  primary: "bg-brand text-brand-fg hover:brightness-110 shadow-soft",
  accent: "bg-accent text-accent-fg hover:brightness-110 shadow-soft",
  secondary: "bg-surface-2 text-text border border-border hover:bg-surface",
  danger: "bg-danger text-white hover:brightness-110",
  ghost: "bg-transparent text-muted hover:bg-surface-2",
};

const Button = ({
  children,
  variant = "primary",
  className = "",
  disabled = false,
  loading = false,
  ...props
}) => (
  <motion.button
    whileTap={{ scale: 0.96 }}
    whileHover={{ y: -1 }}
    transition={{ type: "spring", stiffness: 500, damping: 30 }}
    disabled={disabled || loading}
    className={clsx(
      "relative inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5",
      "text-sm font-semibold overflow-hidden",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      "focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2",
      "focus:ring-offset-bg",
      variants[variant],
      className,
    )}
    {...props}
  >
    {loading && (
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current" />
    )}
    {children}
  </motion.button>
);

export default Button;
