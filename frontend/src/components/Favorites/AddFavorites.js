import React, { useState ,useEffect} from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const AddFavorite = ({
  userId,
  initialFavoriteState = false,
  onToggleFavorite,
}) => {
  const [isFavorite, setIsFavorite] = useState(initialFavoriteState);
  const [error, setError] = useState(null);
  useEffect(() => {
    // Sync the `initialFavoriteState` if it changes
    setIsFavorite(initialFavoriteState);
  }, [initialFavoriteState]);

  const handleFavorite = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found, please log in.");
      return;
    }

    try {
      const response = await fetch(
        isFavorite
          ? "http://localhost:5000/api/user/removeFavorites"
          : "http://localhost:5000/api/user/addFavorites",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ favoriteId: userId }),
        }
      );
      if (response.ok) {
        setIsFavorite(!isFavorite);
        // Check if `onToggleFavorite` is a function before calling it
        if (typeof onToggleFavorite === "function") {
          onToggleFavorite(userId, !isFavorite); // Notify parent
        }
      } else {
        const data = await response.json();
        setError(data.message || "Failed to add to favorites.");
      }
    } catch (err) {
      console.error("Error adding to favorites:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <button
        className="btn p-0"
        onClick={handleFavorite}
        title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
      >
        {isFavorite ? <FaHeart color="red" /> : <FaRegHeart />}
      </button>
      {error && <div className="error">{error}</div>}
    </>
  );
};

export default AddFavorite;
