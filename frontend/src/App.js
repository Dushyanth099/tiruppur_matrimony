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
import Profilecards from "./components/Profilecards/Profilecards";
import Notifications from "./components/Interest/Notifications";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/BioData" element={<BioData />} />
        <Route path="/ProfileCards" element={<Profilecards />} />
        <Route path="/LandingPage" element={<LandingPage />} />
        <Route path="/current-user" element={<CurrentUser />} />
        <Route path="/update-profile" element={<UpdateProfile />} />
        <Route path="/search" element={<Search />} />
        <Route
          path="/search-preference/:searchType"
          element={<SearchPreferencePage />}
        />
        <Route path="/search-results" element={<SearchResultsPage />} />
    
        <Route path="/notifications" element={<Notifications />} />
    
      </Routes>
    </div>
  );
}

export default App;
