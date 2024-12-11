import { Link } from "react-router-dom";
import "./LandingPage.css";
import React from "react";
import Profilecards from "../Profilecards/Profilecards";

const LandingPage = () => {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-warning">
        <a className="navbar-brand" href="/LandingPage">
          Tiruppur Matrimony
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item active">
              <Link className="nav-link" to="/LandingPage">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/ProfileCards">
                Matches
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/LandingPage">
                Mailbox
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/LandingPage">
                Chat
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/Search">
                Search
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/notifications">
                Notification
              </a>
            </li>
            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle"
                to="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Profile
              </Link>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <Link className="dropdown-item" to="/current-user">
                  My Profile
                </Link>
                <Link className="dropdown-item" to="/update-profile">
                  Edit Profile
                </Link>
              </div>
            </li>
          </ul>
        </div>
      </nav>

      <div className="container-fluid mt-4">
        <div className="row">
          {/* Left Side: Search Filters Links */}
          <div className="col-md-4">
            <div className="card p-3">
              <h4>Search Filters</h4>

              <div className="mb-3">
                <Link to="/search-preference/location">
                  <button className="btn btn-secondary w-100 mt-3">
                    Search by Location
                  </button>
                </Link>
              </div>

              <div className="mb-3">
                <Link to="/search-preference/caste-subcaste">
                  <button className="btn btn-secondary w-100 mt-3">
                    Search by Caste/Sub-caste
                  </button>
                </Link>
              </div>

              <div className="mb-3">
                <Link to="/search-preference/profession">
                  <button className="btn btn-secondary w-100 mt-3">
                    Search by Profession
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Side: Profile Cards */}
          <div className="col-md-8">
            <Profilecards showNavbar={false} />
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
