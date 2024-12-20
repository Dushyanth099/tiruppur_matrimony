import { Link } from "react-router-dom";
import "./LandingPage.css";
import React from "react";
import Profilecards from "../Profilecards/Profilecards";
import Carosel from "../RecentPosts/Carosel";

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
              <a className="nav-link" href="/chat/:userId">
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

              <div className="mb-3">
                <Link to="/Recent">
                  <button className="btn btn-secondary w-100 mt-3">
                    Recent posts
                  </button>
                </Link>
              </div>
              <div className="mb-3">
                <Link to="/favorites">
                  <button className="btn btn-secondary w-100 mt-3">
                    Favourites
                  </button>
                </Link>
              </div>
              <div className="mb-3">
                <Link to="/current-user">
                  <button className="btn btn-secondary w-100 mt-3 profile-border">
                    Profile
                  </button>
                </Link>
              </div>
              <div className="mb-3">
                <Link to="/update-profile">
                  <button className="btn btn-secondary w-100 mt-3">
                    EditProfile
                  </button>
                </Link>
              </div>
              <div className="mb-3">
                <Link to="/search">
                  <button className="btn btn-secondary w-100 mt-3">
                    Advanced Search
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
      <div className="container-fluid ">
        <h1 id="text-title">Recents Posts</h1>
      </div>
      <Carosel />
      {/* Footer */}
      <footer className="footer mt-5">
        <div className="footer-content ms-auto mb-5">
          <a
            href="https://api.whatsapp.com/send?phone=8220406322"
            className="whatsapp-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-whatsapp"></i> WhatsApp
          </a>
        </div>
      </footer>
    </>
  );
};

export default LandingPage;
