import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Profilecards.css";
import { useNavigate } from "react-router-dom";
import SendInterestButton from "../Interest/InterestSent";
const Profilecards = ({ showNavbar = true }) => {
  const [biodata, setBiodata] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBiodata = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authorization token not found");
        }
        const response = await fetch("http://localhost:5000/api/auth/biodata", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch biodata: ${response.statusText}`);
        }
        const data = await response.json();
        setBiodata(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBiodata();
  }, []);

  const renderProfileCard = (userData, index) => (
    <div className="col-lg-4 col-md-6 col-sm-12 mb-4" key={index}>
      <div className="card shadow-sm profile-card h-100">
        <div className="card-body text-center">
          {/* User Photo */}
          {userData.photo ? (
            <img
              src={`http://localhost:5000/${userData.photo.replace(
                /\\/g,
                "/"
              )}`}
              alt={userData.name}
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
          <h5 className="card-title text-primary">{userData.name}</h5>
          <p className="card-text">
            <strong>Age:</strong> {userData.birthDate || "N/A"}
          </p>
          <p className="card-text">
            <strong>Location:</strong> {userData.city || "N/A"}
          </p>
          {/* Add Interest Button */}
          <SendInterestButton receiverId={userData._id} />
          {/* Detailed Info with Toggle */}
          {expandedIndex === index ? (
            <>
              <p>
                <strong>Religion:</strong> {userData.religion || "N/A"}
              </p>
              <p>
                <strong>Mother Tongue:</strong> {userData.motherTongue || "N/A"}
              </p>
              <p>
                <strong>Height:</strong> {userData.height || "N/A"} cm
              </p>
              <p>
                <strong>Caste:</strong> {userData.caste || "N/A"}
              </p>
              <p>
                <strong>Sub Caste:</strong> {userData.subCaste || "N/A"}
              </p>
              <p>
                <strong>Gothram:</strong> {userData.gothram || "N/A"}
              </p>
              <p>
                <strong>Education:</strong> {userData.highestEducation || "N/A"}
              </p>
              <p>
                <strong>Occupation:</strong> {userData.occupation || "N/A"}
              </p>
              <p>
                <strong>Annual Income:</strong> {userData.annualIncome || "N/A"}
              </p>
              <p>
                <strong>State:</strong> {userData.state || "N/A"}
              </p>
              <p>
                <strong>About:</strong>{" "}
                {userData.about || "No additional details"}
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
      {/* Render navbar only if showNavbar is true */}
      {showNavbar && (
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
      )}
      <div className="container-fluid my-5">
        <div className="row">
          {biodata.length > 0 ? (
            biodata.map((userData, index) => renderProfileCard(userData, index))
          ) : (
            <p className="text-center">No profiles available</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Profilecards;
