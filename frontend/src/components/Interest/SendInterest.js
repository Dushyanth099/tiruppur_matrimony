import axios from "axios";
import socket from "./Socket";

const SendInterest = async (recipientId) => {
  const token = localStorage.getItem("token");
  const senderId = localStorage.getItem("userId");

  if (!token || !senderId || !recipientId) {
    alert("Required data missing. Please try again.");
    return;
  }

  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/send-interest",
      { recipientId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    // Log and alert success
    console.log("Interest sent successfully:", response.data);
    alert(response.data.message);

    socket.emit("send-interest", {
      senderId: localStorage.getItem("userId"),
      recipientId,
    });
  } catch (error) {
    console.error(
      "Error in SendInterest:",
      error.response?.data || error.message
    );
    alert(
      `Failed to send interest: ${
        error.response?.data?.message || error.message
      }`
    );
  }
};

export default SendInterest;
