
import Pitch from '@/models/pitch';
import User from '@/models/user';
import { getServerSession } from 'next-auth';
import authOptions from "@/lib/authOptions";
import dbConnect from "@/lib/mongodb";

export async function GET(req) {
    await dbConnect()
  const session = await getServerSession({ authOptions });

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized Access" }), {
      status: 401,
    });
  }

  try {
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    const entrepreneurId = user._id;

    const numberOfPitches = await Pitch.countDocuments({ entrepreneurId });

    // Return the data
    return new Response(JSON.stringify({ numberOfPitches }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: "Error fetching dashboard data" }),
      { status: 500 }
    );
  }
}
