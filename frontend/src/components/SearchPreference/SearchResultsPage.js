import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const SearchResultsPage = () => {
  const location = useLocation();
  const results = location.state?.results || [];
  const [expandedCardId, setExpandedCardId] = useState(null);
  const navigate = useNavigate();

  const toggleExpand = (id) => {
    if (expandedCardId === id) {
      setExpandedCardId(null);
    } else {
      setExpandedCardId(id);
    }
  };

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
      <div className="container mt-4">
        <h3>Search Results</h3>
        {results.length > 0 ? (
          <div className="row">
            {results.map((item) => (
              <div key={item._id} className="col-md-12 mb-4">
                <div className="card">
                  {/* Show Photo if exists */}
                  {item.photo && (
                    <img
                      src={`http://localhost:5000/${item.photo.replace(
                        /\\/g,
                        "/"
                      )}`}
                      className="card-img-top"
                      alt={item.name}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  )}
                  <div className="card-body">
                    <h5 className="card-title text-center">{item.name}</h5>
                    <p className="card-text">
                      <strong>Age:</strong> {item.age} <br />
                      <strong>Location:</strong> {item.city}, {item.state}
                    </p>
                    <button
                      className="btn btn-primary"
                      onClick={() => toggleExpand(item._id)}
                    >
                      {expandedCardId === item._id ? "Show Less" : "Read More"}
                    </button>
                  </div>

                  {/* Expanded Card Details */}
                  {expandedCardId === item._id && (
                    <div className="card-body">
                      <p>
                        <strong>Email:</strong> {item.userId?.userEmail}
                      </p>
                      <p>
                        <strong>Gender:</strong> {item.gender}
                      </p>
                      <p>
                        <strong>Religion:</strong> {item.religion}
                      </p>
                      <p>
                        <strong>Caste:</strong> {item.caste}
                      </p>
                      <p>
                        <strong>Sub-Caste:</strong> {item.subCaste}
                      </p>
                      <p>
                        <strong>Mother Tongue:</strong> {item.motherTongue}
                      </p>
                      <p>
                        <strong>Gothram:</strong> {item.gothram}
                      </p>
                      <p>
                        <strong>Dosham:</strong> {item.dosham}
                      </p>
                      <p>
                        <strong>Marital Status:</strong> {item.maritalStatus}
                      </p>
                      <p>
                        <strong>Height:</strong> {item.height}
                      </p>
                      <p>
                        <strong>Family Status:</strong> {item.familyStatus}
                      </p>
                      <p>
                        <strong>Family Type:</strong> {item.familyType}
                      </p>
                      <p>
                        <strong>Family Values:</strong> {item.familyValues}
                      </p>
                      <p>
                        <strong>Disability:</strong> {item.disability}
                      </p>
                      <p>
                        <strong>Highest Education:</strong>{" "}
                        {item.highestEducation}
                      </p>
                      <p>
                        <strong>Employed In:</strong> {item.employedIn}
                      </p>
                      <p>
                        <strong>Occupation:</strong> {item.occupation}
                      </p>
                      <p>
                        <strong>Annual Income:</strong> {item.annualIncome}
                      </p>
                      <p>
                        <strong>Work Location:</strong> {item.workLocation}
                      </p>
                      <p>
                        <strong>City:</strong> {item.city}
                      </p>
                      <p>
                        <strong>State:</strong> {item.state}
                      </p>
                      <p>
                        <strong>About:</strong> {item.about}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </>
  );
};

export default SearchResultsPage;
