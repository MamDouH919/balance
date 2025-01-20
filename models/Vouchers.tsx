import mongoose, { Document, Schema } from "mongoose";

export interface IVouchers extends Document {
    type: "income" | "expense"; // income or expense
    title: string;
    description: string;
    expenseAmount: number;
    incomeAmount: number;
    userId: mongoose.Schema.Types.ObjectId;
    status: "pending" | "approved" | "rejected"; // track the status of admin approval
    createdAt: Date;
    updatedAt: Date;
}

const VouchersSchema: Schema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ["income", "expense"],
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    expenseAmount: {
        type: Number,
        required: true,
    },
    incomeAmount: {
        type: Number,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // assuming you have a User model
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "approved"],
        default: "approved", // initial status is pending until admin approves
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Vouchers = mongoose.models?.Vouchers || mongoose.model<IVouchers>("Vouchers", VouchersSchema);

export default Vouchers;
