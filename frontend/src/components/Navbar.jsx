import React from "react";

import {
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  clearSessionAuth,
  getSessionToken,
} from "../utils/authSession";

const Navbar = () => {

  const navigate = useNavigate();
  const location = useLocation(); // Forces component to re-render on route change

  const token = getSessionToken();

  const handleLogout = () => {

    clearSessionAuth();

    navigate("/login");

    // prevents back navigation cache
    window.location.reload();
  };

  return (

    <nav
      className="navbar navbar-expand-lg navbar-dark sticky-top"
      style={{
        background: "#0B3C5D",
      }}
    >
      <div className="container">

        {/* LOGO */}
        <NavLink
          to="/"
          className="navbar-brand fw-bold"
          style={{
            fontSize: "1.8rem",
            letterSpacing: "1px",
          }}
        >
          AuditAI
        </NavLink>

        <div className="d-flex align-items-center gap-3">

          {token && (
            <>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  isActive
                    ? "nav-link text-info"
                    : "nav-link text-light"
                }
              >
                About
              </NavLink>

              <NavLink
                to="/history"
                className={({ isActive }) =>
                  isActive
                    ? "nav-link text-info"
                    : "nav-link text-light"
                }
              >
                History
              </NavLink>

              {/* LOGOUT */}
              <button
                onClick={handleLogout}
                className="btn btn-sm btn-light"
              >
                Logout
              </button>
            </>
          )}

        </div>

      </div>
    </nav>
  );
};

export default Navbar;