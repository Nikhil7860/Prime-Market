import mongoose, { Schema, models, model } from "mongoose";

const permissionSchema = new Schema({
    module: { type: Schema.Types.ObjectId, ref: "Module", required: true, },
    moduleName: { type: String, required: true, },
    canView: { type: Boolean, default: false, },
    canCreate: { type: Boolean, default: false, },
    canEdit: { type: Boolean, default: false, },
    canDelete: { type: Boolean, default: false, },
}, { _id: true, });

const roleSchema = new Schema({
    roleName: { type: String, required: true, trim: true, unique: true, },
    description: { type: String, default: "", trim: true, },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active", },
    permissions: [permissionSchema],
}, { timestamps: true, versionKey: false, });

export default models.Role || model("Role", roleSchema);