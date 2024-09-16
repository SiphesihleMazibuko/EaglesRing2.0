import dbConnect from "@/lib/mongodb";
import Pitch from "@/models/pitch";
import User from "@/models/user";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOptions";

export async function POST(req, res) {
  await dbConnect();

  try {
    const session = await getServerSession({ req, ...authOptions });

    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Log the incoming request body to verify project data
    const projectData = await req.json();
    console.log("Received Project Data:", projectData);

    const { companyName, projectIdea, businessPhase, image, video } = projectData;

    // Find user by session email
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create and save a new pitch
    const newPitch = new Pitch({
      entrepreneurId: user._id,
      companyName,
      projectIdea,
      businessPhase,
      projectImage: image,
      pitchVideo: video,
    });

    await newPitch.save();

    return res.status(200).json({ message: "Project posted successfully!" });
  } catch (error) {
    console.error("Error saving project:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}
