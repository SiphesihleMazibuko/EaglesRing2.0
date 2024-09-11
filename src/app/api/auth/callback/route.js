import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/user';
import authOptions from '@/lib/authOptions';

export async function GET(req) {
  const session = await getServerSession({ req, ...authOptions });
  

  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  await dbConnect();
  const user = await User.findOne({ email: session.user.email });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const baseURL = process.env.NEXTAUTH_URL; 

  if (user.userType === 'Investor') {
    return NextResponse.redirect(`${baseURL}/projects`);
  } else if (user.userType === 'Entrepreneur') {
    return NextResponse.redirect(`${baseURL}/services`);
  } else {
    return NextResponse.redirect(`${baseURL}/services`);
  }
}
