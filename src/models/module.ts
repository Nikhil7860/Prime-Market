import mongoose, { Schema, models, model } from "mongoose";

const moduleSchema = new Schema({
    moduleName: { type: String, required: true, unique: true, trim: true, },
    route: { type: String, required: true, unique: true, trim: true, },
    icon: { type: String, default: "No Icon", trim: true, },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active", },
}, { timestamps: true, versionKey: false, });


export default models.Module || model("Module", moduleSchema);

