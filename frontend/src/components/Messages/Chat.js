import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MessageSend from "./MessageSend";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode"; // Correct import
import axios from "axios";
import "./Chat.css";
import { useNavigate } from "react-router-dom";
const Chat = () => {
  const { userId } = useParams(); // Receiver's userId
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  console.log("Receiver userId from URL:", userId); // Debug log

  // Decode JWT to get the current user's ID
  const token = localStorage.getItem("token");
  let currentUserId = null;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      currentUserId = decodedToken.userId; // Adjust based on your JWT structure
    } catch (err) {
      console.error("Error decoding token:", err);
    }
  } else {
    console.error("Authorization token is missing");
  }

  // Initialize socket connection
  useEffect(() => {
    const socketInstance = io("http://localhost:5000");

    if (currentUserId) {
      // Join the user's personal room
      socketInstance.emit("joinUser", currentUserId);

      // Listen for new messages
      socketInstance.on("receiveMessage", (newMessage) => {
        console.log("New message received via socket:", newMessage);

        // Update the messages state
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
    }

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [currentUserId]);

  // Fetch messages on component load and when userId changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!userId) {
        console.error("Receiver ID (userId) is undefined!");
        return;
      }

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authorization token is missing");

        const response = await axios.get(
          `http://localhost:5000/api/user/messages/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Fetched messages:", response.data);
        setMessages(response.data);
      } catch (err) {
        console.error("Error fetching messages:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [userId]);

  // Render Loading State
  if (loading) {
    return (
      <div className="chat-container">
        <p>Loading chat...</p>
      </div>
    );
  }

  // Render Chat Interface
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
      <div className="chat-container">
        <h3>Chat with User {userId}</h3>
        <div className="message-box">
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <div
                key={index}
                className={`message ${
                  message.senderId === currentUserId ? "sent" : "received"
                }`}
              >
                <p>{message.message}</p>
                <span className="timestamp">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </span>
              </div>
            ))
          ) : (
            <p>No messages yet. Start the conversation!</p>
          )}
        </div>
        <MessageSend
          userId={userId} // Pass receiver's userId as a prop
          socket={socket}
          setMessages={setMessages}
          currentUserId={currentUserId} // Pass currentUserId as a prop
        />
      </div>
    </>
  );
};

export default Chat;
