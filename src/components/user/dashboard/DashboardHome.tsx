"use client";

import Link from "next/link";
import DashboardStats from "./DashboardStats";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { getRequest } from "@/services/apiMethods";
import { useAppSelector } from "@/hooks/redux";
import { getTransactionById } from "@/services/transaction.service";

export default function DashboardHome() {
    const [dashboard, setDashboard] = useState<any>(null);
    const [transacations, settransacations] = useState<any>([]);
    const auth: any = useAppSelector((state) => state.auth);
    useEffect(() => {
        fetchDashboard(auth?.user?._id);
        fetchTranscation(auth?.user?._id)
    }, [auth?.user?._id]);

    const fetchDashboard = async (id: string) => {
        const res = await getRequest(`users/dashboard/${id}`);
        console.log(res, res)
        setDashboard(res);
    };

    const fetchTranscation = async (id: string) => {
        try {
            let transacationsResp = await getTransactionById(id)

            settransacations(transacationsResp)

        } catch (error) {
            console.log(error, "In the error fetching Transcations")
        }

    }

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-4xl font-bold text-white">
                    Welcome Back 👋
                </h1>

                <p className="mt-2 text-gray-400">
                    Here's what's happening with your store today.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg"
                >
                    <ShoppingBag size={20} />
                    Browse Products
                </Link>
            </div>

            <DashboardStats
                totalOrders={dashboard?.stats?.totalOrders || 0}
                delivered={dashboard?.stats?.delivered || 0}
                pending={dashboard?.stats?.pending || 0}
                totalSpent={dashboard?.stats?.totalSpent || 0}
            />

            <div className="grid gap-8 lg:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl">
                    <h2 className="mb-6 text-2xl font-bold text-white">
                        Recent Orders
                    </h2>

                    <div className="space-y-4">
                        {dashboard?.recentOrders?.length > 0 ? (
                            dashboard.recentOrders.map((order: any) => (
                                <div
                                    key={order._id}
                                    className="flex items-center justify-between rounded-xl bg-slate-800 p-4 transition hover:bg-slate-700"
                                >
                                    {/* Left */}
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={
                                                order.products?.[0]?.image ||
                                                "/placeholder-product.png"
                                            }
                                            alt={order.products?.[0]?.productName}
                                            className="h-14 w-14 rounded-lg object-cover"
                                        />

                                        <div>
                                            <h3 className="font-semibold text-white">
                                                {order.products?.[0]?.productName}
                                            </h3>

                                            <p className="text-sm text-slate-400">
                                                {order.userDetails?.name}
                                            </p>

                                            <p className="text-xs text-slate-500">
                                                Order #{order._id.slice(-6)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right */}
                                    <div className="text-right">
                                        <p className="font-bold text-white">
                                            ₹{order.amount.toLocaleString()}
                                        </p>

                                        <span
                                            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${order.status === "paid"
                                                ? "bg-green-500/20 text-green-400"
                                                : order.status === "pending"
                                                    ? "bg-yellow-500/20 text-yellow-400"
                                                    : "bg-red-500/20 text-red-400"
                                                }`}
                                        >
                                            {order.status}
                                        </span>

                                        <p className="mt-1 text-xs text-slate-500">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="rounded-xl bg-slate-800 p-8 text-center text-slate-400">
                                No recent orders found.
                            </div>
                        )}
                    </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl">
                    <h2 className="mb-6 text-2xl font-bold text-white">
                        Recent Transactions
                    </h2>

                    {transacations?.length > 0 ? (
                        <div className="space-y-4">
                            {transacations.map((item: any) => {
                                const isCredit =
                                    item.type === "deposit" || item.type === "refund";

                                return (
                                    <div
                                        key={item._id}
                                        className="flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-800/70 p-4 transition-all duration-300 hover:border-blue-500 hover:bg-slate-800"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`flex h-12 w-12 items-center justify-center rounded-full text-xl ${isCredit
                                                    ? "bg-green-500/20 text-green-400"
                                                    : "bg-red-500/20 text-red-400"
                                                    }`}
                                            >
                                                {isCredit ? "⬇" : "⬆"}
                                            </div>

                                            <div>
                                                <h3 className="font-semibold text-white">
                                                    {item.description}
                                                </h3>

                                                <div className="mt-1 flex items-center gap-3">
                                                    <span className="rounded-full bg-slate-700 px-2 py-1 text-xs capitalize text-slate-300">
                                                        {item.type}
                                                    </span>

                                                    <span
                                                        className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${item.status === "success"
                                                            ? "bg-green-500/20 text-green-400"
                                                            : item.status === "pending"
                                                                ? "bg-yellow-500/20 text-yellow-400"
                                                                : "bg-red-500/20 text-red-400"
                                                            }`}
                                                    >
                                                        {item.status}
                                                    </span>
                                                </div>

                                                <p className="mt-2 text-xs text-slate-400">
                                                    {new Date(item.createdAt).toLocaleString(
                                                        "en-IN",
                                                        {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        }
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p
                                                className={`text-lg font-bold ${isCredit
                                                    ? "text-green-400"
                                                    : "text-red-400"
                                                    }`}
                                            >
                                                {isCredit ? "+" : "-"} ₹
                                                {item.amount.toLocaleString("en-IN")}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-800/30">
                            <div className="mb-3 text-5xl">💳</div>

                            <h3 className="text-lg font-semibold text-white">
                                No Transactions Found
                            </h3>

                            <p className="mt-2 text-center text-sm text-slate-400">
                                Your recent wallet transactions will appear here.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}