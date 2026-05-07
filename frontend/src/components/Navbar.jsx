import React from "react";
import { NavLink } from "react-router-dom";


const Navbar = () => {
  return (
    <nav
      className="navbar navbar-expand-lg sticky-top shadow-sm"
      style={{ background: "#0B3C5D", zIndex: 1000 }}
    >
      <div className="container">

        {/* Logo (acts as Home) */}
        <NavLink
          to="/"
          className="navbar-brand text-white fw-bolder d-flex align-items-center"
          style={{ fontSize: "1.6rem" }} 
        >
          
          AuditAI
        </NavLink>

        {/* Right Side - About */}
        <div className="ms-auto">
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? "nav-link text-info fw-semibold"
                : "nav-link text-light"
            }
          >
            About
          </NavLink>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;