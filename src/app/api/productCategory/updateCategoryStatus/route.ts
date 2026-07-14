import { NextRequest, NextResponse } from "next/server";
import Category from "@/models/category";
import { initializeConnections } from "@/components/common/initializeConnections";
import mongoose from "mongoose";

export async function POST(request: Request) {
    try {
        await initializeConnections();

        const body = await request.json();

        const ProductResp = await Category.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(body.id) }, { $set: { status: body.status } });

        if (!ProductResp) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        return NextResponse.json(ProductResp, { status: 200 });
    } catch (error: any) {
        console.error(error);

        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}