import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Backend URL
socket.emit("joinUser", currentUserId);

export default socket;
