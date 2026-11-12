
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CreditCard } from "lucide-react";

import { djangoApi, errorMessage } from "../api";
import { Alert } from "../components/UI";

export default function Register() {

  const [form, setForm] = useState({
    username: "",
    email: "",
    card_holder_name: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const nav = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    setBusy(true);
    setError("");

    try {
      await djangoApi.post("/api/register/", {
        username: form.username,
        email: form.email,
        card_holder_name: form.card_holder_name.trim(),
        password: form.password
      });

      alert("Registration successful! Please login.");
      nav("/login");

    } catch (e) {
      setError(errorMessage(e));

    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-brand">
          <span className="brand-mark">
            <CreditCard />
          </span>

          <b>
            Card<span className="blue">Pay</span>
          </b>
        </div>

        <span className="eyebrow">GET STARTED</span>

        <h1>Create your account</h1>

        <p className="muted">
          Register to use your payment workspace.
        </p>

        <Alert>{error}</Alert>

        <form onSubmit={submit}>

          <label>
            Cardholder Name

            <input
              type="text"
              name="card_holder_name"
              placeholder="Enter your full name"
              value={form.card_holder_name}
              onChange={handleChange}
              maxLength={100}
              required
            />
          </label>

          <label>
            Username

            <input
              type="text"
              name="username"
              placeholder="Enter username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Email Address

            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Password

            <input
              type="password"
              name="password"
              placeholder="Minimum 8 characters"
              value={form.password}
              onChange={handleChange}
              minLength={8}
              required
            />
          </label>

          <button
            type="submit"
            className="primary full"
            disabled={busy}
          >
            {busy ? "Creating account..." : "Create Account"}
          </button>

        </form>

        <p className="auth-foot">
          Already registered?
          {" "}
          <Link to="/login">Sign in</Link>
        </p>

      </div>
    </div>
  );
}
