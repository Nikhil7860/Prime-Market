import mongoose, { Schema, models, model } from "mongoose";

const orderSchema = new Schema(
    {
        /* ==========================
           User Details Snapshot
        ========================== */

        user: { type: Schema.Types.ObjectId, ref: "User", required: true, },
        userDetails: {
            name: { type: String, required: true, trim: true, },
            email: { type: String, required: true, trim: true, },
            phone: { type: String, required: true, },
            address: { type: String, default: "", },
        },
        /* =========================
               Ordered Products
        ========================== */
        products: [
            {
                product: { type: Schema.Types.ObjectId, ref: "Product", required: true, },
                productName: { type: String, required: true, },
                image: { type: String, default: "", },
                quantity: { type: Number, required: true, min: 1, },
                price: { type: Number, required: true, },
                total: { type: Number, required: true, },
            },
        ],

        /*  ==========================
                Payment
            ========================== */

        paymentStatus: { type: String, enum: ["pending", "Paid", "failed"], default: "pending" },
        transactionId: { type: String, default: "", trim: true, },
        paymentMethod: { type: String, enum: ["COD", "UPI", "Card", "NetBanking", "Wallet"], default: "COD", },
        gateway: { type: String, default: "", },
        currency: { type: String, default: "INR", },

        /*  ==========================
                Coupon
            ========================== */

        couponCode: { type: String, default: "" },
        discount: { type: Number, default: 0, min: 0 },

        /* ==========================
           Pricing
        ========================== */

        amount: { type: Number, required: true },

        /*  ==========================
               Order Status
            ========================== */

        status: {
            type: String,
            enum: ["pending", "processing", "confirmed", "shipped", "delivered", "cancelled", "returned", "refunded"],
            default: "pending",
        },


        /*  ==========================
                Audit
            ========================== */

        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        updatedBy: [
            {
                user: { type: Schema.Types.ObjectId, ref: "User", },
                updatedAt: { type: Date, default: Date.now, },
            },
        ]
    },
    { timestamps: true, versionKey: false, }
);

export default models.Order || model("Order", orderSchema);