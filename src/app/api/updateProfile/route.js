import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";

export async function POST(req, res) {
  if (req.method === 'POST') {
    try {
      const { email, id, company, tax, file } = await req.json();

      if (!email || !id || !company || !tax) {
        return new Response(JSON.stringify({ message: 'All fields are required' }), { status: 400 });
      }

      await connectMongoDB();

      const updatedUser = await User.findOneAndUpdate(
        { email },
        { id, company, tax, file },
        { new: true, upsert: true }
      );

      return new Response(JSON.stringify({ message: 'Profile updated successfully', user: updatedUser }), { status: 200 });
    } catch (error) {
      console.error("Internal server error:", error);
      return new Response(JSON.stringify({ message: 'Internal server error', error: error.message }), { status: 500 });
    }
  } else {
    return new Response(JSON.stringify({ message: 'Method not allowed' }), { status: 405 });
  }
}
