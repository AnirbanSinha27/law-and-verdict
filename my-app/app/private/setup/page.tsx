"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone } from "lucide-react";

export default function SetupPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    setLoading(true);

    const res = await fetch("/api/user/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });

    setLoading(false);

    if (res.ok) {
      document.querySelectorAll("[data-overlay], [role='dialog']").forEach(el => el.remove());
      document.body.style.overflow = "auto";
      router.replace("/private");
    }    
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 p-4">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 text-white shadow-xl">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10">
            <Phone className="h-8 w-8 text-blue-500" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-white">
            Complete Your Profile
          </CardTitle>
          <CardDescription className="text-base text-zinc-400">
            Add your phone number to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Input
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 h-11"
              placeholder="Enter Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={loading || !phone}
            className="cursor-pointer w-full h-11 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white disabled:bg-zinc-700 disabled:text-zinc-500"
          >
            {loading ? "Saving..." : "Save & Continue"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
