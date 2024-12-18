import React, { useEffect, useState } from "react";
import "./Favorites.css";
import SendInterestButton from "../Interest/InterestSent";
import AddFavorite from "../Favorites/AddFavorites";
import { useNavigate } from "react-router-dom";

const FavouriteNotification = () => {
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found, please log in.");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/user/getFavorites",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setFavorites(data.favorites);
        } else {
          const data = await response.json();
          setError(data.message || "Failed to fetch favorites.");
        }
      } catch (err) {
        console.error("Error fetching favorites:", err);
        setError("An error occurred. Please try again.");
      }
    };

    fetchFavorites();
  }, []);

  const handleToggleFavorite = (userId, isFavorite) => {
    setFavorites((prevFavorites) =>
      prevFavorites.map((user) =>
        user._id === userId ? { ...user, isFavorite } : user
      )
    );
  };
  const renderProfileCard = (user, index) => (
    <div className="col-lg-4 col-md-6 col-sm-12 mb-4" key={index}>
      <div className="card shadow-sm profile-card h-100">
        <div className="card-body text-center">
          {/* User Photo */}
          {user.photo ? (
            <img
              src={`http://localhost:5000/${user.photo.replace(/\\/g, "/")}`}
              alt={user.name}
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
          <h5 className="card-title text-primary">{user.name}</h5>
          <p className="card-text">
            <strong>Age:</strong> {user.birthDate || "N/A"}
          </p>
          <p className="card-text">
            <strong>Location:</strong> {user.city || "N/A"}
          </p>
          {/* Add Interest and Favorite Buttons */}
          <SendInterestButton receiverId={user._id} />
          <AddFavorite
            userId={user._id}
            initialFavoriteState={user.isFavorite || true} // Mark as favorite initially
            onToggleFavorite={handleToggleFavorite} // Handle state changes
          />
          {/* Detailed Info with Toggle */}
          {expandedIndex === index ? (
            <>
              <p>
                <strong>Religion:</strong> {user.religion || "N/A"}
              </p>
              <p>
                <strong>Mother Tongue:</strong> {user.motherTongue || "N/A"}
              </p>
              <p>
                <strong>Height:</strong> {user.height || "N/A"} cm
              </p>
              <p>
                <strong>Caste:</strong> {user.caste || "N/A"}
              </p>
              <p>
                <strong>Sub Caste:</strong> {user.subCaste || "N/A"}
              </p>
              <p>
                <strong>Gothram:</strong> {user.gothram || "N/A"}
              </p>
              <p>
                <strong>Education:</strong> {user.highestEducation || "N/A"}
              </p>
              <p>
                <strong>Occupation:</strong> {user.occupation || "N/A"}
              </p>
              <p>
                <strong>Annual Income:</strong> {user.annualIncome || "N/A"}
              </p>
              <p>
                <strong>State:</strong> {user.state || "N/A"}
              </p>
              <p>
                <strong>About:</strong> {user.about || "No additional details"}
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
                onClick={() => navigate("/LandingPage")}
              >
                HomePage
              </button>
            </li>
          </ul>
        </div>
      </nav>
      <div className="container-fluid">
        <h3 className="text-center">Your Favorites</h3>
        {error && <div className="error">{error}</div>}
        <div className="row">
          {favorites.length > 0 ? (
            favorites.map((user, index) => renderProfileCard(user, index))
          ) : (
            <div className="col text-center">
              <p>No favorites found</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FavouriteNotification;
