"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function DeviceModal() {
  const [open, setOpen] = useState(false);
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  // 🔗 Listen for event fired by “Manage Devices” button
  useEffect(() => {
    const openModal = () => setOpen(true);
    window.addEventListener("open-device-modal", openModal);
    return () => window.removeEventListener("open-device-modal", openModal);
  }, []);

  // 🧠 Load all devices from DB
  const loadDevices = async () => {
    if (!user) return;
    setLoading(true);
    const res = await fetch(`/api/device/list?userId=${user.sub}`);
    if (res.ok) {
      const data = await res.json();
      setDevices(data.devices || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (open) loadDevices();
  }, [open]);

  // ❌ Force logout one device
  const handleForceLogout = async (targetDeviceId: string) => {
    setLoading(true);
    const res = await fetch("/api/device/force-logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        targetDeviceId,
        newDeviceId: localStorage.getItem("deviceId") || "unknown-device",
        userId: user?.sub,
        userAgent: navigator.userAgent,
      }),
    });
    setLoading(false);
    if (res.ok) {
      alert("Device has been logged out.");
      await loadDevices();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-zinc-900 text-white border border-zinc-700 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Active Devices</DialogTitle>
        </DialogHeader>

        {loading ? (
          <p className="text-gray-400">Loading devices…</p>
        ) : devices.length === 0 ? (
          <p className="text-gray-400">No active devices.</p>
        ) : (
          <div className="space-y-3 mt-3">
            {devices.map((d) => (
              <div
                key={d.deviceId}
                className="flex items-center justify-between bg-zinc-800 rounded-lg p-3"
              >
                <div>
                  <p className="font-medium">{d.userAgent.slice(0, 40)}…</p>
                  <p className="text-xs text-gray-400">
                    Logged in: {new Date(d.createdAt).toLocaleString()}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleForceLogout(d.deviceId)}
                >
                  Force Logout
                </Button>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
