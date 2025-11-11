"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function AuthCallbackPage() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const deviceId = params.get("deviceId");

    if (deviceId) {
      router.replace(`/api/device/validate?deviceId=${deviceId}`);
    }
  }, [params, router]);

  return <p>Signing you in...</p>;
}
