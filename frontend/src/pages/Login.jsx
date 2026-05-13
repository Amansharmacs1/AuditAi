import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  isSessionAuthenticated,
  setSessionAuth,
} from "../utils/authSession";
import { endpoints } from "../utils/apiConfig";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and password are both required.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const res = await fetch(endpoints.loginPassword(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Login failed. Please check your email and password.");
        return;
      }

      setSessionAuth({
        token: data.token,
        email: data.email,
        expiresAt: data.expiresAt,
      });
      navigate("/");
    } catch (err) {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isSessionAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container py-5">
      <div
        className="card shadow-lg p-4 mx-auto border-0"
        style={{
          maxWidth: "450px",
          borderRadius: "24px",
          background: "linear-gradient(to bottom, #ffffff, #f9fbff)"
        }}
      >
        <div className="text-center mb-4">
          <div className="d-inline-block bg-primary bg-opacity-10 p-3 rounded-circle mb-3">
             <span className="fs-1">🚀</span>
          </div>
          <h2 className="fw-bold text-dark">Welcome to AuditAI</h2>
          <p className="text-muted">
            Enter your email and password to login. New accounts are created with the password you provide.
          </p>
        </div>

        <form onSubmit={handlePasswordLogin}>
          <div className="mb-4">
            <label className="form-label fw-semibold text-muted small text-uppercase">Email Address</label>
            <input
              type="email"
              className="form-control form-control-lg bg-light border-0"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ borderRadius: "12px" }}
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold text-muted small text-uppercase">Password</label>
            <input
              type="password"
              className="form-control form-control-lg bg-light border-0"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ borderRadius: "12px" }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg w-100 fw-bold shadow-sm mb-3"
            disabled={loading}
            style={{ borderRadius: "12px", padding: "14px" }}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            ) : null}
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center">
          <p className="text-muted small">
            Use the same email and password to login next time.
          </p>
        </div>

        {message && (
          <div className="alert alert-success mt-3 border-0 shadow-sm" style={{ borderRadius: "12px" }}>
            <span className="me-2">✅</span> {message}
          </div>
        )}
        {error && (
          <div className="alert alert-danger mt-3 border-0 shadow-sm" style={{ borderRadius: "12px" }}>
            <span className="me-2">⚠️</span> {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;