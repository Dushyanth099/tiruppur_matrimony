import React, { useState, useEffect } from "react";
import "./UpdateProfile.css";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
const UpdateProfile = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchUserDetails = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/current-user",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setFormData({
          name: data.name || "",
          email: data.email || "",
          gender: data.gender || "",
          birthDate: data.birthDate || "",
          religion: data.religion || "",
          motherTongue: data.motherTongue || "",
          caste: data.caste || "",
          subCaste: data.subCaste || "",
          gothram: data.gothram || "",
          height: data.height || "",
          highestEducation: data.highestEducation || "",
          employedIn: data.employedIn || "",
          occupation: data.occupation || "",
          annualIncome: data.annualIncome || "",
          workLocation: data.workLocation || "",
          state: data.state || "",
          city: data.city || "",
          about: data.about || "",
        });
      } else {
        console.error("Error fetching user details:", data.message);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({ ...prevData, photo: e.target.files[0] }));
  };

  const updateUserDetails = async () => {
    const token = localStorage.getItem("token");
    const formDataObj = new FormData();
    for (const key in formData) {
      formDataObj.append(key, formData[key]);
    }

    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:5000/api/auth/update-user",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataObj,
        }
      );

      const result = await response.json();
      if (response.ok) {
        toast.success("Profile updated successfully!");
      } else {
        setError(result.message);
        toast.error(result.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating user details:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

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
      <div className="container mt-5 update-profile">
        <h2 className="text-center mb-4">Update Profile</h2>
        {error && <p className="alert alert-danger">{error}</p>}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateUserDetails();
          }}
        >
          <div className="row">
            <div className="col-md-6 mb-3">
              <label>Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label>Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Add other form fields in similar row structures */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label>Gender</label>
              <select
                name="gender"
                className="form-control"
                value={formData.gender}
                onChange={handleInputChange}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label>BirthDate</label>
              <input
                type="date"
                name="birthDate"
                className="form-control"
                value={formData.birthDate}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label>religion</label>
              <input
                type="text"
                name="religion"
                className="form-control"
                value={formData.religion}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label>motherTongue</label>
              <input
                type="text"
                name="motherTongue"
                className="form-control"
                value={formData.motherTongue}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label>caste</label>
              <input
                type="text"
                name="caste"
                className="form-control"
                value={formData.caste}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label>subCaste</label>
              <input
                type="text"
                name="subcaste"
                className="form-control"
                value={formData.subCaste}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label>gothram</label>
              <input
                type="text"
                name="gothram"
                className="form-control"
                value={formData.gothram}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label>height</label>
              <input
                type="number"
                name="height"
                className="form-control"
                value={formData.height}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label>highestEducation</label>
              <input
                type="text"
                name="highestEducation"
                className="form-control"
                value={formData.highestEducation}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label>employedIn</label>
              <input
                type="text"
                name="employedIn"
                className="form-control"
                value={formData.employedIn}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label>occupation</label>
              <input
                type="text"
                name="occupation"
                className="form-control"
                value={formData.occupation}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label>annualIncome</label>
              <input
                type="number"
                name="annualIncome"
                className="form-control"
                value={formData.annualIncome}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label>workLocation</label>
              <input
                type="text"
                name="workLocation"
                className="form-control"
                value={formData.workLocation}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label>state</label>
              <input
                type="text"
                name="state"
                className="form-control"
                value={formData.state}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label>city</label>
              <input
                type="text"
                name="city"
                className="form-control"
                value={formData.city}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label>about</label>
              <input
                type="text"
                name="about"
                className="form-control"
                value={formData.about}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* File Upload */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label>Photo</label>
              <input
                type="file"
                name="photo"
                className="form-control"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-success btn-block"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
          <ToastContainer position="top-right" autoClose={3000} />
        </form>
      </div>
    </>
  );
};

export default UpdateProfile;
