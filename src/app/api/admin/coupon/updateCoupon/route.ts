import { NextResponse } from "next/server";
import { initializeConnections } from "@/components/common/initializeConnections";
import Coupon from "@/models/coupon";

export async function PUT(request: Request) {
    try {
        await initializeConnections();

        const body = await request.json();

        const updateCoupon = await Coupon.findByIdAndUpdate(
            body.id,
            {
                roleName: body.roleName,
                description: body.description,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updateCoupon) {
            return NextResponse.json({ message: "Role not found" }, { status: 404 });
        }

        return NextResponse.json(updateCoupon, { status: 200 });
    } catch (err: any) {
        console.log(err, "In err")
        return NextResponse.json({ message: err.message, }, { status: 400 });
    }
}