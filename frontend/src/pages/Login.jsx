import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { loginUser } from "../api";
import Button from "../components/ui/Button";
import { Field, TextInput } from "../components/ui/Field";
import { Card, Alert } from "../components/ui/Surfaces";
import ThemeToggle from "../components/ui/ThemeToggle";
import { TrainIcon } from "../components/ui/Icons";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) navigate("/");
  }, [navigate]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await loginUser(formData);
      localStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Error during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg px-4 py-10">
      {/* gradient blobs */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-brand/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-accent/30 blur-3xl" />

      <div className="absolute right-5 top-5">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="glass">
          <div className="mb-6 flex flex-col items-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-brand-fg shadow-glow">
              <TrainIcon className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold">Welcome back</h2>
            <p className="mt-1 text-center text-sm text-muted">
              Sign in to book and manage your metro tickets
            </p>
          </div>

          <form onSubmit={handleSubmit}>
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
              <TextInput
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
            </Field>
            <Button
              type="submit"
              variant="accent"
              className="w-full"
              loading={loading}
            >
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <Alert type="error">{error}</Alert>

          <p className="mt-6 text-center text-sm text-muted">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-brand hover:underline"
            >
              Create one
            </Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
