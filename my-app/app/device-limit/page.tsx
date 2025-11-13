"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type DeviceInfo = {
  deviceId: string;
  userAgent: string;
  createdAt: string;
};

function DeviceLimitContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const userId = searchParams?.get("userId") ?? null;

  useEffect(() => {
    const fetchDevices = async () => {
      if (!userId) return;
      const res = await fetch(`/api/device/list?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setDevices(data.devices || []);
      }
    };
    fetchDevices();
  }, [userId]);

  const handleForceLogout = async (targetDeviceId: string) => {
    const deviceId = localStorage.getItem("deviceId");
    if (!deviceId || !userId) return;

    const res = await fetch("/api/device/force-logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        targetDeviceId,
        newDeviceId: deviceId,
        userId,
        userAgent: navigator.userAgent,
      }),
    });

    if (res.ok) {
      alert("Device replaced successfully.");
      router.push("/private");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-900 text-white">
      <div className="bg-zinc-800 p-8 rounded-xl w-[400px] text-center">
        <h1 className="text-2xl font-bold mb-4">Device Limit Reached</h1>
        <p className="text-gray-400 mb-6">
          You have already logged in on 3 devices.
          Choose one device to logout and continue:
        </p>

        <div className="space-y-4 text-left">
          {devices.map((d) => (
            <div
              key={d.deviceId}
              className="flex items-center justify-between bg-zinc-700 rounded-lg p-3"
            >
              <div>
                <p className="text-sm font-semibold">{d.userAgent.slice(0, 45)}…</p>
                <p className="text-xs text-gray-400">
                  {new Date(d.createdAt).toLocaleString()}
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleForceLogout(d.deviceId)}
              >
                Logout
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DeviceLimitPage() {
  return (
    <Suspense fallback={<p className="text-white p-8">Loading device details…</p>}>
      <DeviceLimitContent />
    </Suspense>
  );
}
