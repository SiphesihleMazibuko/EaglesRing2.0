import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import dbConnect from '@/lib/mongodb';
import User from '@/models/user';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    const url = new URL('/signin', req.url); 
    return NextResponse.redirect(url);
  }

  try {
    await dbConnect();
    const user = await User.findOne({ email: token.email });
    if (user) {
      const response = NextResponse.next();
      response.headers.set('x-user-role', user.userType); 
      return response;
    }
  } catch (error) {
    console.error('Database error:', error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/services', '/chat', '/contact', '/aboutUs', '/profile'], 
};
