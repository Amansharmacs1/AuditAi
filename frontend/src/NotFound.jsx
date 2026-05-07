import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        background: "linear-gradient(135deg, #0B3C5D, #1F6F8B)",
        color: "#ffffff",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1 style={{ fontSize: "6rem", margin: 0, fontWeight: "bold" }}>
        404
      </h1>

      <h2 style={{ marginTop: "10px", fontSize: "1.8rem" }}>
        Page Not Found
      </h2>

      <p style={{ marginTop: "10px", maxWidth: "400px", opacity: 0.85 }}>
        The page you’re looking for doesn’t exist or has been moved.
      </p>

      <Link
        to="/"
        style={{
          marginTop: "25px",
          padding: "12px 24px",
          background: "#ffffff",
          color: "#0B3C5D",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: "600",
          transition: "0.3s",
        }}
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;