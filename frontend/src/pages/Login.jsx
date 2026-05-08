import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  isSessionAuthenticated,
  setSessionAuth,
} from "../utils/authSession";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSendLink = async () => {

    try {

      setLoading(true);
      setError("");
      setMessage("");

      const res = await fetch(
        "http://localhost:8080/api/auth/send-link",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(
          data.message ||
            "Could not send verification link"
        );
        return;
      }

      setMessage(data.message);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }
  };

  const handlePasswordLogin = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const res = await fetch(
        "http://localhost:8080/api/auth/login-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(
          data.message || "Invalid email or password"
        );
        return;
      }

      setSessionAuth({
        token: data.token,
        email: data.email,
        expiresAt: data.expiresAt,
      });

      window.location.href = "/";
    } catch (err) {
      setError("Unable to login right now");
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
        className="card shadow p-4 mx-auto"
        style={{
          maxWidth: "500px",
          borderRadius: "20px",
        }}
      >
        <h2 className="text-center mb-3">
          Login to AuditAI
        </h2>

        <p className="text-center text-muted mb-4">
          Use password login or verify once by email link.
        </p>

        <input
          type="email"
          className="form-control mb-3"
          placeholder="Enter your email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Enter your password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          className="btn btn-primary w-100 mb-3"
          onClick={handlePasswordLogin}
          disabled={loading}
        >
          {loading ? "Please wait..." : "Login with Password"}
        </button>

        <button
          className="btn btn-outline-primary w-100"
          onClick={handleSendLink}
          disabled={loading}
        >
          {loading
            ? "Sending..."
            : "Send Verification Link"}
        </button>

        <div className="mt-3 text-center">
          <Link to="/forgot-password">
            Forgot Password?
          </Link>
        </div>

        {message && (
          <p className="text-success mt-3">
            {message}
          </p>
        )}
        {error && (
          <p className="text-danger mt-3">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;