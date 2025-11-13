'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDeviceId } from "./hooks/useDeviceId";
import { LogIn } from "lucide-react";

export default function Home(){
  const deviceId = useDeviceId();

  const handleLogin = () => {
    if (!deviceId) return;
  
    // Save deviceId in a cookie (5 minutes expiry)
    document.cookie = `deviceId=${deviceId}; path=/; max-age=300;`;
  
    // Continue login
    window.location.href = `/auth/login?returnTo=/api/device/validate`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 p-4">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 text-white shadow-xl">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10">
            <LogIn className="h-8 w-8 text-blue-500" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-white">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-base text-zinc-400">
            Sign in to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button 
            onClick={handleLogin}
            disabled={!deviceId}
            className="cursor-pointer w-full h-11 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white"
            size="lg"
          >
            <LogIn className="mr-2 h-5 w-5" />
            Sign In
          </Button>
          
          <p className="text-center text-sm text-zinc-500">
            Secure authentication powered by your device
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

