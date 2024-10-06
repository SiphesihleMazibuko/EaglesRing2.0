import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOptions";
import dbConnect from "@/lib/mongodb";
import Pitch from "@/models/pitch";
import { NextResponse } from "next/server";
import User from "@/models/user"; 

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    console.log("GET request received");

    const session = await getServerSession(authOptions);

    if (!session) {
      console.log("Unauthorized access attempt");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      console.log("User not found");
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const entrepreneurId = user._id;

    console.log("Fetching projects for entrepreneurId:", entrepreneurId);
    const userPitches = await Pitch.find({ entrepreneurId });

    console.log("User projects fetched:", userPitches);
    return NextResponse.json(userPitches, { status: 200 });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { message: "Error fetching projects", error },
      { status: 500 }
    );
  }
}
