import { NextRequest, NextResponse } from "next/server";
import Coupon from "@/models/coupon";
import { initializeConnections } from "@/components/common/initializeConnections";
import { VerifyToken } from "@/services/auth.service";
import { decodeToken } from "@/lib/jwt";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        let tokenVerification: any = await VerifyToken(request.headers.get("authorization")?.split(" ")[1] as string)
        if (tokenVerification.success === false) return NextResponse.json(tokenVerification, { status: tokenVerification.statusCode })
        let userRole = decodeToken(request.headers.get("authorization")?.split(" ")[1] as string)
        if (userRole?.role !== "user") return NextResponse.json({ message: "Not Admin", }, { status: 403 });

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