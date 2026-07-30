import mongoose, { Schema, models, model } from "mongoose";

const couponUsageSchema = new mongoose.Schema({
    couponId: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon", required: true, },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", },
    discountAmount: { type: Number, required: true, },
}, { timestamps: true, versionKey: false });

export default models.CouponUsage || model("CouponUsage", couponUsageSchema);