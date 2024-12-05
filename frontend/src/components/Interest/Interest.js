import React from 'react'

const Interest = () => {
    const sendInterestRequest = async (toUserId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      "http://localhost:5000/api/send-interest",
      { toUser: toUserId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert(response.data.message);
  } catch (error) {
    alert(error.response?.data?.message || "Error sending interest.");
  }
};
  return (
    <div>Interest</div>
  )
}

export default Interest