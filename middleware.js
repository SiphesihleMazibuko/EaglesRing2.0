import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import dbConnect from '@/lib/mongodb';
import User from '@/models/user';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;
  const protectedRoutes = ['/services', '/chat', '/contact', '/aboutUs', '/profile'];

  const baseURL = process.env.NEXTAUTH_URL;

  if (!token && protectedRoutes.some(route => pathname.startsWith(route))) {
    const url = new URL('/signin', baseURL);
    return NextResponse.redirect(url);
  }

  if (token) {
    await dbConnect();
    const user = await User.findOne({ email: token.email });
    if (user) {
      req.userRole = user.userType;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/services', '/chat', '/contact', '/aboutUs', '/profile'],
};
