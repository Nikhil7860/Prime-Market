import { Schema, model, models } from "mongoose";

const categorySchema = new Schema(
    {
        categoryName: { type: String, required: true, unique: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
        description: { type: String, default: "", trim: true },
        image: { type: String, default: "" },
        parentCategory: { type: Schema.Types.ObjectId, ref: "Category", default: null },
        displayOrder: { type: Number, default: 0, },
        isFeatured: { type: Boolean, default: false, },
        status: { type: Boolean, default: false, },
        addedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        updatedBy: [{ user: { type: Schema.Types.ObjectId, ref: "User" }, updatedAt: { type: Date, default: Date.now } }],
    },
    { timestamps: true, versionKey: false, }
);

export default models.Category || model("Category", categorySchema);