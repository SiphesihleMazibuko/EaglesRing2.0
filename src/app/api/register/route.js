import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/user";

export async function POST(req) {
  try {
    const {
      fullName,
      email,
      userType,
      password,
      idnum,
      idType,
      mentorFullName,
      mentorEmail,
    } = await req.json();

    if (!fullName || !email || !userType || !password || !idnum || !idType) {
      return NextResponse.json({ message: "All required fields must be filled." }, { status: 400 });
    }

    if (idType === "ID" && !/^\d{13}$/.test(idnum)) {
      return NextResponse.json({ message: "ID Number must be exactly 13 digits." }, { status: 400 });
    }
    if (idType === "Passport" && !/^[a-zA-Z0-9]{5,10}$/.test(idnum)) {
      return NextResponse.json({ message: "Passport Number must be 5 to 10 alphanumeric characters." }, { status: 400 });
    }


    if (userType === "Investor") {
      if (!mentorFullName || !mentorEmail) {
        return NextResponse.json({ message: "Mentor information is required for investors." }, { status: 400 });
      }
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Email is already registered." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullName,
      email,
      userType,
      password: hashedPassword,
      idnum,
      idType,
      mentorFullName,
      mentorEmail,
    });

    return NextResponse.json({ message: "User Registered." }, { status: 201 });

  } catch (error) {
    console.error("Error during user registration:", error);
    return NextResponse.json({ message: "An error occurred while registering the user." }, { status: 500 });
  }
}
