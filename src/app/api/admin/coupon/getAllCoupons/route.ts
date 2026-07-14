import { NextResponse } from "next/server";
import Coupon from "@/models/coupon";
import { initializeConnections } from "@/components/common/initializeConnections";

export async function GET() {
    try {
        await initializeConnections();
        const Coupons = await Coupon.find();
        return NextResponse.json(Coupons,{ status: 200 });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 400 });
    }
}