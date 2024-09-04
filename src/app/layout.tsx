import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/lib/UserContext";
import { AuthProvider } from "../components/Providers";
import Navbar from "./navbar/page";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Eagles Ring",
  description:
    "Aiding Entrepreneurs hone their skills into getting an investment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <AuthProvider>{children}</AuthProvider>
        </UserProvider>
      </body>
    </html>
  );
}
