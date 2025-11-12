import { io } from "socket.io-client";

export const socket = io("/", { path: "/api/socket" });

// ✅ Add this
if (typeof window !== "undefined") {
  // Make it accessible for debugging
  (window as any).socket = socket;
}
