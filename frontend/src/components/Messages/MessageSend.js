import React, { useState } from "react";
import axios from "axios";

const MessageSend = ({ userId, socket, setMessages, currentUserId }) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    const token = localStorage.getItem("token"); // Ensure token is stored properly

    if (!token) {
      console.error("Authorization token is missing");
      return;
    }
    console.log("Sending message to userId:", userId); // Debug log

    // Construct the message object
    const newMessage = {
      senderId: currentUserId,
      receiverId: userId,
      message: message.trim(),
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/send-message",
        newMessage,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Message sent:", response.data);
      setMessage(""); // Clear input
      // Emit message via socket to update the receiver's chat in real-time
      socket.emit("sendMessage", {
        senderId: currentUserId,
        receiverId: userId,
        message: message.trim(),
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="message-input">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        rows="3"
      />
      <button onClick={handleSendMessage} disabled={!message.trim()}>
        Send
      </button>
    </div>
  );
};

export default MessageSend;
