import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import Order from "@/models/Orders";
import User from "@/models/User";

import { initializeConnections } from "@/components/common/initializeConnections";
import { VerifyToken } from "@/services/auth.service";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        let tokenVerification: any = await VerifyToken(request.headers.get("authorization")?.split(" ")[1] as string)
        if (tokenVerification.success === false) return NextResponse.json(tokenVerification, { status: tokenVerification.statusCode })

        await initializeConnections();

        const { id } = await params;

        const userId = new mongoose.Types.ObjectId(id);

        const [
            totalOrders,
            delivered,
            pending,
            totalSpentResult,
            recentOrders,
            recentTransactions,
        ] = await Promise.all([

            Order.countDocuments({ user: userId, }),

            Order.countDocuments({ user: userId, status: "delivered", }),

            Order.countDocuments({ user: userId, status: "pending", }),

            Order.aggregate([
                { $match: { user: userId, paymentStatus: "Paid" }, },
                { $group: { _id: null, totalSpent: { $sum: "$amount", }, }, },
            ]),

            Order.find({ user: userId })
                .sort({ createdAt: -1, })
                .limit(5)
                .populate("products.product", "name images"),

            Order.find({ user: userId, paymentStatus: "Paid", })
                .sort({ createdAt: -1, })
                .limit(5)
                .select("transactionId amount paymentMethod paymentStatus createdAt"),
        ]);

        const totalSpent = totalSpentResult.length > 0 ? totalSpentResult[0].totalSpent : 0;

        return NextResponse.json({
            success: true,
            stats: {
                totalOrders,
                delivered,
                pending,
                totalSpent,
            }, recentOrders, recentTransactions,
        });
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ success: false, message: error.message, }, { status: 500, });
    }
}