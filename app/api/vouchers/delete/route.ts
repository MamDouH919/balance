import dbConnect from "@/lib/dbConnect";
import User from "@/models/Users";
import Vouchers from "@/models/Vouchers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const body = await req.json();
        const { id, userId } = body;

        // Check if the user exists and has permission
        const user = await User.findById(userId);
        if (!user || user.role === "user") {
            return NextResponse.json(
                { custom: "لا يمكنك الحذف" },
                { status: 400 }
            );
        }

        // Validate that `id` is provided
        if (!id) {
            return NextResponse.json(
                { custom: "يجب توفير ال id" },
                { status: 400 }
            );
        }

        // Find and delete the voucher
        const voucher = await Vouchers.findById(id);
        if (!voucher) {
            return NextResponse.json(
                { custom: "القسيمة غير موجودة" },
                { status: 404 }
            );
        }

        await voucher.deleteOne();

        // Return a success response
        return NextResponse.json(
            { message: "تم الحذف بنجاح" },
            { status: 200 }
        );
    } catch (err: any) {
        console.error("Error deleting voucher:", err);
        return NextResponse.json(
            { error: "حدث خطأ أثناء الحذف" },
            { status: 500 }
        );
    }
}
