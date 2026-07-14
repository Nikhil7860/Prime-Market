import { NextResponse } from "next/server";
import Coupon from "@/models/coupon";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        let createCoupon = Coupon.insertOne(body)
        return NextResponse.json(createCoupon,{ status: 200 });
    } catch (err: any) {
        console.log(err, "In err")
        return NextResponse.json({ message: err.message, }, { status: 400 });
    }
}