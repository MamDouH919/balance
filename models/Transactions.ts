import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./Users";

// User interface (assuming it's in another file and already implemented)

export interface ITransactions extends Document {
    title: string;
    description: string;
    amount: number;
    isActive: boolean;
    user: mongoose.Types.ObjectId | IUser; // Reference to the User model
}

const TransactionsSchema: Schema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        typeOfTransaction: {
            type: String,
            required: true,
            enum: ["debit", "credit"],
        },
        amount: {
            type: Number,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId, // Reference to the User model
            ref: "User", // Model name of the User
            required: true, // Make it required if every transaction must have an associated user
        },
    },
    {
        timestamps: true, // Add createdAt and updatedAt fields
    }
);

const Transaction = mongoose.models?.Transactions || mongoose.model<ITransactions>("Transactions", TransactionsSchema);

export default Transaction;
