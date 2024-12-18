import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Recent.css";
import { useNavigate } from "react-router-dom";
import SendInterestButton from "../Interest/InterestSent";

const Recentposts = () => {
  const [profiles, setProfiles] = useState([]); // Correct state initialization
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentProfiles = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("User not logged in.");
        }

        const response = await axios.get(
          "http://localhost:5000/api/user/biodata/recent-profiles",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setProfiles(response.data.profiles); // Correctly set profiles
        setLoading(false);
      } catch (err) {
        console.error("Error fetching recent profiles:", err.message);
        setError(err.message || "Failed to fetch profiles.");
        setLoading(false);
      }
    };

    fetchRecentProfiles();
  }, []);

  const renderProfileCard = (profile, index) => (
    <div className="col-lg-4 col-md-6 col-sm-12 mb-4" key={index}>
      <div className="card shadow-sm profile-card h-100">
        <div className="card-body text-center">
          {/* User Photo */}
          {profile.photo ? (
            <img
              src={`http://localhost:5000/${profile.photo.replace(/\\/g, "/")}`}
              alt={profile.name}
              className="card-img-top rounded-circle mb-3"
              style={{ height: "100px", width: "100px", objectFit: "cover" }}
            />
          ) : (
            <div
              className="rounded-circle mb-3"
              style={{
                height: "100px",
                width: "100px",
                backgroundColor: "#f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span>No photo</span>
            </div>
          )}

          {/* Basic Info */}
          <h5 className="card-title text-primary">{profile.name}</h5>
          <p className="card-text">
            <strong>Age:</strong> {profile.birthDate || "N/A"}
          </p>
          <p className="card-text">
            <strong>Location:</strong> {profile.city || "N/A"}
          </p>

          {/* Add Interest Button */}
          <SendInterestButton receiverId={profile._id} />

          {/* Detailed Info with Toggle */}
          {expandedIndex === index ? (
            <>
              <p>
                <strong>Religion:</strong> {profile.religion || "N/A"}
              </p>
              <p>
                <strong>Mother Tongue:</strong> {profile.motherTongue || "N/A"}
              </p>
              <p>
                <strong>Height:</strong> {profile.height || "N/A"} cm
              </p>
              <p>
                <strong>Caste:</strong> {profile.caste || "N/A"}
              </p>
              <p>
                <strong>Sub Caste:</strong> {profile.subCaste || "N/A"}
              </p>
              <p>
                <strong>Gothram:</strong> {profile.gothram || "N/A"}
              </p>
              <p>
                <strong>Education:</strong> {profile.highestEducation || "N/A"}
              </p>
              <p>
                <strong>Occupation:</strong> {profile.occupation || "N/A"}
              </p>
              <p>
                <strong>Annual Income:</strong> {profile.annualIncome || "N/A"}
              </p>
              <p>
                <strong>State:</strong> {profile.state || "N/A"}
              </p>
              <p>
                <strong>About:</strong>{" "}
                {profile.about || "No additional details"}
              </p>
              <button
                className="btn btn-link p-0 text-decoration-none"
                onClick={() => setExpandedIndex(null)}
              >
                Show Less
              </button>
            </>
          ) : (
            <button
              className="btn btn-link p-0 text-decoration-none"
              onClick={() => setExpandedIndex(index)}
            >
              Read More
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center my-5">Error: {error}</div>
    );
  }

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-warning">
        <div className="container-fluid">
          <a className="navbar-brand" href="/LandingPage">
            Tiruppur Matrimony
          </a>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <button
                className="btn btn-dark mx-2"
                onClick={() => navigate("/LandingPage")}
              >
                HomePage
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Profile Cards */}
      <div className="container-fluid my-5">
        <div className="row">
          {profiles.length > 0 ? (
            profiles.map((profile, index) => renderProfileCard(profile, index))
          ) : (
            <p className="text-center">No profiles available</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Recentposts;
