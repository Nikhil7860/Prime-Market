import mongoose from "mongoose";
import { NextResponse } from "next/server";
import Orders from "@/models/Orders";
import { initializeConnections } from "@/components/common/initializeConnections";

export async function POST(request: Request) {
    try {
        await initializeConnections();
        const body = await request.json();
        const OrdersResponse = await Orders.findByIdAndUpdate(body.id, { status: body.status }, { new: true, runValidators: true, });
        return NextResponse.json(OrdersResponse, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 400 });
    }
}