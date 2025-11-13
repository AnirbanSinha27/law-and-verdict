"use client";

import { useEffect } from "react";
import { socket } from "@/socketlib/socket";
import { useDeviceId } from "@/app/hooks/useDeviceId";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const deviceId = useDeviceId();

  // 🔗 Register socket with deviceId
  useEffect(() => {
    if (!deviceId) return;

    socket.emit("register_device", { deviceId });

  }, [deviceId]);


  // 🔴 Listen for forced logout
  useEffect(() => {
    const handler = (data: any) => {
      console.warn("🚨 Forced logout event received:", data);
      // Trigger Auth0 logout
      window.location.href = "/auth/logout";
    };

    socket.on("force_logout", handler);

    return () => {
      socket.off("force_logout", handler);
    };
  }, []);


  return <>{children}</>;
}
