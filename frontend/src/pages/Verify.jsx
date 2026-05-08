import React, { useEffect } from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";
import { setSessionAuth } from "../utils/authSession";

const Verify = () => {

  const navigate = useNavigate();

  const { token } = useParams();

  useEffect(() => {

    const verifyUser = async () => {

      try {

        if (!token) return;

        const res = await fetch(
          "http://localhost:8080/api/auth/verify",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({ token }),
          }
        );

        const data = await res.json();

        if (data.success) {
          setSessionAuth({
            token: data.token,
            email: data.email,
            expiresAt: data.expiresAt,
          });

          if (data.hasPassword) {
            window.location.href = "/";
          } else {
            window.location.href = "/set-password";
          }

        } else {

          navigate("/login");

        }

      } catch (err) {

        console.log(err);

        navigate("/login");

      }
    };

    verifyUser();

  }, [navigate, token]);

  return (
    <div className="container py-5 text-center">

      <div className="card p-5 shadow">

        <h3>Verifying your email...</h3>

        <p className="text-muted">
          Please wait while we securely log you in.
        </p>

      </div>

    </div>
  );
};

export default Verify;