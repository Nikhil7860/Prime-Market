import mongoose from "mongoose";
import { NextResponse } from "next/server";
import Orders from "@/models/Orders";
import { initializeConnections } from "@/components/common/initializeConnections";

export async function GET() {
    try {
        await initializeConnections();
        const OrdersResponse = await Orders.find();
        return NextResponse.json(OrdersResponse,{ status: 200 });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 400 });
    }
}