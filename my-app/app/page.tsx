"use client";

import { useDeviceId } from "@/app/hooks/useDeviceId";

export default function Home() {
  const deviceId = useDeviceId();

  const handleLogin = () => {
    if (!deviceId) return;

    // ✅ Send deviceId + returnTo
    document.cookie = `deviceId=${deviceId}; path=/; max-age=300;`;

    window.location.href = `/auth/login?returnTo=/api/device/validate`;
  };

  const handleLogout = () => {
    if (!deviceId) return;
    window.location.href = `/auth/logout?deviceId=${deviceId}`;
  };

  return (
    <div className="flex gap-4 p-4">
      <button
        onClick={handleLogin}
        disabled={!deviceId}
        className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
      >
        Login
      </button>

      <button
        onClick={handleLogout}
        disabled={!deviceId}
        className="bg-red-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
      >
        Logout
      </button>
    </div>
  );
}
