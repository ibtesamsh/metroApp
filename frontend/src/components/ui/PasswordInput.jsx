import React, { useState } from "react";
import { TextInput } from "./Field";
import { Eye, EyeOff } from "./Icons";

const PasswordInput = ({
  id,
  name,
  value,
  onChange,
  placeholder,
  autoComplete,
  className = "",
}) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <TextInput
        id={id}
        name={name}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        className={`pr-11 ${className}`}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted hover:text-text focus:outline-none focus:ring-2 focus:ring-brand/40"
        tabIndex={-1}
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
};

export default PasswordInput;