import mongoose, { Schema, Document } from "mongoose";

export interface ICarousel extends Document {
    title: string;
    subtitle?: string;
    image: string;
    buttonText?: string;
    buttonLink?: string;
    order: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const CarouselSchema = new Schema<ICarousel>({
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: "" },
    image: { type: String, required: true },
    buttonText: { type: String, default: "" },
    buttonLink: { type: String, default: "" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true, versionKey: false });

export default mongoose.models.Carousel || mongoose.model<ICarousel>("Carousel", CarouselSchema);