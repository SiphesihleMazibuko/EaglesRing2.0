import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;


  const protectedRoutes = ['/services', '/chat', '/contact', '/aboutUs', '/profile'];

  if (!token && protectedRoutes.some(route => pathname.startsWith(route))) {
    const url = req.nextUrl.clone();
    url.pathname = '/signin';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/services', '/chat', '/contact', '/aboutUs', '/profile'],
};
