import { NextRequest, NextResponse } from "next/server";
import Coupon from "@/models/coupon";
import { initializeConnections } from "@/components/common/initializeConnections";
import { VerifyToken } from "@/services/auth.service";
import { decodeToken } from "@/lib/jwt";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    try {
        let tokenVerification: any = await VerifyToken(request.headers.get("authorization")?.split(" ")[1] as string)
        if (tokenVerification.success === false) return NextResponse.json(tokenVerification, { status: tokenVerification.statusCode })
        let userRole = decodeToken(request.headers.get("authorization")?.split(" ")[1] as string)
        if (userRole?.role === "user") return NextResponse.json({ message: "Not Admin", }, { status: 403 });

        await initializeConnections();

        const { slug } = await params;


        let reponse: any = {
            data: [],
            message: "",
            sucess: true
        }

        const couponDetails: any = await Coupon.find({ code: slug, isActive: true });
        reponse.message = "Coupon Not Found"
        reponse.sucess = false

        if (couponDetails.length == 0) return NextResponse.json(reponse, { status: 200 });
        reponse.sucess = true
        reponse.data = couponDetails
        reponse.message = "Coupon Found Sucessfully"
        return NextResponse.json(reponse, { status: 200 });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}