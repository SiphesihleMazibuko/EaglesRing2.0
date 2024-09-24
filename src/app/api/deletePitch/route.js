import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOptions";
import dbConnect from "@/lib/mongodb";
import Pitch from "@/models/pitch";
import { NextResponse } from "next/server"; // Import NextResponse for response handling

// Named export for the DELETE method
export async function DELETE(req) {
  try {
    console.log("DELETE request received");

    // Use getServerSession and pass the authOptions correctly
    const session = await getServerSession(authOptions);

    if (!session) {
      console.log("Unauthorized access attempt");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { pitchId } = await req.json();
    console.log("Pitch ID to be deleted:", pitchId);

    await dbConnect();
    const entrepreneurId = session.user.id; // Assuming you have user ID in session

    console.log("Checking ownership for entrepreneurId:", entrepreneurId);
    const pitch = await Pitch.findOne({ _id: pitchId, entrepreneurId });

    if (!pitch) {
      console.log("Pitch not found or unauthorized delete attempt");
      return NextResponse.json({ message: "Pitch not found" }, { status: 404 });
    }

    await Pitch.findByIdAndDelete(pitchId);
    console.log("Pitch deleted:", pitchId);

    return NextResponse.json({ message: "Pitch deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting pitch:", error);
    return NextResponse.json({ message: "Error deleting pitch" }, { status: 500 });
  }
}
