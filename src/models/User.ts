import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    name: { type: String, required: [true, "Name is required"] },
    phone: { type: Number, required: [true, "Phone number is required"] },
    email: { type: String, required: [true, "Email is required"] },
    password: { type: String, required: [true, "Password is required"] },
    role: { type: String, default: "user", },
    status: { type: String, enum: ["Active", "Inactive", "Blocked"], default: "Active" },
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: "Role" }
}, { timestamps: true, versionKey: false });

export default mongoose.models.User || mongoose.model("User", UserSchema);