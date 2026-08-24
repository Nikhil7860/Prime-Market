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
        <div className="w-full max-w-full overflow-x-hidden space-y-6 sm:space-y-8 lg:space-y-10 px-4 sm:px-6 lg:px-0">
            <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                    Welcome Back 👋
                </h1>

                <p className="mt-2 text-sm sm:text-base text-gray-400">
                    Here's what's happening with your store today.
                </p>
                <Link
                    href="/"
                    className="mt-4 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg"
                >
                    <ShoppingBag size={18} className="shrink-0" />
                    Browse Products
                </Link>
            </div>

            <div className="w-full min-w-0 overflow-x-hidden">
                <DashboardStats
                    totalOrders={dashboard?.stats?.totalOrders || 0}
                    delivered={dashboard?.stats?.delivered || 0}
                    pending={dashboard?.stats?.pending || 0}
                    totalSpent={dashboard?.stats?.totalSpent || 0}
                />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8 min-w-0">

                <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/60 p-4 sm:p-6 backdrop-blur-xl">
                    <h2 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-bold text-white">
                        Recent Orders
                    </h2>


                    <div className="max-h-[420px] sm:max-h-[500px] lg:max-h-[600px] space-y-3 sm:space-y-4 overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
                        {dashboard?.recentOrders?.length > 0 ? (

                            <>
                                {dashboard.recentOrders.map((order: any) => (
                                    <div
                                        key={order._id}
                                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-2 rounded-xl sm:rounded-2xl border border-slate-700 bg-slate-800/70 p-3 sm:p-4 transition-all duration-300 hover:border-blue-500 hover:bg-slate-800"
                                    >

                                        <div className="flex min-w-0 w-full items-center gap-3 sm:gap-4">

                                            <img
                                                src={
                                                    order.products?.[0]?.image ||
                                                    "/placeholder-product.png"
                                                }
                                                alt={
                                                    order.products?.[0]?.productName ||
                                                    "Product"
                                                }
                                                className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-lg object-cover"
                                            />

                                            <div className="min-w-0 flex-1">
                                                <h3 className="truncate text-sm sm:text-base font-semibold text-white">
                                                    {order.products?.[0]?.productName ||
                                                        "Unknown Product"}
                                                </h3>

                                                <p className="truncate text-xs sm:text-sm text-slate-400">
                                                    {order.userDetails?.name ||
                                                        "Unknown User"}
                                                </p>

                                                <p className="text-xs text-slate-500">
                                                    Order #{order._id?.slice(-6)}
                                                </p>
                                            </div>

                                            {/* Amount inline on mobile, hidden here on sm+ where it moves to the right column */}
                                            <p className="shrink-0 font-bold text-white text-sm sm:hidden">
                                                ₹
                                                {Number(order.amount || 0).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </p>
                                        </div>


                                        <div className="flex w-full sm:w-auto max-w-full shrink-0 items-center justify-between sm:block sm:text-right">

                                            <p className="hidden sm:block font-bold text-white">
                                                ₹
                                                {Number(order.amount || 0).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </p>

                                            <span
                                                className={`inline-block rounded-full px-2.5 sm:px-3 py-1 text-xs font-semibold whitespace-nowrap ${order.status === "paid"
                                                    ? "bg-green-500/20 text-green-400"
                                                    : order.status === "pending"
                                                        ? "bg-yellow-500/20 text-yellow-400"
                                                        : "bg-red-500/20 text-red-400"
                                                    }`}
                                            >
                                                {order.status}
                                            </span>

                                            <p className="mt-1 text-xs text-slate-500 whitespace-nowrap">
                                                {order.createdAt
                                                    ? new Date(
                                                        order.createdAt
                                                    ).toLocaleDateString("en-IN")
                                                    : "-"}
                                            </p>

                                        </div>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <div className="rounded-xl bg-slate-800 p-6 sm:p-8 text-center text-sm sm:text-base text-slate-400">
                                No recent orders found.
                            </div>
                        )}
                    </div>



                </div>

                <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/60 p-4 sm:p-6 backdrop-blur-xl">
                    <h2 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-bold text-white">
                        Recent Transactions
                    </h2>

                    {transacations?.length > 0 ? (

                        <div className="max-h-[420px] sm:max-h-[500px] lg:max-h-[600px] space-y-3 sm:space-y-4 overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">

                            {transacations.map((item: any) => {

                                const isCredit =
                                    item.type === "deposit" ||
                                    item.type === "refund";

                                return (
                                    <div
                                        key={item._id}
                                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-2 rounded-xl sm:rounded-2xl border border-slate-700 bg-slate-800/70 p-3 sm:p-4 transition-all duration-300 hover:border-blue-500 hover:bg-slate-800"
                                    >

                                        {/* Left */}
                                        <div className="flex w-full items-center gap-3 sm:gap-4">

                                            <div
                                                className={`flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full text-lg sm:text-xl ${isCredit
                                                    ? "bg-green-500/20 text-green-400"
                                                    : "bg-red-500/20 text-red-400"
                                                    }`}
                                            >
                                                {isCredit ? "⬇" : "⬆"}
                                            </div>

                                            <div className="min-w-0 flex-1">

                                                <h3 className="break-words text-sm sm:text-base font-semibold text-white">
                                                    {item.description}
                                                </h3>

                                                <div className="mt-1 flex flex-wrap items-center gap-2 sm:gap-3">

                                                    <span className="rounded-full bg-slate-700 px-2 py-0.5 sm:py-1 text-xs capitalize text-slate-300">
                                                        {item.type}
                                                    </span>

                                                    <span
                                                        className={`rounded-full px-2 py-0.5 sm:py-1 text-xs font-medium capitalize ${item.status === "success"
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
                                                    {new Date(
                                                        item.createdAt
                                                    ).toLocaleString(
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

                                            {/* Amount inline on mobile */}
                                            <p
                                                className={`shrink-0 text-sm font-bold sm:hidden ${isCredit ? "text-green-400" : "text-red-400"
                                                    }`}
                                            >
                                                {isCredit ? "+" : "-"} ₹
                                                {item.amount.toLocaleString("en-IN")}
                                            </p>
                                        </div>


                                        {/* Right (desktop only) */}
                                        <div className="hidden sm:block shrink-0 text-right">

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

                        <div className="flex h-44 sm:h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-800/30 px-4">

                            <div className="mb-3 text-4xl sm:text-5xl">
                                💳
                            </div>

                            <h3 className="text-base sm:text-lg font-semibold text-white">
                                No Transactions Found
                            </h3>

                            <p className="mt-2 text-center text-xs sm:text-sm text-slate-400">
                                Your recent wallet transactions will appear here.
                            </p>

                        </div>

                    )}
                </div>
            </div>
        </div>
    );
}