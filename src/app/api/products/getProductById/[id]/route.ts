import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/Product";
import { initializeConnections } from "@/components/common/initializeConnections";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await initializeConnections();

        const { id } = await params;

        const product = await Product.findById(id);

        if (!product) return NextResponse.json({ message: "Product not found" }, { status: 404 })

        return NextResponse.json(product, { status: 200 });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ message: error.message, }, { status: 500, })
    }
}