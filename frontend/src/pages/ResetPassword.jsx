import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { endpoints } from "../utils/apiConfig";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!token) {
      setError("Invalid reset link");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setError("");

      const res = await fetch(
        endpoints.resetPassword(),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(
          data.message || "Could not reset password"
        );
        return;
      }

      setMessage(data.message);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError("Unable to reset password right now");
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
        <h2 className="text-center mb-3">Reset Password</h2>
        <p className="text-center text-muted mb-4">
          Enter your new password.
        </p>

        <form onSubmit={handleResetPassword}>
          <input
            type="password"
            className="form-control mb-3"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            required
          />

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {message && (
          <p className="text-success mt-3 mb-0">{message}</p>
        )}
        {error && (
          <p className="text-danger mt-3 mb-0">{error}</p>
        )}

        <div className="mt-3">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
