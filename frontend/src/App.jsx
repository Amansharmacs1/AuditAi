import React from "react";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Result from "./pages/Result";

import Login from "./pages/Login";
import Verify from "./pages/Verify";
import SetPassword from "./pages/SetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NotFound from "./NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import History from "./pages/History";

const App = () => {

  return (
    <BrowserRouter>

      <div className="app-wrapper">

        <Navbar />

        <div className="main-content">

          <Routes>

            {/* PUBLIC ROUTES */}
            <Route
              path="/login"
              element={<Login />}
            />

            <Route
  path="/verify/:token"
  element={<Verify />}
/>

            <Route
              path="/set-password"
              element={
                <ProtectedRoute>
                  <SetPassword />
                </ProtectedRoute>
              }
            />

            <Route
              path="/forgot-password"
              element={<ForgotPassword />}
            />

            <Route
              path="/reset-password/:token"
              element={<ResetPassword />}
            />



            {/* PROTECTED ROUTES */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            <Route
              path="/about"
              element={
                <ProtectedRoute>
                  <About />
                </ProtectedRoute>
              }
            />

            <Route
              path="/result"
              element={
                <ProtectedRoute>
                  <Result />
                </ProtectedRoute>
              }
            />

              <Route
  path="/history"
  element={
    <ProtectedRoute>
      <History />
    </ProtectedRoute>
  }
/>
<Route path="*" element={NotFound} />

          </Routes>

        </div>

        <Footer />

      </div>

    </BrowserRouter>
  );
};

export default App;