import { hashPassword } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/Users";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    await dbConnect();

    try {
        console.log("Request URL:", req.url);

        // Extract query parameters for pagination
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);

        // Calculate skip value
        const skip = (page - 1) * limit;

        // Fetch users by type with pagination
        const users = await User.find({ role: "user" })
            .skip(skip)
            .limit(limit);

        // Get total count of users with type 'user'
        const totalUsers = await User.countDocuments({ role: "user" });

        // Prepare response with pagination data
        return NextResponse.json({
            users,
            pagination: {
                page,
                limit,
                totalUsers,
                totalPages: Math.ceil(totalUsers / limit),
            },
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const body = await req.json();
        const { name, email, password, active } = body;

        // Validate required fields
        if (!name || !email || !password || !email.includes("@")) {
            return NextResponse.json({
                ...(!email && { email: "البريد الإلكتروني مطلوب" }),
                ...(!email.includes("@") && { email: "البريد الإلكتروني غير صحيح" }),
                ...(!password && { password: "كلمة المرور مطلوبة" }),
                ...(!name && { name: "الاسم مطلوب" }),
            }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ email: "البريد الإلكتروني موجود بالفعل" }, { status: 409 });
        }

        // Create new user
        const newUser = await User.create({
            name,
            email,
            password: await hashPassword(body.password), // Ideally, hash the password before storing it
            role: "user",
            active,
            // createdAt: new Date(),
        });

        // Return the newly created user
        return NextResponse.json({ user: newUser }, { status: 201 });
    } catch (err: any) {
        console.error("Error creating user:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}