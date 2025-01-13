import mongoose, { Document, Schema } from "mongoose";

export interface ITransactions extends Document {
    title: string;
    description: string;
    amount: number;
    isActive: boolean;
}

const TransactionsSchema: Schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
});

const Transaction = mongoose.models?.Transactions || mongoose.model<ITransactions>("Transactions", TransactionsSchema);
// const User = mongoose.model<IUser>("User", UserSchema);

export default Transaction;