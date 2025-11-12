"use client";

import { useEffect } from "react";
import { socket } from "@/socketlib/socket";
import { useDeviceId } from "@/app/hooks/useDeviceId";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const deviceId = useDeviceId();

  useEffect(() => {
    if (!deviceId) return;

    // ✅ Tell backend what device this socket belongs to
    socket.emit("register_device", { deviceId });

    console.log("📡 Sent register_device:", deviceId);
  }, [deviceId]);

  // ✅ Listen for force_logout event
  useEffect(() => {
    socket.on("force_logout", (data) => {
      alert(data.message || "You were logged out from another device.");
      window.location.href = "/auth/logout";
    });

    return () => {
      socket.off("force_logout");
    };
  }, []);

  useEffect(() => {
    socket.on("force_logout", () => {
      alert("You were logged out because another device replaced your session.");
      window.location.href = "/auth/logout";
    });
  
    return () => {
      socket.off("force_logout");
    };
  }, []);
  

  return <>{children}</>;
}
