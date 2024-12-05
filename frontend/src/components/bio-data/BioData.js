import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./BioData.css";
import HomeNavbar from "../home-navbar/HomeNavbar";
import { useLocation, useNavigate } from "react-router-dom";

const tamilNaduCastes = [
  "Brahmin",
  "Chettiar",
  "Gounder",
  "Nadar",
  "Vanniyar",
  "Thevar",
  "Adi Dravidar",
  "Arunthathiyar",
  "Kallar",
  "Maravar",
  "Pillai",
  "Other",
];

const stateCityMapping = {
  TamilNadu: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
  Karnataka: ["Bengaluru", "Mysore", "Hubli", "Mangalore", "Belgaum"],
  Kerala: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kannur"],
};

const BioData = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Safely get userId from location.state or redirect if missing
  const userId = location.state?.userId || localStorage.getItem("userId");
  const token = location.state?.token || localStorage.getItem("token");

  useEffect(() => {
    if (!userId || !token) {
      toast.error("Authentication required. Redirecting...");
      navigate("/register", { replace: true }); // Redirect to register page
    }
  }, [userId, token, navigate]);

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    birthDate: "",
    religion: "",
    motherTongue: "",
    caste: "",
    subCaste: "",
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
    annualIncome: "",
    workLocation: "",
    state: "",
    city: "",
    about: "",
    photo: null, // Adding photo field
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "photo" ? files[0] : value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // Retrieve token
    const userId = localStorage.getItem("userId"); // Retrieve userId

    if (!token || !userId) {
      toast.error("You must be logged in to submit biodata.");
      return;
    }
    // Validate gender
    if (!["Male", "Female"].includes(formData.gender)) {
      toast.error("Invalid gender selected. Please choose Male or Female.");
      return;
    }

    try {
      // Prepare FormData for submission
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("userId", userId); // Include userId in the payload

      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          formDataToSubmit.append(key, value);
        }
      });

      const response = await fetch("http://localhost:5000/api/auth/biodata", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Add token to headers
        },
        body: formDataToSubmit,
      });

      if (response.ok) {
        // Clear localStorage and redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        toast.success(
          "BioData submitted successfully! Redirecting to login..."
        );
        setTimeout(() => {
          navigate("/login"); // Redirect to login page
        }, 2000); // Add slight delay for user feedback
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to submit BioData.");
      }
    } catch (error) {
      console.error("Error submitting BioData:", error);
      toast.error("Failed to submit BioData. Please try again.");
    }
  };

  if (!userId) {
    return null; // Prevent rendering if userId is missing
  }
  return (
    <div>
      <HomeNavbar />
      <div className="container mt-5">
        <h2 className="text-center mb-4">Bio Data Form</h2>
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          {/* Gender */}
          <div className="mb-3">
            <label htmlFor="gender" className="form-label">
              Gender
            </label>
            <select
              className="form-select"
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* Birth Date */}
          <div className="mb-3">
            <label htmlFor="birthDate" className="form-label">
              Date of Birth
            </label>
            <input
              type="date"
              className="form-control"
              id="birthDate"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              required
            />
          </div>

          {/* Religion */}
          <div className="mb-3">
            <label htmlFor="religion" className="form-label">
              Religion
            </label>
            <select
              className="form-select"
              id="religion"
              name="religion"
              value={formData.religion}
              onChange={handleChange}
              required
            >
              <option value="">Select Religion</option>
              <option value="Hindu">Hindu</option>
              <option value="Muslim">Muslim</option>
              <option value="Christian">Christian</option>
              <option value="Others">Others</option>
            </select>
          </div>

          {/* Mother Tongue */}
          <div className="mb-3">
            <label htmlFor="motherTongue" className="form-label">
              Mother Tongue
            </label>
            <input
              type="text"
              className="form-control"
              id="motherTongue"
              name="motherTongue"
              value={formData.motherTongue}
              onChange={handleChange}
              required
            />
          </div>

          {/* Caste */}
          <div className="mb-3">
            <label htmlFor="caste" className="form-label">
              Caste
            </label>
            <select
              className="form-select"
              id="caste"
              name="caste"
              value={formData.caste}
              onChange={handleChange}
              required
            >
              <option value="">Select Caste</option>
              {tamilNaduCastes.map((caste) => (
                <option key={caste} value={caste}>
                  {caste}
                </option>
              ))}
            </select>
          </div>
          {/* subCaste */}
          <div className="mb-3">
            <label htmlFor="subCaste" className="form-label">
              SubCaste
            </label>
            <input
              type="text"
              className="form-control"
              id="subCaste"
              name="subCaste"
              value={formData.subCaste}
              onChange={handleChange}
              required
            />
          </div>
          {/* Gothram */}
          <div className="mb-3">
            <label htmlFor="gothram" className="form-label">
              Gothram
            </label>
            <input
              type="text"
              className="form-control"
              id="gothram"
              name="gothram"
              value={formData.gothram}
              onChange={handleChange}
              required
            />
          </div>

          {/* Height */}
          <div className="mb-3">
            <label htmlFor="height" className="form-label">
              Height (in cm)
            </label>
            <input
              type="number"
              className="form-control"
              id="height"
              name="height"
              value={formData.height}
              onChange={handleChange}
              required
            />
          </div>

          {/* Family Status */}
          <div className="mb-3">
            <label htmlFor="familyStatus" className="form-label">
              Family Status
            </label>
            <select
              className="form-select"
              id="familyStatus"
              name="familyStatus"
              value={formData.familyStatus}
              onChange={handleChange}
              required
            >
              <option value="">Select Family Status</option>
              <option value="Middle Class">Middle Class</option>
              <option value="Upper Middle Class">Upper Middle Class</option>
              <option value="Rich">Rich</option>
              <option value="Affluent">Affluent</option>
            </select>
          </div>

          {/* Family Type */}
          <div className="mb-3">
            <label htmlFor="familyType" className="form-label">
              Family Type
            </label>
            <select
              className="form-select"
              id="familyType"
              name="familyType"
              value={formData.familyType}
              onChange={handleChange}
              required
            >
              <option value="">Select Family Type</option>
              <option value="Joint">Joint</option>
              <option value="Nuclear">Nuclear</option>
            </select>
          </div>

          {/* Family Values */}
          <div className="mb-3">
            <label htmlFor="familyValues" className="form-label">
              Family Values
            </label>
            <select
              className="form-select"
              id="familyValues"
              name="familyValues"
              value={formData.familyValues}
              onChange={handleChange}
            >
              <option value="">Select Family Values</option>
              <option value="Traditional">Traditional</option>
              <option value="Moderate">Moderate</option>
              <option value="Liberal">Liberal</option>
            </select>
          </div>

          {/* Highest Education */}
          <div className="mb-3">
            <label htmlFor="highestEducation" className="form-label">
              Highest Education
            </label>
            <input
              type="text"
              className="form-control"
              id="highestEducation"
              name="highestEducation"
              value={formData.highestEducation}
              onChange={handleChange}
              required
            />
          </div>
          {/* employedIn */}
          <div className="mb-3">
            <label htmlFor=" employedIn" className="form-label">
              EmployedIn
            </label>
            <input
              type="text"
              className="form-control"
              id="employedIn"
              name="employedIn"
              value={formData.employedIn}
              onChange={handleChange}
              required
            />
          </div>

          {/* occupation */}
          <div className="mb-3">
            <label htmlFor="occupation" className="form-label">
              Occupation
            </label>
            <input
              type="text"
              className="form-control"
              id="occupation"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              required
            />
          </div>

          {/* annual Income */}
          <div className="mb-3">
            <label htmlFor=" annualIncome" className="form-label">
              AnnualIncome
            </label>
            <input
              type="text"
              className="form-control"
              id="annualIncome"
              name="annualIncome"
              value={formData.annualIncome}
              onChange={handleChange}
              required
            />
          </div>

          {/* Work Location */}
          <div className="mb-3">
            <label htmlFor="workLocation" className="form-label">
              Work Location
            </label>
            <input
              type="text"
              className="form-control"
              id="workLocation"
              name="workLocation"
              value={formData.workLocation}
              onChange={handleChange}
              required
            />
          </div>

          {/* State */}
          <div className="mb-3">
            <label htmlFor="state" className="form-label">
              State
            </label>
            <select
              className="form-select"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
            >
              <option value="">Select State</option>
              {Object.keys(stateCityMapping).map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div className="mb-3">
            <label htmlFor="city" className="form-label">
              City
            </label>
            <select
              className="form-select"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            >
              <option value="">Select City</option>
              {formData.state &&
                stateCityMapping[formData.state]?.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
            </select>
          </div>

          {/* About */}
          <div className="mb-3">
            <label htmlFor="about" className="form-label">
              About
            </label>
            <textarea
              className="form-control"
              id="about"
              name="about"
              rows="4"
              value={formData.about}
              onChange={handleChange}
              required
            ></textarea>

            {/* Photo Upload */}
            <div className="mb-3">
              <label htmlFor="photo" className="form-label">
                Upload Photo
              </label>
              <input
                type="file"
                className="form-control"
                id="photo"
                name="photo"
                onChange={handleChange}
                accept="image/*"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <div className="text-center">
            <button type="submit" className="btn btn-primary">
              Complete Registration
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default BioData;
