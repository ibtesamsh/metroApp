import React from "react";
import clsx from "clsx";
import { motion } from "framer-motion";

export const Card = ({ children, className = "", id, hover = false }) => {
  const Comp = hover ? motion.div : "div";
  const props = hover
    ? {
        whileHover: { y: -3 },
        transition: { type: "spring", stiffness: 400, damping: 26 },
      }
    : {};
  return (
    <Comp
      id={id}
      className={clsx(
        "rounded-2xl border border-border bg-surface/80 backdrop-blur-md",
        "p-6 shadow-soft",
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
};

export const Alert = ({ type = "error", children }) => {
  if (!children) return null;
  const styles = {
    error: "bg-danger/10 border-danger/30 text-danger",
    success: "bg-success/10 border-success/30 text-success",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx("mt-4 rounded-xl border px-4 py-3 text-sm", styles[type])}
    >
      {children}
    </motion.div>
  );
};

const statusStyles = {
  Active: "bg-brand/15 text-brand border-brand/30",
  "In Journey": "bg-warning/15 text-warning border-warning/30",
  Completed: "bg-success/15 text-success border-success/30",
  Expired: "bg-muted/15 text-muted border-muted/30",
};

export const StatusBadge = ({ status }) => (
  <span
    className={clsx(
      "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
      statusStyles[status] || statusStyles.Expired,
    )}
  >
    {status}
  </span>
);

export const Spinner = ({ className = "h-6 w-6" }) => (
  <span
    className={clsx(
      "inline-block animate-spin rounded-full border-2 border-border border-t-brand",
      className,
    )}
  />
);

export const SkeletonCard = () => (
  <div className="relative overflow-hidden rounded-2xl border border-border bg-surface/60 p-6">
    <div className="space-y-3">
      <div className="h-5 w-1/3 rounded bg-surface-2" />
      <div className="h-4 w-2/3 rounded bg-surface-2" />
      <div className="h-4 w-1/2 rounded bg-surface-2" />
    </div>
    <div className="pointer-events-none absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
  </div>
);
