import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/libauth/auth0";
import { connectToDatabase } from "@/dblib/mongodb";
import UserProfile from "@/dblib/models/UserProfile";

export async function GET() {
  await connectToDatabase();

  const session = await auth0.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = session.user.sub;
  const profile = await UserProfile.findOne({ userId });

  return NextResponse.json(profile || { phone: null });
}

export async function POST(request: NextRequest) {
  await connectToDatabase();

  const session = await auth0.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { phone } = await request.json();
  if (!phone) {
    return NextResponse.json({ error: "Phone required" }, { status: 400 });
  }

  const userId = session.user.sub;

  const profile = await UserProfile.findOneAndUpdate(
    { userId },
    { userId, phone },
    { upsert: true, new: true }
  );

  return NextResponse.json({ success: true, profile });
}
