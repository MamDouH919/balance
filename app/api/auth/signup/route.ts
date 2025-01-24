import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { hashPassword } from '@/lib/auth';
import User from '@/models/Users';

// Handle POST requests
export async function POST(request: NextRequest) {
  try {
    const { email, password, ...data } = await request.json(); // Parse the body

    // Validate input
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { message: "Invalid input - password should also be at least 7 characters long." },
        { status: 422 }
      );
    }

    // Connect to the database
    await dbConnect();
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User exists already!" }, { status: 422 });
    }

    // Hash the password and save the user
    const hashedPassword = await hashPassword(password);

    const newUser = new User({
      email,
      password: hashedPassword,
      ...data
    });

    await newUser.save();

    return NextResponse.json({ message: "Created user!" }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
