import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  reconnectionAttempts: 5,
  timeout: 5000,
});

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);

  const userId = localStorage.getItem("userId");
  if (userId) {
    socket.emit("register", userId);
    console.log(`User ${userId} registered with socket.`);
  }
});

export default socket;
