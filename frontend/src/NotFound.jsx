import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="container d-flex flex-column align-items-center justify-content-center text-center py-5 mt-5" style={{ minHeight: "60vh" }}>
      <h1 className="display-1 fw-bold text-primary" style={{ fontSize: "6rem", textShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
        404
      </h1>
      <h2 className="mb-3 fw-bold text-dark">Page Not Found</h2>
      <p className="text-muted fs-5 mb-4" style={{ maxWidth: "500px" }}>
        Oops! The page you’re looking for doesn’t exist, has been moved, or you might have mistyped the URL.
      </p>
      <Link to="/" className="btn btn-primary btn-lg fw-bold px-5 py-3 shadow-sm rounded-pill">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;