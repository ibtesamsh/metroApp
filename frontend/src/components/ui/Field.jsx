import React from "react";
import clsx from "clsx";

const base =
  "w-full rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-sm text-text " +
  "placeholder:text-muted/70 transition-all " +
  "focus:outline-none focus:ring-4 focus:ring-brand/20 focus:border-brand";

export const Label = ({ children, htmlFor }) => (
  <label
    htmlFor={htmlFor}
    className="mb-1.5 block text-sm font-medium text-muted"
  >
    {children}
  </label>
);

export const TextInput = ({ className = "", ...props }) => (
  <input className={clsx(base, className)} {...props} />
);

export const Select = ({ children, className = "", ...props }) => (
  <select className={clsx(base, className)} {...props}>
    {children}
  </select>
);

export const Field = ({ label, htmlFor, children }) => (
  <div className="mb-4">
    {label && <Label htmlFor={htmlFor}>{label}</Label>}
    {children}
  </div>
);
