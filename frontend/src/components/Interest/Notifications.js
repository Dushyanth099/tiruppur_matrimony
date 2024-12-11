import React, { useEffect, useState } from "react";
import socket from "./Socket";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      socket.emit("register", userId);

      socket.on("new-interest", (data) => {
        setNotifications((prev) => [...prev, data.message]);
      });

    socket.on("interest-response", (data) => {
      setNotifications((prev) => [...prev, data.message]);
    });

      return () => {
        socket.off("new-interest");
        socket.off("interest-response");
      };
    }
  }, [userId]);

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>{notification}</li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
