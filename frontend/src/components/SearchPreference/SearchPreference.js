import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const SearchPreferencePage = () => {
  const [formData, setFormData] = useState({
    caste: "",
    subCaste: "",
    city: "",
    state: "",
    occupation: "",
    employedIn: "",
  });

  const { searchType } = useParams(); // To dynamically fetch the search category
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token"); // Assuming token is stored in localStorage

    // Clean up any undefined values in formData
    const searchData = { ...formData };
    Object.keys(searchData).forEach(
      (key) => searchData[key] === undefined && delete searchData[key]
    );

    try {
      let url = "http://localhost:5000/api/auth/biodata/search"; // Default URL

      // Define the correct URL based on the search type
      if (searchType === "caste-subcaste") {
        url = "http://localhost:5000/api/auth/search/casteSubCaste";
      } else if (searchType === "location") {
        url = "http://localhost:5000/api/auth/search/location";
      } else if (searchType === "profession") {
        url = "http://localhost:5000/api/auth/search/profession";
      }

      const response = await axios.post(url, searchData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.length > 0) {
        toast.success("Search results found!");
        navigate("/search-results", { state: { results: response.data } });
      } else {
        toast.info("No results found.");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "An error occurred during search."
      );
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
        <h3>
          <small>Search by</small> {searchType.replace("-", " ").toUpperCase()}
        </h3>

        <form onSubmit={handleSubmit}>
          {searchType === "caste-subcaste" && (
            <>
              <input
                type="text"
                name="caste"
                placeholder="Enter Caste"
                value={formData.caste}
                onChange={handleChange}
                className="form-control mb-2"
              />
              <input
                type="text"
                name="subCaste"
                placeholder="Enter Sub-Caste"
                value={formData.subCaste}
                onChange={handleChange}
                className="form-control mb-2"
              />
            </>
          )}

          {searchType === "location" && (
            <>
              <input
                type="text"
                name="city"
                placeholder="Enter City"
                value={formData.city}
                onChange={handleChange}
                className="form-control mb-2"
              />
              <input
                type="text"
                name="state"
                placeholder="Enter State"
                value={formData.state}
                onChange={handleChange}
                className="form-control mb-2"
              />
            </>
          )}

          {searchType === "profession" && (
            <>
              <input
                type="text"
                name="occupation"
                placeholder="Enter Occupation"
                value={formData.occupation}
                onChange={handleChange}
                className="form-control mb-2"
              />
              <input
                type="text"
                name="employedIn"
                placeholder="Employed In"
                value={formData.employedIn}
                onChange={handleChange}
                className="form-control mb-2"
              />
            </>
          )}

          <button type="submit" className="btn btn-primary w-100">
            Search
          </button>
        </form>
      </div>
    </>
  );
};

export default SearchPreferencePage;
