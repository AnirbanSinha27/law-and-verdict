import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/libauth/auth0";
import { connectToDatabase } from "@/dblib/mongodb";
import UserDevice from "@/dblib/models/UserDevice";

export async function GET(request: NextRequest) {
  await connectToDatabase();

  const session = await auth0.getSession();
  if (!session?.user) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const userId = session.user.sub;

  // ✅ Read deviceId from cookie
  const cookieDeviceId = request.cookies.get("deviceId")?.value;

  if (!cookieDeviceId) {
    return NextResponse.json({ error: "deviceId missing" }, { status: 400 });
  }

  const userAgent = request.headers.get("user-agent") || "Unknown Device";
  const devices = await UserDevice.find({ userId });

  // ✅ Allow login
  if (devices.length < 3) {
    await UserDevice.findOneAndUpdate(
      { userId, deviceId:cookieDeviceId },
      {
        userId,
        deviceId:cookieDeviceId,
        userAgent,
        lastSeen: new Date(),
      },
      { upsert: true, new: true }
    );
    

    // ✅ Delete cookie
    const response = NextResponse.redirect(new URL("/private", request.url));
    response.cookies.delete("deviceId");
    return response;
  }

  // ❌ Device limit reached
  return NextResponse.json(
    {
      status: "limit_reached",
      devices: devices.map(d => ({
        deviceId: d.deviceId,
        userAgent: d.userAgent,
        createdAt: d.createdAt,
      })),
    },
    { status: 403 }
  );
}
