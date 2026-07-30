import { NextResponse } from "next/server";
import Orders from "@/models/Orders";
import { initializeConnections } from "@/components/common/initializeConnections";
import { VerifyToken } from "@/services/auth.service";

export async function POST(request: Request) {
    try {
        let tokenVerification: any = await VerifyToken(request.headers.get("authorization")?.split(" ")[1] as string)
        if (tokenVerification.success === false) return NextResponse.json(tokenVerification, { status: tokenVerification.statusCode })

        await initializeConnections();

        const body = await request.json();

        const order = await Orders.findById(body.id);

        const updatedOrder = await Orders.findByIdAndUpdate(
            body.id,
            {
                status: body.status,
                $push: { updatedBy: { user: body.userId, previousStatus: order.status, currentStatus: body.status, remarks: body.remarks || "", updatedAt: new Date(), } },
            },
            { new: true, runValidators: true });

        if (!updatedOrder) {
            return NextResponse.json({ success: false, message: "Order not found", }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Order status updated successfully.", data: updatedOrder, }, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ success: false, message: err.message, }, { status: 500 });
    }
}