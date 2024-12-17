import React from "react";

const SendInterestButton = ({ receiverId }) => {
  const handleSendInterest = async () => {
    try {
      console.log("Sending interest to receiverId:", receiverId);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authorization token not found");
      }

      if (!receiverId) {
        console.error("receiverId is undefined in SendInterestButton.");
        throw new Error("Receiver ID is missing.");
      }
      console.log("Sending interest to receiverId:", receiverId);
      console.log("Authorization token:", token);
      console.log("Request body:", { receiverId: receiverId.toString() });
      const response = await fetch(
        `http://localhost:5000/api/auth/send-interest`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ receiverId }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to send interest.");
      }

      const result = await response.json();
      alert(result.message);
    } catch (err) {
      alert(`Error: ${err.message}`);
      console.error(err.message);
    }
  };

  if (!receiverId) {
    return <div>Error: Receiver ID is missing.</div>;
  }

  return (
    <button
      className="btn btn-outline-warning mb-3 mt-3"
      onClick={() => {
        handleSendInterest();
      }}
    >
      <i className="fas fa-heart me-2"></i>
      Add Interest
    </button>
  );
};

export default SendInterestButton;
