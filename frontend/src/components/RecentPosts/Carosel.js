import React, { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import SendInterestButton from "../Interest/InterestSent";
import "./Carosel.css";
import AddFavorite from "../Favorites/AddFavorites";

const Carosel = () => {
  const [profiles, setProfiles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentProfiles = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not logged in.");

        const response = await axios.get(
          "http://localhost:5000/api/user/biodata/recent-profiles",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProfiles(response.data.profiles);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch profiles.");
        setLoading(false);
      }
    };

    fetchRecentProfiles();
  }, []);

  // Carousel settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Show 3 profiles at a time
    slidesToScroll: 1,
    afterChange: (index) => handleSlide(index), // Trigger after sliding
  };

  // Slide Navigation Logic
  const handleSlide = (index) => {
    if (index === 2) {
      navigate("/recent");
    }
  };
  const renderProfileCard = (profile, index) => (
    <div className="p-3" key={index}>
      <div className="card shadow-sm h-100">
        <div className="card-body text-center">
          {profile.photo ? (
            <img
              src={`http://localhost:5000/${profile.photo.replace(/\\/g, "/")}`}
              alt={profile.name}
              className="rounded-circle mb-3 center-img"
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
              No photo
            </div>
          )}
          <h5 className="text-primary">{profile.name}</h5>
          <p>
            <strong>Age:</strong> {profile.birthDate || "N/A"}
          </p>
          <p>
            <strong>Location:</strong> {profile.city || "N/A"}
          </p>
          <SendInterestButton receiverId={profile._id} />
          {/* Favorite Icon */}
          <AddFavorite userId={profile._id} />{" "}
          {/* Use AddFavorite Component */}
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
    return <div className="alert alert-danger text-center my-5">{error}</div>;
  }

  return (
    <div className="container-fluid my-5">
      <Slider {...settings}>
        {profiles.length > 0 ? (
          profiles.map((profile, index) => renderProfileCard(profile, index))
        ) : (
          <p className="text-center">No profiles available</p>
        )}
      </Slider>
    </div>
  );
};

export default Carosel;
