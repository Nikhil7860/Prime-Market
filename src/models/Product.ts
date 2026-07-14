import mongoose, { Schema, models, model } from "mongoose";

const productSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },

        slug: { type: String, required: true, unique: true, lowercase: true, trim: true, },

        description: { type: String, required: true, },

        categoryName: { type: String, required: true, trim: true, },

        category: { type: Schema.Types.ObjectId, ref: "Category", required: true, },

        brand: { type: String, default: "", trim: true, },

        images: [{ image: { type: String, required: true, }, name: { type: String, required: true, }, },],

        price: { type: Number, required: true, min: 0, },

        discountPercentage: { type: Number, default: 0, min: 0, max: 100, },

        stock: { type: Number, required: true, min: 0, },

        rating: { type: Number, default: 0, min: 0, max: 5, },

        reviews: { type: Number, default: 0, },

        highlights: [{ type: String, },],

        specifications: { type: Map, of: String, default: {}, },

        isFeatured: { type: Boolean, default: false, },

        isActive: { type: Boolean, default: true, },

        addedBy: { type: Schema.Types.ObjectId, ref: "User", required: true, },

        updatedBy: [{ user: { type: Schema.Types.ObjectId, ref: "User", }, updatedAt: { type: Date, default: Date.now, }, },],
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default models.Product || model("Product", productSchema);