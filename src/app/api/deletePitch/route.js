import dbConnect from "@/lib/mongodb";
import Pitch from "@/models/pitch";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOptions";

export async function DELETE(req) {
  await dbConnect();
  
  try {
    const session = await getServerSession({ req, ...authOptions });

    if (!session) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    const entrepreneur = await User.findOne({ email: session.user.email });
    if (!entrepreneur) {
      return new Response(JSON.stringify({ message: "Entrepreneur not found" }), { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const pitchId = searchParams.get("pitchId");

    const pitch = await Pitch.findOne({ _id: pitchId, entrepreneurId: entrepreneur._id });

    if (!pitch) {
      return new Response(JSON.stringify({ message: "Pitch not found or not owned by entrepreneur" }), { status: 404 });
    }

    await Pitch.deleteOne({ _id: pitchId });

    return new Response(JSON.stringify({ message: "Pitch deleted successfully" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error deleting pitch:", error);
    return new Response(JSON.stringify({ error: "Failed to delete pitch" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
