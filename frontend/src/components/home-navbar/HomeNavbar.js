import React from "react";
import { Link } from "react-router-dom";
import "./HomeNavbar.css";

const HomeNavbar = () => {
  return (
    <div className="container-fluid home-navbar bg-primary text-light py-3">
      <div className="row align-items-center">
        {/* Left Section */}
        <div className="col-md-6 col-12 text-center text-md-start">
          <h1 className="navbar-brand mb-1">Tiruppur Matrimony</h1>
          <p className="navbar-tagline">Connecting hearts since 1000</p>
        </div>

        {/* Right Section */}
        <div className="col-md-6 col-12 text-center text-md-end mt-3 mt-md-0">
          <Link to="/Home" className="btn btn-success navbar-btn">
            Homepage
          </Link>
          <Link to="/register" className="btn btn-warning mx-2 navbar-btn">
            Register
          </Link>
          <Link to="/login" className="btn btn-warning mx-2 navbar-btn">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomeNavbar;
