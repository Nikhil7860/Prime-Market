import mongoose, { Schema, models, model } from "mongoose";

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, trim: true, },

    description: { type: String, default: "", },

    discountType: { type: String, enum: ["percentage", "fixed"], required: true, },

    discountValue: { type: Number, required: true, },

    minOrderAmount: { type: Number, default: 0, },

    maxDiscountAmount: { type: Number, default: null, },

    usageLimit: { type: Number, default: 1, },

    usedCount: { type: Number, default: 0, },

    startDate: { type: Date, required: true, },

    endDate: { type: Date, required: true, },

    isActive: { type: Boolean, default: true, },

    applicableCategories: [{ type: String, },],

    applicableProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", },

}, {
    timestamps: true,
    versionKey: false
});

export default models.Coupon || model("Coupon", couponSchema);