import { useState } from "react";
import { Link } from "react-router-dom";
import { endpoints } from "../utils/apiConfig";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSendReset = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage("");
      setError("");

      const res = await fetch(
        endpoints.forgotPassword(),
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
          data.message || "Unable to send reset link"
        );
        return;
      }

      setMessage(data.message);
    } catch (err) {
      setError("Unable to send reset link right now");
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
        <h2 className="text-center mb-3">Forgot Password</h2>
        <p className="text-center text-muted mb-4">
          Enter your email to get a reset link.
        </p>

        <form onSubmit={handleSendReset}>
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
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

export default ForgotPassword;
