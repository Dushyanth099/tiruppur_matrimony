import React, { useEffect, useState } from "react";
import RespondToInterest from "./RespondToInterest";
import "./Notification.css";
import { useNavigate } from "react-router-dom";
const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("User not logged in. Token is missing.");
        }

        const response = await fetch(
          "http://localhost:5000/api/auth/notifications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to fetch notifications."
          );
        }

        const data = await response.json();
        console.log("Fetched notifications:", data.notifications); // Debug log
        setNotifications(data.notifications || []); // Ensure the state is updated with notifications
      } catch (err) {
        console.error("Error fetching notifications:", err.message);
        setError(err.message);
      }
    };

    fetchNotifications();
  }, []);
  const handleInterestResponse = (status, notificationId) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notif) => notif._id !== notificationId)
    );
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
      <div>
        <h2>Notifications</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className="notification-item mb-3 p-3 border rounded"
            >
              {/* Handle different notification types */}
              {notification.type === "interest" ? (
                <>
                  <p>
                    <strong>
                      {notification.sender?.userEmail || "Unknown Sender"}
                    </strong>{" "}
                    wants to connect with you.
                  </p>
                  <RespondToInterest
                    interestId={notification._id}
                    onInterestResponse={(status) =>
                      handleInterestResponse(status, notification._id)
                    }
                  />
                </>
              ) : notification.type === "response" ? (
                <p>
                  <strong>
                    {notification.sender?.userEmail || "Unknown Sender"}
                  </strong>{" "}
                  {notification.message}
                </p>
              ) : (
                <p>Unknown notification type</p>
              )}
            </div>
          ))
        ) : (
          <p>No notifications available</p>
        )}
      </div>
    </>
  );
};
export default Notifications;
