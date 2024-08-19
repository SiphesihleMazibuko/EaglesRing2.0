import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectMongoDB from "@/lib/mongodb";
import User from "@/models/user";

const authOptions = {
  debug: true, // Enable debug mode to log more detailed information
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials) {
            throw new Error("Credentials are missing");
          }

          const { email, password } = credentials;

          await connectMongoDB();

          const user = await User.findOne({ email });
          if (!user) {
            throw new Error("No user found with the provided email");
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (!passwordsMatch) {
            throw new Error("Password is incorrect");
          }

          

          // Add custom fields to the user object as needed
          return {
            email: user.email,
            name: user.fullName,
            userType: user.userType,
            id: user._id.toString(), // Convert ObjectId to string
          };
        } catch (error) {
          console.error("Error during authorization:", error.message, { email, credentials });
          throw new Error("Authorization failed. Please check your credentials and try again.");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // If the user is signing in for the first time, add custom fields to the token
      if (user) {
        token.id = user.id;
        token.userType = user.userType;
        token.email = user.email;
        token.name = user.name;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      // Attach custom fields from the token to the session object
      session.user.id = token.id;
      session.user.userType = token.userType;
      session.user.email = token.email;
      session.user.name = token.name;
      session.accessToken = token.accessToken;
      return session;
    },
  },
  session: {
    strategy: "jwt", // Use JWT-based sessions
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // Update the session every 24 hours
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60, // 30 days
    encryption: true, // Enable encryption for JWTs
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  pages: {
    signIn: "/signin", // Custom sign-in page route
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
