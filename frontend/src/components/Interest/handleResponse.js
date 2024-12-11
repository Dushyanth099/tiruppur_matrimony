const handleResponse = async (interestId, action) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/handle-interest",
      { interestId, action },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    alert(response.data.message);
  } catch (error) {
    console.error(error);
    alert("Failed to handle interest.");
  }
};
export default handleResponse;
