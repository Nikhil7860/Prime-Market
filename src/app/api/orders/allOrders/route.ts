import mongoose from "mongoose";
import { NextResponse } from "next/server";
import Orders from "@/models/Orders";
import { initializeConnections } from "@/components/common/initializeConnections";
import { VerifyToken } from "@/services/auth.service";
import { decodeToken } from "@/lib/jwt";

export async function GET(request: Request) {
    try {
        let tokenVerification: any = await VerifyToken(request.headers.get("authorization")?.split(" ")[1] as string)
        if (tokenVerification.success === false) return NextResponse.json(tokenVerification, { status: tokenVerification.statusCode })
        let userRole = decodeToken(request.headers.get("authorization")?.split(" ")[1] as string)
        console.log(userRole, "In the userRole")
        if (userRole?.role === "user") return NextResponse.json({ message: "Not Admin", }, { status: 403 });
        await initializeConnections();
        const OrdersResponse = await Orders.find();
        return NextResponse.json(OrdersResponse, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 400 });
    }
}