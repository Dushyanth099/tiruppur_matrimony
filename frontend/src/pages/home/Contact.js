import React from "react";
import "./Contact.css"

export const Contact = () => {
  return (
    <>
      {/* Statistics Section */}
      <div className="container-fluid mt-5">
        <div className="row text-center">
          {/* Stat 1 */}
          <div className="col-12 col-md-3 mb-4">
            <div className="stat-box">
              <h2 className="stat-number">50+</h2>
              <p className="stat-label">Couples Paired</p>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="col-12 col-md-3 mb-4">
            <div className="stat-box">
              <h2 className="stat-number">1500+</h2>
              <p className="stat-label">Registrations</p>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="col-12 col-md-3 mb-4">
            <div className="stat-box">
              <h2 className="stat-number">1000+</h2>
              <p className="stat-label">Men</p>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="col-12 col-md-3 mb-4">
            <div className="stat-box">
              <h2 className="stat-number">500+</h2>
              <p className="stat-label">Women</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="container-fluid mt-5">
        <div className="row text-center">
          {/* Contact Header */}
          <div className="col-12">
            <h2>We are here to assist you.</h2>
            <h3>Contact us</h3>
            <p>
              Most Trusted and Free Matrimony Service in Kongu Vellalar Gounder
              community.
            </p>
          </div>

          {/* Office Information */}
          <div className="col-12 col-md-6 mt-4">
            <h4>Our Office</h4>
            <p>
              <strong>We are Available at:</strong>
              <br />
              +91 90425 58784
              <br />
              info@dheeranmatrimony.com
              <br />
              8/606, Angeripalayam Main Road, Gandhinagar, Tirupur-641603
            </p>
          </div>

          {/* Customer Relations */}
          <div className="col-12 col-md-6 mt-4">
            <h4>Customer Relations</h4>
            <p>
              Most Trusted and Free Matrimony Service in Kongu Vellalar Gounder
              community.
            </p>
            <h5>Get Support</h5>
            <p>WhatsApp Support</p>
          </div>

          {/* Footer Section */}
          <div className="col-12 mt-4">
            <h3>Contact Us</h3>
            <p>
              We are always happy to help you. Reach out to us anytime for
              queries and support!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
