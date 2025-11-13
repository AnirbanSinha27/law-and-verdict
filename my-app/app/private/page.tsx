"use client";

import { useUser } from "@auth0/nextjs-auth0/client"; 
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Phone, Smartphone, LogOut } from "lucide-react";
import DeviceModal from "../components/DeviceModal";

export default function PrivatePage() {
  const { user, error, isLoading } = useUser();
  const containerRef = useRef(null);

  const router = useRouter();
const [phone, setPhone] = useState(null);


// ✅ Fetch phone number
useEffect(() => {
  const loadPhone = async () => {
    const res = await fetch("/api/user/profile", { credentials: "include" });

    if (!res.ok) return;

    const data = await res.json();

    if (!data.phone) {
      router.push("/private/setup");
      return;
    }

    setPhone(data.phone);
  };

  loadPhone();
}, []);


  useEffect(() => {
    const clearDialogArtifacts = () => {
      document
        .querySelectorAll("[data-overlay], [data-radix-dialog-overlay], [role='dialog']")
        .forEach((el) => el.remove());
      document.body.style.removeProperty("overflow");
    };

    clearDialogArtifacts();

    return clearDialogArtifacts;
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <p className="text-white text-lg">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <p className="text-white text-lg">No user logged in.</p>
      </div>
    );
  }

  useEffect(() => {
    if (!window.socket) return;
  
    const handleForceLogout = () => {
      alert("You were logged out because your session was terminated from another device.");
      window.location.href = "/auth/logout";
    };
  
    window.socket.on("force_logout", handleForceLogout);
  
    return () => {
      if (window.socket) {
        window.socket.off("force_logout", handleForceLogout);
      }
    };
  }, []);
  

  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Welcome Header */}
        <div className="text-center space-y-2 py-8">
          <h1 className="text-4xl font-bold text-white">
            Welcome, {user.name}
          </h1>
          <p className="text-zinc-400 text-lg">
            Manage your profile and devices
          </p>
        </div>

        {/* Profile Card */}
        <Card className="bg-zinc-900 border-zinc-800 text-white shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
                <User className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <CardTitle className="text-2xl text-white">Your Profile</CardTitle>
                <CardDescription className="text-zinc-400">
                  Your account information
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                <User className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-zinc-400">Full Name</p>
                  <p className="text-white font-medium">{user.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                <Phone className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-zinc-400">Email</p>
                  <p className="text-white font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                <Phone className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-zinc-400">Phone Number</p>
                  <p className="text-white font-medium">{phone || "Not set"}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions Card */}
        <Card className="bg-zinc-900 border-zinc-800 text-white shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
                <Smartphone className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <CardTitle className="text-2xl text-white">Quick Actions</CardTitle>
                <CardDescription className="text-zinc-400">
                  Manage your account settings
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={() => window.dispatchEvent(new CustomEvent("open-device-modal"))}
              className="cursor-pointer w-full h-11 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Smartphone className="mr-2 h-5 w-5" />
              Manage Devices
            </Button>
            <Button
              onClick={() => window.location.href = "/auth/logout"}
              className="cursor-pointer w-full h-11 text-base font-medium bg-red-600 hover:bg-red-700 text-white"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
      <DeviceModal/>
    </div>
  );
}
