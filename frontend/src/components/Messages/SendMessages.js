import axios from "axios";
import socket from "./Socket"; // assuming the socket is already created and exported from Socket.js

const handleMessage = (
  userId,
  selectedUserId,
  newMessage,
  setMessages,
  setNewMessage
) => {
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not logged in.");

      // Send message via axios
      await axios.post(
        `http://localhost:5000/api/user/chat`,
        { sender: userId, receiver: selectedUserId, message: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Emit via Socket.IO
      socket.emit("sendMessage", {
        senderId: userId,
        receiverId: selectedUserId,
        message: newMessage,
      });

      // Add to local state for instant UI update
      setMessages((prev) => [
        ...prev,
        { sender: userId, message: newMessage, timestamp: new Date() },
      ]);

      setNewMessage(""); // Clear the input field after sending
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return handleSendMessage;
};

export default handleMessage;
