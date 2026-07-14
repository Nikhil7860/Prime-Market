import mongoose, { Schema } from "mongoose";

const walletSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },

        balance: { type: Number, default: 0 },

        currency: { type: String, default: "INR" },
    },
    { timestamps: true, versionKey: false }
);

export default mongoose.models.Wallet || mongoose.model("Wallet", walletSchema);