import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { registerUser } from "../api";
import Button from "../components/ui/Button";
import { Field, TextInput } from "../components/ui/Field";
import PasswordInput from "../components/ui/PasswordInput";
import { Card, Alert } from "../components/ui/Surfaces";
import ThemeToggle from "../components/ui/ThemeToggle";
import { TrainIcon } from "../components/ui/Icons";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;                        // ← stops here, no register call
    }

    setLoading(true);
    try {
      const { confirmPassword, ...payload } = formData;   // strip confirmPassword
      await registerUser(payload);
      setSuccess("Registration successful — redirecting to login…");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Error during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg px-4 py-10">
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-accent/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-brand/30 blur-3xl" />

      <div className="absolute right-5 top-5">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="glass">
          <div className="mb-6 flex flex-col items-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-fg shadow-glow">
              <TrainIcon className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold">Create your account</h2>
            <p className="mt-1 text-center text-sm text-muted">
              Book metro tickets in seconds
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <Field label="Name" htmlFor="name">
              <TextInput
                id="name"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Field>
            <Field label="Email" htmlFor="email">
              <TextInput
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Field>
            <Field label="Password" htmlFor="password">
              <PasswordInput
                id="password"
                name="password"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </Field>

            <Field label="Confirm Password" htmlFor="confirmPassword">
              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </Field>

            <Button
              type="submit"
              variant="accent"
              className="w-full"
              loading={loading}
            >
              {loading ? "Creating account…" : "Register"}
            </Button>
          </form>

          <Alert type="error">{error}</Alert>
          <Alert type="success">{success}</Alert>

          <p className="mt-6 text-center text-sm text-muted">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-brand hover:underline"
            >
              Sign in
            </Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;
