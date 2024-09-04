import authOptions from "@/lib/authOptions";
import dbConnect from "@/lib/mongodb";
import Pitch from "@/models/pitch";
import User from "@/models/user";
import { getServerSession } from "next-auth";

export async function POST(req) {
  await dbConnect();
  const session = await getServerSession({req, ...authOptions});

  try {
    const { email, companyName, projectIdea, businessPhase, image, video } = await req.json();

    
    const user = await User.findOne({ email: session.user.email });


    if (!user) {
      return new Response(JSON.stringify({ message: "User not found." }), { status: 404 });
    }

    const newPitch = new Pitch({
      entrepreneurId: user._id,
      companyName,
      projectIdea,
      projectImage: image,
      pitchVideo: video,
      businessPhase,
    });

    await newPitch.save();

    return new Response(JSON.stringify({ message: "Project posted successfully!" }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Failed to post project.", error }), { status: 500 });
  }
}
