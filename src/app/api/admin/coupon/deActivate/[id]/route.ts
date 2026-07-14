import { NextRequest, NextResponse } from "next/server";
import Coupon from "@/models/coupon";
import { initializeConnections } from "@/components/common/initializeConnections";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await initializeConnections();

        const { id } = await params;

        const coupon = await Coupon.findById(id);

        if (!coupon) {
            return NextResponse.json({ message: "coupon not found" }, { status: 404 });
        }

        coupon.isActive = coupon.isActive === false ? true : false;

        await coupon.save();

        return NextResponse.json(coupon, { status: 200 });
    } catch (error: any) {
        console.error(error);

        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}