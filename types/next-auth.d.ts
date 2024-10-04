// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      [x: string]: string;
      avatarImage: string;
      id: string;
      userType: string;
      email: string;
      name: string;
    };
  }

  interface JWT {
    accessToken?: string;
    id: string;
    userType: string;
    email: string;
    name: string;
  }
}
