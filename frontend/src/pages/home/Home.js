import React from "react";
import homeBackground from "../../images/backgroundimg.jpg";
import "./Home.css";
import HomeCards from "../../components/home-cards/HomeCards";
import bgimg2 from "../../images/bgimg2.jpg"; // Ensure the correct path to the image
import { Contact } from "./Contact";
import HomeNavbar from "../../components/home-navbar/HomeNavbar";
import Register from "../../components/register/Register";

const Home = () => {
  return (
    <div className="Home-container">
      <HomeNavbar />

      {/* Background Image Section */}
      <div className="image-container">
        <img src={homeBackground} alt="homebackground" className="img-fluid" />
        <div className="overlay-content container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6 text-center">
              <h1>#1 MATRIMONY</h1>
              <p>
                Find Your Right Match Here. Most Trusted Service in Tiruppur
                Matrimony Community, Founded by Tiruppur Mcommunity Trust.
              </p>
              <p>Your journey to connect hearts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Register Component */}
      <Register showHomeNavbar={false} />

      {/* HomeCards Section */}
      <HomeCards />

      {/* Information Section */}
      <div className="container-fluid mt-5">
        <div className="row text-center">
          {/* Left Column - Image */}
          <div className="col-12 col-md-6 mb-4">
            <img src={bgimg2} alt="bgimg" className="img-fluid rounded" />
          </div>

          {/* Right Column - Text */}
          <div className="col-12 col-md-6">
            <h1>Welcome to Tiruppur Matrimony</h1>
            <p>
              The Tiruppur Matrimony was founded in 1980 with the mission of
              serving society. With more than 700 elite members today, we
              continue to provide free matrimony services for the benefit of our
              community. Since Tiruppur Matrimony launched in 2023, we have
              matched over 50+ couples. Register up for free to discover your
              perfect companion.
            </p>
            <ul>
              <li>Free Registration</li>
              <li>Protected Profiles</li>
              <li>Hassle-Free Search</li>
              <li>Find Your Perfect Match</li>
            </ul>
          </div>
        </div>
      </div>
      <Contact />
    </div>
  );
};

export default Home;
