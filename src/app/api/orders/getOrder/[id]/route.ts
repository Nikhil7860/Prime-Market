import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Orders from "@/models/Orders";
import { initializeConnections } from "@/components/common/initializeConnections";
import { verifyAccessToken } from "@/lib/jwt";
import { VerifyToken } from "@/services/auth.service";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        let tokenVerification: any = await VerifyToken(request.headers.get("authorization")?.split(" ")[1] as string)
        if (tokenVerification.success === false) return NextResponse.json(tokenVerification, { status: tokenVerification.statusCode })

        await initializeConnections();

        const { id } = await params;

        const orders = await Orders.find({
            user: new mongoose.Types.ObjectId(id),
        });

        if (!orders.length) {
            return NextResponse.json({ message: "No orders found." }, { status: 200 });
        }

        return NextResponse.json(orders, { status: 200 });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}