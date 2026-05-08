import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  clearSessionAuth,
  getSessionToken,
} from "../utils/authSession";

const SetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSavePassword = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const token = getSessionToken();
    if (!token) {
      setError("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const res = await fetch(
        "http://localhost:8080/api/auth/set-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ password }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(
          data.message || "Could not save password"
        );
        return;
      }

      setMessage("Password saved. You can now login with password.");
      navigate("/");
    } catch (err) {
      setError("Unable to save password right now");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div
        className="card shadow p-4 mx-auto"
        style={{ maxWidth: "500px", borderRadius: "20px" }}
      >
        <h2 className="text-center mb-3">Set Password</h2>
        <p className="text-center text-muted mb-4">
          Save a password to login faster next time.
        </p>

        <form onSubmit={handleSavePassword}>
          <input
            type="password"
            className="form-control mb-3"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
          />

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Password"}
          </button>
        </form>

        {message && (
          <p className="text-success mt-3 mb-0">{message}</p>
        )}
        {error && (
          <p className="text-danger mt-3 mb-0">{error}</p>
        )}

        <button
          type="button"
          className="btn btn-link mt-3 px-0"
          onClick={() => {
            clearSessionAuth();
            navigate("/login");
          }}
        >
          Logout and return to Login
        </button>
      </div>
    </div>
  );
};

export default SetPassword;
