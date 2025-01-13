import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
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
});
const User = mongoose.model("User", UserSchema);
export default User;
