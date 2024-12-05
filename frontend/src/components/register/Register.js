import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Toastify styles
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap styles
import "./Register.css"; // Custom styles
import axios from "axios"; // Import axios
import HomeNavbar from "../home-navbar/HomeNavbar";

const Register = ({ showHomeNavbar = true }) => {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState(""); // New state for current password
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Validation functions
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (password) =>
    password.length >= 6 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(userEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!isValidPassword(userPassword)) {
      toast.error(
        "Password must be at least 6 characters long, contain an uppercase letter, a lowercase letter, and a number."
      );
      return;
    }

    if (userPassword !== currentPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          userEmail,
          userPassword,
        }
      );
      if (response.data && response.data.token) {
        toast.success("Registration successful!");
        const userId = response.data.userId; // Extract userId from response
        const token = response.data.token;
        // Set userId in localStorage

        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId); // Save userId as well
        setTimeout(() => {
          navigate("/biodata", { state: { userId, token } }); // Pass userId to biodata form
        }, 2000);
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.message || "Error during registration");
    }
  };
  return (
    <div>
      {showHomeNavbar && <HomeNavbar />}
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div
          className="card shadow-lg p-4"
          style={{ maxWidth: "450px", width: "100%" }}
        >
          <div className="card-header bg-primary text-white text-center">
            <h4>Register Form</h4>
          </div>
          <form onSubmit={handleSubmit} className="card-body">
            {/* Email Field */}
            <div className="mb-3">
              <label htmlFor="userEmail" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="userEmail"
                placeholder="Enter your email"
                value={userEmail}
                name="userEmail"
                required
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </div>

            {/* Password Field */}
            <div className="mb-3">
              <label htmlFor="userPassword" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="userPassword"
                placeholder="Choose a password"
                value={userPassword}
                name="userPassword"
                required
                onChange={(e) => setUserPassword(e.target.value)}
              />
            </div>

            {/* Current Password Field (New) */}
            <div className="mb-3">
              <label htmlFor="currentPassword" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                className="form-control"
                id="currentPassword"
                placeholder="Confirm your password"
                value={currentPassword}
                name="currentPassword"
                required
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Register
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center mt-3">
              Already a member?{" "}
              <Link className="text-decoration-none text-primary" to="/login">
                Login
              </Link>
            </div>
          </form>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Register;
