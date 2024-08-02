import { NextResponse } from "next/server"

export async function POST(req) {
    try {
        const {fullName, email, userType, password, confirmPassword, avatarImage} = await req.json()

        console.log("Fullname:", fullName);
        console.log("Email:", email);
        console.log("UserType:", userType);
        console.log("Password:", password);
        console.log("Confirm Password:", confirmPassword);
        console.log("Avatar Image:", avatarImage);
        
        return NextResponse.json({message: "User Registered."},{status: 201})
    } catch(error){
        return NextResponse.json({ message: "An error occured while registering the user."},{status: 500})
    }
}