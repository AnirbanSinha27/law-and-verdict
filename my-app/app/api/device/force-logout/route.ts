import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/dblib/mongodb";
import UserDevice from "@/dblib/models/UserDevice";

export async function POST(request: NextRequest) {
  await connectToDatabase();

  const { targetDeviceId, newDeviceId, userId, userAgent } = await request.json();

  // 1. Remove the old device
  const removed = await UserDevice.findOneAndDelete({ deviceId: targetDeviceId });

  if (removed && removed.socketId) {
    const io = (global as any).io;

    if (removed?.socketId && io) {
      io.to(removed.socketId).emit("force_logout", {
        message: "You were logged out because another device replaced this session."
      });
    
      console.log("🔴 force_logout sent to:", removed.socketId);
    }    
  }

  // 2. Insert the new device
  await UserDevice.findOneAndUpdate(
    { deviceId: newDeviceId },
    {
      userId,
      deviceId: newDeviceId,
      userAgent,
      createdAt: new Date(),
      lastSeen: new Date(),
    },
    { upsert: true }
  );

  return NextResponse.json({ status: "success" });
}
