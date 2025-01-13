import { hashPassword } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/Users";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const body = await req.json();

        const { id, name, email } = body;

        if (!name || !email || !email.includes("@")) {
            return NextResponse.json({
                ...(!email && { email: "البريد الإلكتروني مطلوب" }),
                ...(!name && { name: "الاسم مطلوب" }),
            }, { status: 400 });
        }

        if (email) {
            const existingEmailUser = await User.findOne({ email: body.email, _id: { $ne: id } });
            if (existingEmailUser) {
                return NextResponse.json({ email: "البريد الإلكتروني موجود بالفعل" }, { status: 409 });
            }
        }

        if (!id) {
            return NextResponse.json({ custom: 'يجب توفير ال id' }, { status: 400 });
        }

        const updatedFields: Record<string, any> = {};
        if (body.email) updatedFields.email = body.email;
        if (body.name) updatedFields.name = body.name;
        if (body.name) updatedFields.isActive = body.isActive;
        if (body.password) updatedFields.password = await hashPassword(body.password);

        updatedFields.updatedAt = new Date()

        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                $set: {
                    ...updatedFields, // Spread the provided fields to update
                    // updatedAt: new Date(), // Manually set the updatedAt field
                },
            },
        );

        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found.' }, { status: 404 });
        }

        return NextResponse.json({ user: updatedUser }, { status: 200 });
    } catch (err: any) {
        console.error("Error creating user:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
