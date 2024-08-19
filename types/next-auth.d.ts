// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
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
