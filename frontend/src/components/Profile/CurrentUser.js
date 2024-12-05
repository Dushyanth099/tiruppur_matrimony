import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CurrentUser.css";
import { useNavigate } from "react-router-dom";

const CurrentUser = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found, please log in.");
      }

      const response = await fetch(
        "http://localhost:5000/api/auth/current-user",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userData = await response.json();

      if (response.ok) {
        setUserDetails(userData); // Update state with user details
      } else {
        setError(userData.message); // Set error message if any
      }
    } catch (err) {
      setError(err.message); // Set error if the fetch fails
    } finally {
      setLoading(false); // Set loading state to false after request completes
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  if (loading) {
    return <div>Loading user details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-warning">
        <div className="container-fluid">
          <a className="navbar-brand" href="/LandingPage">
            Tiruppur Matrimony
          </a>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <button
                className="btn btn-dark mx-2"
                onClick={() =>navigate("/LandingPage")}
              >
                HomePage
              </button>
            </li>
          </ul>
        </div>
      </nav>
      <div className="container mt-4">
        <div className="card shadow">
          <div className="card-header text-center bg-primary text-white">
            <h2>Hi, {userDetails?.name}</h2>
          </div>
          <div className="card-body">
            {userDetails ? (
              <div className="row">
                <div className="col-md-6 mb-3">
                  {userDetails.photo && (
                    <img
                      src={`http://localhost:5000/${userDetails.photo.replace(
                        /\\/g,
                        "/"
                      )}`}
                      alt=""
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  )}
                  <p>
                    <strong>Name:</strong> {userDetails.name}
                  </p>
                  <p>
                    <strong>Gender:</strong> {userDetails.gender}
                  </p>
                  <p>
                    <strong>BirthDate:</strong> {userDetails.birthDate}
                  </p>
                  <p>
                    <strong>Religion:</strong> {userDetails.religion}
                  </p>
                  <p>
                    <strong>Mother Tongue:</strong> {userDetails.motherTongue}
                  </p>
                </div>
                <div className="col-md-6 mb-3">
                  <p>
                    <strong>Height:</strong> {userDetails.height}
                  </p>
                  <p>
                    <strong>Caste:</strong> {userDetails.caste}
                  </p>
                  <p>
                    <strong>Sub Caste:</strong> {userDetails.subCaste}
                  </p>
                  <p>
                    <strong>Gothram:</strong> {userDetails.gothram}
                  </p>
                  <p>
                    <strong>Education:</strong> {userDetails.highestEducation}
                  </p>
                </div>
                <div className="col-md-6 mb-3">
                  <p>
                    <strong>Occupation:</strong> {userDetails.occupation}
                  </p>
                  <p>
                    <strong>Annual Income:</strong> {userDetails.annualIncome}
                  </p>
                  <p>
                    <strong>State:</strong> {userDetails.state}
                  </p>
                  <p>
                    <strong>About:</strong> {userDetails.about}
                  </p>
                </div>
              </div>
            ) : (
              <p>No user details available</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CurrentUser;
