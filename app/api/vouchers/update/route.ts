import dbConnect from "@/lib/dbConnect";
import User from "@/models/Users";
import Vouchers from "@/models/Vouchers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const body = await req.json();
        const { reason, status, id, userId } = body;

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json(
                { custom: "لا يمكنك الحذف" },
                { status: 400 }
            );
        }

        // Validate required fields
        if (status === "pending" && !reason) {
            return NextResponse.json(
                { reason: "السبب مطلوب" },
                { status: 400 }
            );
        }

        if (!id) {
            return NextResponse.json(
                { custom: "يجب توفير ال id" },
                { status: 400 }
            );
        }

        // Update the voucher
        const updatedVoucher = await Vouchers.findByIdAndUpdate(
            id,
            {
                $set: {
                    status: status,
                    reason: reason, // Properly include the `reason` field in the `$set` operation
                },
            },
            { new: true } // Return the updated document
        );

        if (!updatedVoucher) {
            return NextResponse.json(
                { custom: "لم يتم العثور على القسيمة" },
                { status: 404 }
            );
        }

        // Return the updated voucher
        return NextResponse.json({ voucher: updatedVoucher }, { status: 201 });
    } catch (err: any) {
        console.error("Error updating voucher:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
