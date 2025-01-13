import { hashPassword } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/Users";
async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }
    const { email, password } = req.body;
    // Validate input
    if (!email || !email.includes("@") || !password || password.trim().length < 7) {
        return res.status(422).json({
            message: "Invalid input - password should also be at least 7 characters long.",
        });
    }
    // Connect to the database
    await dbConnect();
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(422).json({ message: "User exists already!" });
        }
        // Hash the password and save the user
        const hashedPassword = await hashPassword(password);
        const newUser = new User({
            email,
            password: hashedPassword,
        });
        await newUser.save();
        return res.status(201).json({ message: "Created user!" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export default handler;
