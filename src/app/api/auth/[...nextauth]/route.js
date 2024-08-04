import NextAuth from "next-auth";
import authOptions from "@/lib/authOptions";

const handler = (req, res) => NextAuth(req, res, authOptions);

export { handler as GET, handler as POST };
