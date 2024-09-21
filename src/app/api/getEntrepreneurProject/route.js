import connectToDatabase from '@/lib/mongodb';
import Pitch from "@/models/pitch";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOptions";

export async function GET(req) {
  try {
    await connectToDatabase();
    const session = await getServerSession({ req, authOptions });

    if (!session) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    // Find the entrepreneur by session email
    const entrepreneur = await User.findOne({ email: session.user.email });

    if (!entrepreneur) {
      return new Response(JSON.stringify({ message: "Entrepreneur not found" }), { status: 404 });
    }

    // Find all pitches by the entrepreneur
    const pitches = await Pitch.find({ entrepreneurId: entrepreneur._id });

    return new Response(JSON.stringify(pitches), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching pitches:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch pitches" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
