import React from "react";

const RespondToInterest = ({ interestId, onInterestResponse }) => {
  const respondToInterest = async (status) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User not logged in. Token is missing.");
      }

      const response = await fetch(
        `http://localhost:5000/api/auth/respond-interest`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ interestId, response: status }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to respond to interest.");
      }
      // Optionally show a confirmation message
      const result = await response.json();
      alert(result.message); // e.g., "Interest accepted successfully."
      // Call the callback function to handle any additional state updates or logic
      onInterestResponse(status);
    } catch (err) {
      console.error("Error responding to interest:", err.message);
      alert(err.message);
    }
  };

  return (
    <>
      <button
        className="btn btn-success me-2"
        onClick={() => respondToInterest("accepted")}
      >
        Accept
      </button>
      <button
        className="btn btn-danger"
        onClick={() => respondToInterest("rejected")}
      >
        Reject
      </button>
    </>
  );
};

export default RespondToInterest;
