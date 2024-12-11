import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";
import HomeNavbar from "../home-navbar/HomeNavbar";

const Login = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    userEmail: "",
    userPassword: "",
  });

  const handleInputValues = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure both fields are filled
    if (!values.userEmail || !values.userPassword) {
      toast.error("Please fill out all fields", { autoClose: 2000 });
      return; // Prevent further execution
    }

    try {
      // Make API call to login
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        values
      );
      const { token } = response.data;
      localStorage.setItem("token", token);

      // Show success toast and navigate to Landing Page
      toast.success("Login successful!", { autoClose: 2000 });
      setTimeout(() => {
        navigate("/LandingPage");
      }, 2000);
    } catch (err) {
      console.error("Error during login:", err);
      // Show error toast
      toast.error(
        err.response?.data?.message || "Login failed. Please try again.",
        { autoClose: 2000 }
      );
    }
  };

  return (
    <div>
      <HomeNavbar />
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div
          className="card shadow-lg p-4"
          style={{ maxWidth: "450px", width: "100%" }}
        >
          <div className="card-header bg-primary text-white text-center">
            <h4>Login Form</h4>
          </div>
          <form onSubmit={handleSubmit} className="card-body">
            <div className="mb-3">
              <label htmlFor="userEmail" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="userEmail"
                placeholder="Enter your email"
                value={values.userEmail}
                name="userEmail"
                autoComplete="username"
                onChange={handleInputValues}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="userPassword" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="userPassword"
                placeholder="Enter your password"
                value={values.userPassword}
                name="userPassword"
                autoComplete="current-password"
                onChange={handleInputValues}
                required
              />
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </div>

            <div className="text-center mt-3">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-decoration-none text-primary"
              >
                Register
              </Link>
            </div>
          </form>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Login;
