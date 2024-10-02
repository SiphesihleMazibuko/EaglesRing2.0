import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/mongodb';
import User from '@/models/user';
import authOptions from '@/lib/authOptions'; // Ensure authOptions are correctly imported

export async function POST(req) {
  // Get session
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Get the user's ID from the session
  const userId = session.user.id; 

  const body = await req.json();
  const { email, fullName } = body;

  // Validate inputs
  if (!email || !fullName) {
    return NextResponse.json({ error: 'Email and Full Name are required' }, { status: 400 });
  }

  try {
    // Connect to MongoDB
    await dbConnect();

    // Update the user in the database
    const result = await User.findByIdAndUpdate(
      userId, 
      {
        $set: {
          email,
          fullName,
        },
      },
      { new: true }
    );

    if (result) {
      return NextResponse.json({ message: 'Profile updated successfully', user: result }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Profile update failed' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
