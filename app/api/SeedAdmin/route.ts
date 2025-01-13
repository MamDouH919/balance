// pages/api/seed.js
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/Users";
import bcrypt from 'bcryptjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests allowed' });
    }

    try {
        console.log("sdkfnsd");

        await dbConnect();

        // Seed data
        const users = [
            {
                username: 'super admin',
                email: 'superadmin@admin.com',
                password: await bcrypt.hash("Mamdouh123!!!", 10), // This will be hashed
                role: 'superAdmin',
            },
            {
                username: 'admin',
                email: 'admin@admin.com',
                password: await bcrypt.hash("admin123!!!", 10), // This will be hashed
                role: 'admin',
            },
        ];

        // Delete existing users (optional)
        await User.deleteMany({});

        // Insert new users
        await User.insertMany(users);

        res.status(200).json({ message: 'Seed data inserted successfully!' });
    } catch (error) {
        console.log('Error seeding data:', error);
        res.status(500).json({ message: 'Error seeding data' });
    }
};

export default handler;