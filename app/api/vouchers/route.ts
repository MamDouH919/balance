import dbConnect from "@/lib/dbConnect";
import User from "@/models/Users";
import Vouchers from "@/models/Vouchers";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    await dbConnect();

    try {
        // Extract query parameters for pagination and filtering
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");
        const userId = searchParams.get("userId");

        // Construct filtering conditions
        const matchCondition: Record<string, any> = {
            ...(userId ? { userId: new mongoose.Types.ObjectId(userId) } : {}),
            ...(startDate && endDate
                ? {
                    createdAt: {
                        $gte: new Date(startDate), // Greater than or equal to startDate
                        $lte: new Date(endDate),   // Less than or equal to endDate
                    },
                }
                : startDate
                    ? { createdAt: { $gte: new Date(startDate) } } // Only from startDate
                    : endDate
                        ? { createdAt: { $lte: new Date(endDate) } } // Only until endDate
                        : {}),
        };

        // Calculate pagination values
        const skip = (page - 1) * limit;

        // Fetch vouchers with filtering, sorting, and pagination
        const vouchers = await Vouchers.find(matchCondition)
            .populate("userId", "name email") // Populate user details
            .sort({ createdAt: -1 }) // Sort by `createdAt` in descending order
            .skip(skip)
            .limit(limit);

        // Count total vouchers matching the filters
        const totalVouchers = await Vouchers.countDocuments(matchCondition);

        // Calculate total income and expense amounts using aggregation
        const totals = await Vouchers.aggregate([
            { $match: matchCondition }, // Apply the same filters
            {
                $group: {
                    _id: null,
                    totalExpenseAmount: { $sum: "$expenseAmount" },
                    totalIncomeAmount: { $sum: "$incomeAmount" },
                },
            },
        ]);

        // Prepare totals with default values if no documents are found
        const totalsObject = totals.length > 0
            ? {
                totalExpenseAmount: totals[0].totalExpenseAmount || 0,
                totalIncomeAmount: totals[0].totalIncomeAmount || 0,
            }
            : {
                totalExpenseAmount: 0,
                totalIncomeAmount: 0,
            };

        // Return the response with vouchers, pagination, and totals
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
        console.error("Error fetching vouchers:", err.message);
        return NextResponse.json(
            { error: "Failed to fetch vouchers. Please try again later." },
            { status: 500 }
        );
    }
}

const phoneNumberRegex = /^\d+$/

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

        const valid = phoneNumberRegex.test(amount)
        if (!valid) {
            return NextResponse.json({
                amount: "يجب ان يكون القيمة صحيحة"
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
            status: "approved"
            // createdAt: new Date(),
        });

        // Return the newly created user
        return NextResponse.json({ user: newUser }, { status: 201 });
    } catch (err: any) {
        console.error("Error creating user:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}