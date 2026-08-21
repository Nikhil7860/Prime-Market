import { NextRequest, NextResponse } from "next/server";
import Coupon from "@/models/coupon";
import { initializeConnections } from "@/components/common/initializeConnections";
import { VerifyToken } from "@/services/auth.service";
import { decodeToken } from "@/lib/jwt";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
    try {
        let tokenVerification: any = await VerifyToken(request.headers.get("authorization")?.split(" ")[1] as string)
        if (tokenVerification.success === false) return NextResponse.json(tokenVerification, { status: tokenVerification.statusCode })
        let userRole = decodeToken(request.headers.get("authorization")?.split(" ")[1] as string)
        if (userRole?.role === "user") return NextResponse.json({ message: "Not Admin", }, { status: 403 });

        await initializeConnections();

        const count = await Coupon.countDocuments();

        if (count === 0) {
            await Coupon.insertMany([
                {
                    code: "WELCOME10",
                    description: "Get 10% OFF on your order.",
                    discountType: "percentage",
                    discountValue: 10,
                    minOrderAmount: 2000,
                    maxDiscountAmount: 2000,
                    usageLimit: 100,
                    usedCount: 0,
                    startDate: new Date("2026-08-25T00:00:00+05:30"),
                    endDate: new Date("2026-09-30T23:59:59+05:30"),
                    isActive: true,
                    applicableCategories: [],
                    applicableProducts: [],
                    createdBy: new mongoose.Types.ObjectId("6a88551a275853e691552ee3")
                },

                {
                    code: "SAVE20",
                    description: "Save 20% on your shopping.",
                    discountType: "percentage",
                    discountValue: 20,
                    minOrderAmount: 5000,
                    maxDiscountAmount: 3000,
                    usageLimit: 75,
                    usedCount: 0,
                    startDate: new Date("2026-08-25T00:00:00+05:30"),
                    endDate: new Date("2026-10-15T23:59:59+05:30"),
                    isActive: true,
                    applicableCategories: [],
                    applicableProducts: [],
                    createdBy: new mongoose.Types.ObjectId("6a88551a275853e691552ee3")
                },

                {
                    code: "BIG1000",
                    description: "Get ₹1000 OFF on orders above ₹10000.",
                    discountType: "fixed",
                    discountValue: 1000,
                    minOrderAmount: 10000,
                    maxDiscountAmount: 1000,
                    usageLimit: 50,
                    usedCount: 0,
                    startDate: new Date("2026-09-01T00:00:00+05:30"),
                    endDate: new Date("2026-10-31T23:59:59+05:30"),
                    isActive: true,
                    applicableCategories: [],
                    applicableProducts: [],
                    createdBy: new mongoose.Types.ObjectId("6a88551a275853e691552ee3")
                },

                {
                    code: "FESTIVE25",
                    description: "Enjoy 25% OFF during our festive sale.",
                    discountType: "percentage",
                    discountValue: 25,
                    minOrderAmount: 7500,
                    maxDiscountAmount: 5000,
                    usageLimit: 100,
                    usedCount: 0,
                    startDate: new Date("2026-10-01T00:00:00+05:30"),
                    endDate: new Date("2026-11-15T23:59:59+05:30"),
                    isActive: true,
                    applicableCategories: [],
                    applicableProducts: [],
                    createdBy: new mongoose.Types.ObjectId("6a88551a275853e691552ee3")
                },

                {
                    code: "DIWALI30",
                    description: "Celebrate Diwali with 30% OFF.",
                    discountType: "percentage",
                    discountValue: 30,
                    minOrderAmount: 10000,
                    maxDiscountAmount: 7000,
                    usageLimit: 80,
                    usedCount: 0,
                    startDate: new Date("2026-10-20T00:00:00+05:30"),
                    endDate: new Date("2026-11-15T23:59:59+05:30"),
                    isActive: true,
                    applicableCategories: [],
                    applicableProducts: [],
                    createdBy: new mongoose.Types.ObjectId("6a88551a275853e691552ee3")
                },

                {
                    code: "FLAT500",
                    description: "Flat ₹500 OFF on orders above ₹5000.",
                    discountType: "fixed",
                    discountValue: 500,
                    minOrderAmount: 5000,
                    maxDiscountAmount: 500,
                    usageLimit: 150,
                    usedCount: 0,
                    startDate: new Date("2026-08-25T00:00:00+05:30"),
                    endDate: new Date("2026-09-25T23:59:59+05:30"),
                    isActive: true,
                    applicableCategories: [],
                    applicableProducts: [],
                    createdBy: new mongoose.Types.ObjectId("6a88551a275853e691552ee3")
                },

                {
                    code: "MEGA35",
                    description: "Get a massive 35% discount on your order.",
                    discountType: "percentage",
                    discountValue: 35,
                    minOrderAmount: 12000,
                    maxDiscountAmount: 8000,
                    usageLimit: 60,
                    usedCount: 0,
                    startDate: new Date("2026-11-01T00:00:00+05:30"),
                    endDate: new Date("2026-12-15T23:59:59+05:30"),
                    isActive: true,
                    applicableCategories: [],
                    applicableProducts: [],
                    createdBy: new mongoose.Types.ObjectId("6a88551a275853e691552ee3")
                },

                {
                    code: "NEWUSER15",
                    description: "Special 15% OFF for new customers.",
                    discountType: "percentage",
                    discountValue: 15,
                    minOrderAmount: 3000,
                    maxDiscountAmount: 2500,
                    usageLimit: 200,
                    usedCount: 0,
                    startDate: new Date("2026-08-25T00:00:00+05:30"),
                    endDate: new Date("2026-12-31T23:59:59+05:30"),
                    isActive: true,
                    applicableCategories: [],
                    applicableProducts: [],
                    createdBy: new mongoose.Types.ObjectId("6a88551a275853e691552ee3")
                },

                {
                    code: "WINTER40",
                    description: "Enjoy 40% OFF during our winter sale.",
                    discountType: "percentage",
                    discountValue: 40,
                    minOrderAmount: 15000,
                    maxDiscountAmount: 9000,
                    usageLimit: 50,
                    usedCount: 0,
                    startDate: new Date("2026-12-01T00:00:00+05:30"),
                    endDate: new Date("2027-01-15T23:59:59+05:30"),
                    isActive: true,
                    applicableCategories: [],
                    applicableProducts: [],
                    createdBy: new mongoose.Types.ObjectId("6a88551a275853e691552ee3")
                },

                {
                    code: "YEAR50",
                    description: "Get 50% OFF during our year-end mega sale.",
                    discountType: "percentage",
                    discountValue: 50,
                    minOrderAmount: 20000,
                    maxDiscountAmount: 10000,
                    usageLimit: 40,
                    usedCount: 0,
                    startDate: new Date("2026-12-20T00:00:00+05:30"),
                    endDate: new Date("2027-01-05T23:59:59+05:30"),
                    isActive: true,
                    applicableCategories: [],
                    applicableProducts: [],
                    createdBy: new mongoose.Types.ObjectId("6a88551a275853e691552ee3")
                }
            ]);
        }

        const Coupons = await Coupon.find();
        return NextResponse.json(Coupons, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 400 });
    }
}