import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Result from "./pages/Result.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import About from "./pages/About.jsx";
import NotFound from "./NotFound.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <div className="app-wrapper">

        <Navbar />

        {/* This grows */}
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/result" element={<Result />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>

        {/* This stays at bottom */}
        <Footer />

      </div>
    </BrowserRouter>
  );
};

export default App;