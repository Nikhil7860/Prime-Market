import { NextResponse } from "next/server";
import { initializeConnections } from "@/components/common/initializeConnections";
import Coupon from "@/models/coupon";

export async function PUT(request: Request) {
    try {
        await initializeConnections();

        const body = await request.json();

        const { id, code, description, discountType, discountValue, minOrderAmount, maxDiscountAmount, usageLimit, startDate, endDate, isActive, applicableCategories, applicableProducts } = body;

        // Required Fields
        if (!id) return NextResponse.json({ success: false, message: "Coupon Id is required.", }, { status: 400 });


        if (!code) return NextResponse.json({ success: false, message: "Coupon code is required.", }, { status: 400 });


        // Coupon Exists
        const coupon = await Coupon.findById(id);

        if (!coupon) return NextResponse.json({ success: false, message: "Coupon not found.", }, { status: 404 });


        // // Duplicate Code Check
        // const duplicateCoupon = await Coupon.findOne({ code: code.trim().toUpperCase(), _id: { $ne: id }, });

        // if (duplicateCoupon) {
        //     return NextResponse.json({ success: false, message: "Coupon code already exists.", }, { status: 409 });
        // }

        // Date Validation
        if (new Date(startDate) > new Date(endDate)) return NextResponse.json({ success: false, message: "Start date cannot be greater than end date.", }, { status: 400 });


        // Update Coupon
        const updatedCoupon = await Coupon.findByIdAndUpdate(
            id,
            {
                code: code.trim().toUpperCase(),
                description: description?.trim() || "",
                discountType,
                discountValue,
                minOrderAmount,
                maxDiscountAmount,
                usageLimit,
                startDate,
                endDate,
                isActive,
                applicableCategories: applicableCategories || [],
                applicableProducts: applicableProducts || [],
            },
            { new: true, runValidators: true }
        );

        return NextResponse.json({ success: true, message: "Coupon updated successfully.", data: updatedCoupon, }, { status: 200 });
    } catch (error: any) {
        console.error("Update Coupon Error:", error);

        return NextResponse.json({ success: false, message: error.message || "Something went wrong.", }, { status: 500 });
    }
}