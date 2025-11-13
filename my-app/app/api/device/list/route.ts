import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/dblib/mongodb";
import UserDevice from "@/dblib/models/UserDevice";

export async function GET(request: NextRequest) {
  await connectToDatabase();
  const userId = request.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  const devices = await UserDevice.find({ userId });
  return NextResponse.json({ devices });
}
