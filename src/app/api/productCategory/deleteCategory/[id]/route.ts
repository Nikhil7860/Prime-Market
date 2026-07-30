import { NextRequest, NextResponse } from "next/server";
import Category from "@/models/category";
import { initializeConnections } from "@/components/common/initializeConnections";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await initializeConnections();

        const { id } = await params;

        const productCategory = await Category.findByIdAndDelete(id);;

        if (!productCategory) return NextResponse.json({ message: "productCategory not found" }, { status: 404 })

        return NextResponse.json(productCategory, { status: 200 });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ message: error.message, }, { status: 500, })
    }
}