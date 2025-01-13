import mongoose from "mongoose";
const connection: { isConnected?: number } = {};

async function dbConnect() {
    if (connection.isConnected) {
        return;
    }
    
    const db = await mongoose.connect(process.env.MONGO_URI!)
        .then(() => console.log("connected"))
        .catch((err) => console.log(err))
    return db;
}

export default dbConnect