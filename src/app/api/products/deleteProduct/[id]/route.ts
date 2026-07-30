import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/Product";
import { initializeConnections } from "@/components/common/initializeConnections";
import { VerifyToken } from "@/services/auth.service";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {

     let tokenVerification: any = await VerifyToken(request.headers.get("authorization")?.split(" ")[1] as string)
        if (tokenVerification.success === false) return NextResponse.json(tokenVerification, { status: tokenVerification.statusCode })


        await initializeConnections();

        const { id } = await params;

        const product = await Product.findByIdAndDelete(id);;

        if (!product) return NextResponse.json({ message: "Product not found" }, { status: 404 })

        return NextResponse.json(product, { status: 200 });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ message: error.message, }, { status: 500, })
    }
}