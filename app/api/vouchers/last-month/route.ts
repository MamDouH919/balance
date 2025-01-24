import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Vouchers from "@/models/Vouchers";

const getMonthRange = (offset: number = 0) => {
    const now = new Date();

    // Calculate the month and year with the offset
    const year = now.getFullYear();
    const month = now.getMonth() + offset;

    // Get the first and last days of the target month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    return {
        firstDay,
        lastDay,
    };
};

export async function GET(request: Request) {
    try {
        await dbConnect(); // Ensure the database connection is established

        const url = new URL(request.url);
        const month = url.searchParams.get("month") || "current";

        // Determine the range based on the `month` parameter
        const offset = month === "last" ? -1 : 0; // Offset for the last month
        const { firstDay, lastDay } = getMonthRange(offset);

        console.log(firstDay, lastDay)
        

        // Fetch aggregated data
        const data = await Vouchers.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: firstDay,
                        $lte: lastDay,
                    },
                },
            },
            {
                $group: {
                    _id: { $dayOfMonth: "$createdAt" }, // Group by day of the month
                    totalExpense: { $sum: "$expenseAmount" },
                    totalIncome: { $sum: "$incomeAmount" },
                },
            },
            {
                $project: {
                    day: "$_id", // Rename _id to day
                    totalExpense: 1,
                    totalIncome: 1,
                },
            },
            {
                $sort: { day: 1 }, // Sort by day
            },
        ]);


        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json(
            { error: "Error fetching data. Please try again later." },
            { status: 500 }
        );
    }
}
