import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: "superAdmin" | "admin" | "user"; // Define role as a union type
    isActive: boolean;
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
            enum: ["superAdmin", "admin", "user"],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

UserSchema.virtual("vouchers", {
    ref: "Vouchers",
    localField: "_id",
    foreignField: "userId",
});

const User = mongoose.models?.User || mongoose.model<IUser>("User", UserSchema);

export default User;