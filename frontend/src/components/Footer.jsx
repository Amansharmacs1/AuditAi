import React from "react";

const Footer = () => {
  return (
    <footer
      style={{
        background: "#0B3C5D",
        color: "#ffffff",
        marginTop: "40px",
      }}
    >
      <div className="container py-4 text-center">

        {/* Row 1: Logo */}
        <h5 className="fw-bold mb-2">AuditAI</h5>

        {/* Row 2: Tagline */}
        <p style={{ fontSize: "14px", opacity: 0.85 }} className="mb-2">
          Cut unnecessary AI costs in seconds
        </p>

        {/* Row 3: Copyright */}
        <p style={{ fontSize: "13px", opacity: 0.7 }} className="mb-0">
          © {new Date().getFullYear()} AuditAI. All rights reserved.
        </p>

      </div>
    </footer>
  );
};

export default Footer;