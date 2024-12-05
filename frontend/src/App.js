import React from "react";
import { Routes, Route } from "react-router-dom"; // React Router for navigation
import Home from "./pages/home/Home"; // Home component
import Login from "./components/login/Login"; // Login component
import Register from "./components/register/Register"; // Register component
import "./App.css"; // Global styles
import BioData from "./components/bio-data/BioData";
import LandingPage from "./components/LandingPage/LandingPage";
import CurrentUser from "./components/Profile/CurrentUser";
import UpdateProfile from "./components/Profile/UpdateProfile";
import Search from "./components/Search/Search";
import SearchPreferencePage from "./components/SearchPreference/SearchPreference";
import SearchResultsPage from "./components/SearchPreference/SearchResultsPage";
function App() {
  return (
    <div className="App">
      <Routes>
        {/* Route for Home page */}
        <Route path="/" element={<Home />} />

        {/* Route for Home page */}
        <Route path="/Home" element={<Home />} />

        {/* Route for Login page */}
        <Route path="/login" element={<Login />} />

        {/* Route for Register page */}

        <Route path="/register" element={<Register />} />
        {/* Route for Register page */}

        <Route path="/BioData" element={<BioData />} />

        {/* LandingPage */}
        <Route path="/LandingPage" element={<LandingPage />} />
        <Route path="/current-user" element={<CurrentUser />} />
        <Route path="/update-profile" element={<UpdateProfile />} />
        <Route path="/search" element={<Search />} />
        <Route
          path="/search-preference/:searchType"
          element={<SearchPreferencePage />}
        />
        <Route path="/search-results" element={<SearchResultsPage />} />
      </Routes>
    </div>
  );
}

export default App;
