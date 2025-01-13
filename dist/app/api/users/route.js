import dbConnect from "@/lib/dbConnect";
import User from "@/models/Users";
import { NextResponse } from "next/server";
export default async function GET() {
    await dbConnect();
    try {
        const products = await User.find({});
        NextResponse.json(products);
    }
    catch (err) {
        NextResponse.json({ error: err.message });
    }
}
