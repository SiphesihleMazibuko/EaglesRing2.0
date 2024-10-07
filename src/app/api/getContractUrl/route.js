import connectMongoDB from '@/lib/mongodb';
import Pitch from '@/models/pitch';
import User from '@/models/user';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await connectMongoDB();

    const user = await User.findOne({ email });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const pitch = await Pitch.findOne({ entrepreneurId: user._id });

    if (!pitch || !pitch.contractUrl) {
      return NextResponse.json({ error: 'No contract found for this user' }, { status: 404 });
    }

    return NextResponse.json({ contractUrl: pitch.contractUrl }, { status: 200 });

  } catch (error) {
    console.error('Error fetching contract URL:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
