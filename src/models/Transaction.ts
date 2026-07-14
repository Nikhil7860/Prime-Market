import mongoose, { Schema } from "mongoose";

const transactionSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },
        type: { type: String, enum: ["deposit", "withdraw", "purchase", "refund",], required: true, },
        amount: { type: Number, required: true, },
        status: { type: String, enum: ["pending", "success", "failed",], default: "success", },
        description: String,
    },
    { timestamps: true, versionKey: false, }
);

export default mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);