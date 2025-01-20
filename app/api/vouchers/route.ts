import dbConnect from "@/lib/dbConnect";
import User from "@/models/Users";
import Vouchers from "@/models/Vouchers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    await dbConnect();

    try {
        console.log("Request URL:", req.url);

        // Extract query parameters for pagination
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);
        const status = parseInt(searchParams.get("status") || "");

        // Calculate skip value
        const skip = (page - 1) * limit;

        // Fetch users by type with pagination
        const vouchers = await Vouchers.find(({
            ...(status && { status: status })
        }))
            .populate("userId", "name email")
            .skip(skip)
            .limit(limit)



        // Get total count of users with type 'user'
        const totalVouchers = await Vouchers.countDocuments();


        // Aggregate to calculate total incomeAmount and expenseAmount
        const totals = await Vouchers.aggregate([
            {
                $match: {
                    ...(status && { status: status }), // Filter based on status if provided
                },
            },
            {
                $group: {
                    _id: null, // Group everything together
                    totalExpenseAmount: { $sum: "$expenseAmount" }, // Sum all expense amounts
                    totalIncomeAmount: { $sum: "$incomeAmount" },   // Sum all income amounts
                },
            },
        ]);

        // Default to 0 if no matching documents
        const totalsObject = totals.length > 0 ? {
            totalExpenseAmount: totals[0].totalExpenseAmount || 0,
            totalIncomeAmount: totals[0].totalIncomeAmount || 0,
        } : {
            totalExpenseAmount: 0,
            totalIncomeAmount: 0,
        };

        return NextResponse.json({
            vouchers,
            pagination: {
                page,
                limit,
                totalVouchers,
                totalPages: Math.ceil(totalVouchers / limit),
            },
            totals: totalsObject,
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const body = await req.json();
        const { title, amount, description, type, userId } = body;

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({
                custom: "لا يمكنك إنشاء قيد"
            }, { status: 400 });
        }

        // Validate required fields
        if (!title || !amount || !description || !type) {
            return NextResponse.json({
                ...(!title && { title: "العنوان مطلوب" }),
                ...(!amount && { amount: "القيمة مطلوبة" }),
                ...(!description && { name: "الاسم مطلوب" }),
                ...(!type && { type: "النوع مطلوب" }),
            }, { status: 400 });
        }

        if (!["income", "expense"].includes(type)) {
            return NextResponse.json({
                type: "النوع غير معروف"
            }, { status: 400 });
        }

        // Check if user already exists

        // Create new user
        const newUser = await Vouchers.create({
            title,
            expenseAmount: type === "expense" ? amount : 0,
            incomeAmount: type === "income" ? amount : 0,
            description,
            type,
            userId,
            status: "pending"
            // createdAt: new Date(),
        });

        // Return the newly created user
        return NextResponse.json({ user: newUser }, { status: 201 });
    } catch (err: any) {
        console.error("Error creating user:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}