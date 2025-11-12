"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { useDeviceId } from "./hooks/useDeviceId";

export default function Home() {
  const containerRef = useRef(null);
  const deviceId = useDeviceId();

  useEffect(() => {
    gsap.from(containerRef.current, {
      opacity: 0,
      y: 40,
      duration: 0.6,
      ease: "power2.out",
    });
  }, []);

  const handleLogin = () => {
    if (!deviceId) return;
  
    // ✅ Save deviceId in a cookie (5 minutes expiry)
    document.cookie = `deviceId=${deviceId}; path=/; max-age=300;`;
  
    // ✅ Continue login
    window.location.href = `/auth/login?returnTo=/api/device/validate`;
  };
  

  return (
    <div ref={containerRef} className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-zinc-900 to-black">
      <h1 className="text-4xl font-bold text-white mb-4">
        Welcome to the App
      </h1>

      <p className="text-gray-300 mb-8">
        Login to access your dashboard.
      </p>

      <Button 
        onClick={handleLogin}
        disabled={!deviceId}
        className="px-6 py-3 text-lg"
      >
        Login
      </Button>
    </div>
  );
}
