import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: "superAdmin" | "admin" | "user"; // Define role as a union type
    isActive: boolean;
    updatedAt: Date;
    createdAt: Date;
}

const UserSchema: Schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
            enum: ["superAdmin", "admin", "user"], // Use enum to restrict values
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true, // Automatically add and manage createdAt and updatedAt fields
    }
);

const User = mongoose.models?.User || mongoose.model<IUser>("User", UserSchema);
// const User = mongoose.model<IUser>("User", UserSchema);

export default User;
