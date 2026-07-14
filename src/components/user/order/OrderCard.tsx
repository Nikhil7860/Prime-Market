"use client";

import {
    ShoppingBag,
    CheckCircle2,
    Clock3,
    Truck,
    Package,
    XCircle,
    Eye,
    Receipt,
} from "lucide-react";

interface Order {
    _id: string;
    totalAmount: number;
    paymentStatus: string;
    status:
    | "pending"
    | "confirmed"
    | "shipped"
    | "delivered"
    | "cancelled";
    products: {
        _id: string;
    }[];
    amount: number
    createdAt?: string;
}

interface Props {
    order: Order;
    onView: () => void;
    onReceipt: () => void;
}

export default function OrderCard({ order, onView, onReceipt }: Props) {
    const statusStyle = {
        delivered:
            "bg-green-500/15 text-green-400",
        confirmed:
            "bg-amber-500/15 text-amber-400",
        pending:
            "bg-yellow-500/15 text-yellow-400",
        shipped:
            "bg-blue-500/15 text-blue-400",
        cancelled:
            "bg-red-500/15 text-red-400",
    };

    const paymentStyle = {
        paid: "bg-green-500/15 text-green-400",
        pending:
            "bg-yellow-500/15 text-yellow-400",
        failed: "bg-red-500/15 text-red-400",
    };

    const statusIcon: any = {
        pending: Clock3,
        Paid: Package,
        shipped: Truck,
        delivered: CheckCircle2,
        cancelled: XCircle,
    };


    const StatusIcon = statusIcon[order.status];

    return (
        <div className="group rounded-3xl border border-slate-800 bg-[#111827] p-6 transition-all duration-300 hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-600/10">

            <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">

                {/* LEFT */}

                <div className="flex items-center gap-5">

                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-300 to-violet-200">

                        <ShoppingBag
                            size={34}
                            className="text-slate-900"
                        />

                    </div>

                    <div>

                        <h3 className="text-2xl font-bold text-white">

                            #{order._id.slice(-8)}

                        </h3>

                        <p className="mt-2 text-slate-400">

                            {order.products.length} Item
                            {order.products.length > 1
                                ? "s"
                                : ""}

                            {" • "}

                            {order.createdAt
                                ? new Date(
                                    order.createdAt
                                ).toLocaleDateString()
                                : "Today"}

                        </p>

                    </div>

                </div>

                {/* INFO */}

                <div className="grid flex-1 gap-6 md:grid-cols-4">

                    <div>

                        <p className="text-sm text-slate-500">

                            Total

                        </p>

                        <h4 className="mt-2 text-2xl font-bold text-white">

                            ₹
                            {order.amount.toLocaleString()}

                        </h4>

                    </div>

                    <div>

                        <p className="text-sm text-slate-500">

                            Status

                        </p>

                        <div
                            className={`mt-2 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold capitalize ${statusStyle[
                                order.status
                            ]
                                }`}
                        >
                            {/* <StatusIcon size={16} /> */}

                            {order.status}

                        </div>

                    </div>

                    <div>

                        <p className="text-sm text-slate-500">

                            Payment

                        </p>

                        <div
                            className={`mt-2 inline-flex rounded-full px-4 py-2 text-sm font-semibold capitalize ${paymentStyle[
                                order.paymentStatus as keyof typeof paymentStyle
                            ] ??
                                "bg-slate-700 text-white"
                                }`}
                        >
                            {order.paymentStatus}
                        </div>

                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-2">

                        <button
                            onClick={onView}
                            className="rounded-lg border border-indigo-600 py-2 font-semibold text-indigo-600 hover:bg-indigo-600 hover:text-white"
                        >
                            View Details
                        </button>

                        <button
                            onClick={onReceipt}
                            className="rounded-lg bg-green-600 py-2 font-semibold text-white hover:bg-green-700"
                        >
                            Download Receipt
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}