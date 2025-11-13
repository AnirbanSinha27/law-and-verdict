"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useEffect, useRef,useState } from "react";
import { Button } from "@/components/ui/button";
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
    gsap.from(containerRef.current, {
      opacity: 0,
      y: 40,
      duration: 0.6,
      ease: "power2.out",
    });
  }, []);

  if (isLoading) return <p className="text-white p-8">Loading...</p>;
  if (!user) return <p className="text-white p-8">No user logged in.</p>;

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-linear-to-br from-zinc-900 to-black text-white p-8"
    >
      <div className="max-w-3xl mx-auto">

        <h1 className="text-4xl font-bold mb-6">
          Welcome, {user.name}
        </h1>


        {/* Profile Card */}
        <div className="bg-zinc-800/60 backdrop-blur-xl p-6 rounded-xl mb-6 border border-white/10">
          <h2 className="text-2xl font-semibold mb-4">Your Profile</h2>

          <div className="space-y-3">
            <p className="text-gray-300">
              <span className="font-semibold text-white">Full Name:</span> {user.name}
            </p>

            <p className="text-gray-300">
              <span className="font-semibold text-white">Email:</span> {user.email}
            </p>

            <p className="text-gray-300">
              <span className="font-semibold text-white">Phone:</span> {phone}
            </p>

          </div>
        </div>
        <div>
        <Button
          onClick={() => window.dispatchEvent(new CustomEvent("open-device-modal"))}
          className="px-6 py-3 text-lg"
        >
          Manage Devices
        </Button>
        <Button
          onClick={() => window.location.href = "/auth/logout"}
          className="mt-4 bg-red-600 hover:bg-red-800"
        >
          Logout
        </Button>
        </div>
      </div>
      <DeviceModal/>
    </div>
  );
}
