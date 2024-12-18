import React, { useState, useEffect } from "react";
import axios from "axios";
import socket from "./Socket";
import handleMessage from "./SendMessages"; // Import the handleMessage function

const Chat = ({ userId, selectedUserId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Join chat room
    const room = [userId, selectedUserId].sort().join("-");
    socket.emit("joinRoom", room);

    // Fetch chat history
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("User not logged in.");
        }
        const response = await axios.get(
          `http://localhost:5000/api/user/chat/${userId}/${selectedUserId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMessages(response.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();

    // Listen for new messages
    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [userId, selectedUserId]);

  // Call handleMessage function to send a message
  const handleSendMessage = handleMessage(
    userId,
    selectedUserId,
    newMessage,
    setMessages,
    setNewMessage
  );

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message ${msg.sender === userId ? "sent" : "received"}`}
          >
            <p>{msg.content}</p>
            <span className="timestamp">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>

      <div className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
