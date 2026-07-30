import { NextResponse } from "next/server";
import { initializeConnections } from "@/components/common/initializeConnections";
import { VerifyToken } from "@/services/auth.service";

import User from "@/models/User";
import Product from "@/models/Product";
import Order from "@/models/Orders";
import { decodeToken } from "@/lib/jwt";

export async function GET(request: Request) {
    try {
        let tokenVerification: any = await VerifyToken(request.headers.get("authorization")?.split(" ")[1] as string)
        if (tokenVerification.success === false) return NextResponse.json(tokenVerification, { status: tokenVerification.statusCode })
        let userRole = decodeToken(request.headers.get("authorization")?.split(" ")[1] as string)
        if (userRole?.role !== "user") return NextResponse.json({ message: "Not Admin", }, { status: 403 });

        await initializeConnections();

        const currentYear = new Date().getFullYear();

        const [
            totalUsers,
            totalProducts,
            totalOrders,
            revenueResult,
            pendingOrders,
            confirmedOrders,
            shippedOrders,
            deliveredOrders,
            cancelledOrders,
            recentOrders,
            latestUsers,
            monthlyRevenue,
        ] = await Promise.all([

            User.countDocuments(),

            Product.countDocuments(),

            Order.countDocuments(),

            Order.aggregate([
                {
                    $match: {
                        paymentStatus: "Paid",
                    },
                },
                {
                    $group: {
                        _id: null,
                        revenue: {
                            $sum: "$amount",
                        },
                    },
                },
            ]),

            Order.countDocuments({ status: "pending" }),

            Order.countDocuments({ status: "confirmed" }),

            Order.countDocuments({ status: "shipped" }),

            Order.countDocuments({ status: "delivered" }),

            Order.countDocuments({ status: "cancelled" }),

            Order.find({})
                .populate("user", "name email")
                .sort({ createdAt: -1 })
                .limit(5)
                .lean(),

            User.find({})
                .select("name email status createdAt")
                .sort({ createdAt: -1 })
                .limit(5)
                .lean(),

            Order.aggregate([
                {
                    $match: {
                        paymentStatus: "Paid",
                        createdAt: {
                            $gte: new Date(`${currentYear}-01-01`),
                            $lte: new Date(`${currentYear}-12-31`),
                        },
                    },
                },
                {
                    $group: {
                        _id: {
                            $month: "$createdAt",
                        },
                        revenue: {
                            $sum: "$amount",
                        },
                    },
                },
                {
                    $sort: {
                        "_id": 1,
                    },
                },
            ]),
        ]);

        const revenue = revenueResult.length > 0 ? revenueResult[0].revenue : 0;

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const monthlyRevenueData = months.map((month, index) => {
            const found = monthlyRevenue.find(
                (m) => m._id === index + 1
            );

            return {
                month,
                revenue: found?.revenue || 0,
            };
        });

        return NextResponse.json({
            success: true,
            data: {
                stats: {
                    revenue,
                    orders: totalOrders,
                    users: totalUsers,
                    products: totalProducts,
                },
                orderStats: {
                    pending: pendingOrders,
                    confirmed: confirmedOrders,
                    shipped: shippedOrders,
                    delivered: deliveredOrders,
                    cancelled: cancelledOrders,
                },
                recentOrders,
                latestUsers,
                monthlyRevenue: monthlyRevenueData,
            },

        }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            {
                status: 500,
            }
        );
    }
}