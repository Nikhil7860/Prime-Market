import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/Product";
import { initializeConnections } from "@/components/common/initializeConnections";
import { VerifyToken } from "@/services/auth.service";

export async function GET(request: NextRequest, { params }: { params: Promise<{ categoryName: string }> }) {
    try {

        await initializeConnections();

        const { categoryName } = await params;

        const products = await Product.find({
            categoryName: {
                $regex: new RegExp(`^${categoryName}$`, "i"), // Case-insensitive
            },
            isActive: true,
        });

        if (!products.length) {
            return NextResponse.json({ message: "No products found." }, { status: 404 });
        }

        return NextResponse.json(products, { status: 200 });
    } catch (error: any) {
        console.error(error);

        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}