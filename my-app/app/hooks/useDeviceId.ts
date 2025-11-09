import { useEffect, useState } from "react";
import { getOrCreateDeviceId } from "@/devicelib/device";

export function useDeviceId() {
  const [deviceId, setDeviceId] = useState<string | null>(null);

  useEffect(() => {
    const id = getOrCreateDeviceId();
    setDeviceId(id);
  }, []);

  return deviceId;
}
