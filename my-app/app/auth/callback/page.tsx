"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function AuthCallbackContent() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const deviceId = params?.get("deviceId");

    if (deviceId) {
      router.replace(`/api/device/validate?deviceId=${deviceId}`);
    }
  }, [params, router]);

  return <p>Signing you in...</p>;
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<p>Signing you in...</p>}>
      <AuthCallbackContent />
    </Suspense>
  );
}
