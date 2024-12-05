import React, { useState } from "react";
import axios from "axios";
import "./Search.css";
import { Link } from "react-router-dom";

const Search = () => {
  // Add this useState for expanded card
  const [expandedCardId, setExpandedCardId] = useState(null);

  // Function to toggle card expansion
  const toggleExpand = (id) => {
    setExpandedCardId(expandedCardId === id ? null : id);
  };

  const [filters, setFilters] = useState({
    name: "",
    religion: "",
    caste: "",
    subCaste: "",
    motherTongue: "",
    gothram: "",
    dosham: "",
    maritalStatus: "",
    height: "",
    familyStatus: "",
    familyType: "",
    familyValues: "",
    disability: "",
    highestEducation: "",
    employedIn: "",
    occupation: "",
    annualIncomeMin: "",
    annualIncomeMax: "",
    workLocation: "",
    city: "",
    state: "",
  });

  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Retrieve the token from storage (adjust as per your implementation)
      const token = localStorage.getItem("token");

      // Prepare the data to send
      const searchData = {
        ...filters,
        annualIncome: {
          min: filters.annualIncomeMin
            ? parseFloat(filters.annualIncomeMin)
            : undefined,
          max: filters.annualIncomeMax
            ? parseFloat(filters.annualIncomeMax)
            : undefined,
        },
        ageMin: filters.ageMin ? parseInt(filters.ageMin) : undefined,
        ageMax: filters.ageMax ? parseInt(filters.ageMax) : undefined,
      };

      // Remove undefined fields
      Object.keys(searchData).forEach(
        (key) => searchData[key] === undefined && delete searchData[key]
      );

      const response = await axios.post(
        "http://localhost:5000/api/auth/biodata/search",

        searchData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResults(response.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "An error occurred while searching."
      );
      setResults([]);
    }
  };

  return (
    <div>
      <h2>Search Biodata</h2>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={filters.name}
            onChange={handleChange}
            placeholder="Enter name"
          />
        </div>

        {/* Religion */}
        <div>
          <label>Religion:</label>
          <input
            type="text"
            name="religion"
            value={filters.religion}
            onChange={handleChange}
            placeholder="Enter religion"
          />
        </div>

        {/* Caste */}
        <div>
          <label>Caste:</label>
          <input
            type="text"
            name="caste"
            value={filters.caste}
            onChange={handleChange}
            placeholder="Enter caste"
          />
        </div>

        {/* Sub Caste */}
        <div>
          <label>Sub Caste:</label>
          <input
            type="text"
            name="subCaste"
            value={filters.subCaste}
            onChange={handleChange}
            placeholder="Enter sub caste"
          />
        </div>

        {/* Mother Tongue */}
        <div>
          <label>Mother Tongue:</label>
          <input
            type="text"
            name="motherTongue"
            value={filters.motherTongue}
            onChange={handleChange}
            placeholder="Enter mother tongue"
          />
        </div>

        {/* Gothram */}
        <div>
          <label>Gothram:</label>
          <input
            type="text"
            name="gothram"
            value={filters.gothram}
            onChange={handleChange}
            placeholder="Enter gothram"
          />
        </div>

        {/* Dosham */}
        <div>
          <label>Dosham:</label>
          <input
            type="text"
            name="dosham"
            value={filters.dosham}
            onChange={handleChange}
            placeholder="Enter dosham"
          />
        </div>

        {/* Marital Status */}
        <div>
          <label>Marital Status:</label>
          <select
            name="maritalStatus"
            value={filters.maritalStatus}
            onChange={handleChange}
          >
            <option value="">Any</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            {/* Add other options as needed */}
          </select>
        </div>

        {/* Height */}
        <div>
          <label>Height:</label>
          <input
            type="text"
            name="height"
            value={filters.height}
            onChange={handleChange}
            placeholder="Enter height"
          />
        </div>

        {/* Family Status */}
        <div>
          <label>Family Status:</label>
          <input
            type="text"
            name="familyStatus"
            value={filters.familyStatus}
            onChange={handleChange}
            placeholder="Enter family status"
          />
        </div>

        {/* Family Type */}
        <div>
          <label>Family Type:</label>
          <input
            type="text"
            name="familyType"
            value={filters.familyType}
            onChange={handleChange}
            placeholder="Enter family type"
          />
        </div>

        {/* Family Values */}
        <div>
          <label>Family Values:</label>
          <input
            type="text"
            name="familyValues"
            value={filters.familyValues}
            onChange={handleChange}
            placeholder="Enter family values"
          />
        </div>

        {/* Disability */}
        <div>
          <label>Disability:</label>
          <input
            type="text"
            name="disability"
            value={filters.disability}
            onChange={handleChange}
            placeholder="Enter disability status"
          />
        </div>

        {/* Highest Education */}
        <div>
          <label>Highest Education:</label>
          <input
            type="text"
            name="highestEducation"
            value={filters.highestEducation}
            onChange={handleChange}
            placeholder="Enter highest education"
          />
        </div>

        {/* Employed In */}
        <div>
          <label>Employed In:</label>
          <input
            type="text"
            name="employedIn"
            value={filters.employedIn}
            onChange={handleChange}
            placeholder="Enter employment sector"
          />
        </div>

        {/* Occupation */}
        <div>
          <label>Occupation:</label>
          <input
            type="text"
            name="occupation"
            value={filters.occupation}
            onChange={handleChange}
            placeholder="Enter occupation"
          />
        </div>

        {/* Annual Income */}
        <div>
          <label>Annual Income (Min):</label>
          <input
            type="number"
            name="annualIncomeMin"
            value={filters.annualIncomeMin}
            onChange={handleChange}
            placeholder="Enter minimum income"
          />
        </div>
        <div>
          <label>Annual Income (Max):</label>
          <input
            type="number"
            name="annualIncomeMax"
            value={filters.annualIncomeMax}
            onChange={handleChange}
            placeholder="Enter maximum income"
          />
        </div>

        {/* Work Location */}
        <div>
          <label>Work Location:</label>
          <input
            type="text"
            name="workLocation"
            value={filters.workLocation}
            onChange={handleChange}
            placeholder="Enter work location"
          />
        </div>

        {/* City */}
        <div>
          <label>City:</label>
          <input
            type="text"
            name="city"
            value={filters.city}
            onChange={handleChange}
            placeholder="Enter city"
          />
        </div>

        {/* State */}
        <div>
          <label>State:</label>
          <input
            type="text"
            name="state"
            value={filters.state}
            onChange={handleChange}
            placeholder="Enter state"
          />
        </div>

        {/* Submit Button */}
        <button type="submit">Search</button>
        <div>
           <Link className="btn btn-warning btn-block" to="/LandingPage">
          Homepage
        </Link>
        </div>
      </form>

      {/* Error Message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Search Results */}
      <div className="container">
        <h3 className="my-4">Results</h3>
        {results.length > 0 ? (
          <div className="row">
            {results.map((bio) => (
              <div key={bio._id} className="col-md-12 mb-4">
                <div className="card">
                  {bio.photo && (
                    <img
                      src={`http://localhost:5000/${bio.photo.replace(
                        /\\/g,
                        "/"
                      )}`}
                      className="card-img-top"
                      alt={bio.name}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  )}
                  <div className="card-body">
                    <h5 className="card-title text-center">{bio.name}</h5>
                    <p className="card-text">
                      <strong>Age:</strong> {bio.age} <br />
                      <strong>Location:</strong> {bio.city}, {bio.state}
                    </p>
                    <button
                      className="btn btn-primary"
                      onClick={() => toggleExpand(bio._id)}
                    >
                      {expandedCardId === bio._id ? "Show Less" : "Read More"}
                    </button>
                  </div>
                  {expandedCardId === bio._id && (
                    <div className="card-body">
                      <p>
                        <strong>Email:</strong> {bio.userId.userEmail}
                      </p>
                      <p>
                        <strong>Gender:</strong> {bio.gender}
                      </p>
                      <p>
                        <strong>Religion:</strong> {bio.religion}
                      </p>
                      <p>
                        <strong>Caste:</strong> {bio.caste}
                      </p>
                      <p>
                        <strong>Sub Caste:</strong> {bio.subCaste}
                      </p>
                      <p>
                        <strong>Mother Tongue:</strong> {bio.motherTongue}
                      </p>
                      <p>
                        <strong>Gothram:</strong> {bio.gothram}
                      </p>
                      <p>
                        <strong>Dosham:</strong> {bio.dosham}
                      </p>
                      <p>
                        <strong>Marital Status:</strong> {bio.maritalStatus}
                      </p>
                      <p>
                        <strong>Height:</strong> {bio.height}
                      </p>
                      <p>
                        <strong>Family Status:</strong> {bio.familyStatus}
                      </p>
                      <p>
                        <strong>Family Type:</strong> {bio.familyType}
                      </p>
                      <p>
                        <strong>Family Values:</strong> {bio.familyValues}
                      </p>
                      <p>
                        <strong>Disability:</strong> {bio.disability}
                      </p>
                      <p>
                        <strong>Highest Education:</strong>{" "}
                        {bio.highestEducation}
                      </p>
                      <p>
                        <strong>Employed In:</strong> {bio.employedIn}
                      </p>
                      <p>
                        <strong>Occupation:</strong> {bio.occupation}
                      </p>
                      <p>
                        <strong>Annual Income:</strong> {bio.annualIncome}
                      </p>
                      <p>
                        <strong>Work Location:</strong> {bio.workLocation}
                      </p>
                      <p>
                        <strong>City:</strong> {bio.city}
                      </p>
                      <p>
                        <strong>State:</strong> {bio.state}
                      </p>
                      <p>
                        <strong>About:</strong> {bio.about}
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
    </div>
  );
};

export default Search;
