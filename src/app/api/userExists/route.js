import { NextResponse } from 'next/server';
import  connectToDatabase  from '@/lib/mongodb';
import User from '@/models/user';

export async function POST(req) {
  try {
    await connectToDatabase();
    const { email } = await req.json();
    const user = await User.findOne({ email }).select("_id");
    return NextResponse.json({ user });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Error connecting to the database" });
  }
}
