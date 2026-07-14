"use client";

import Link from "next/link";
import {
    ArrowRight,
    Clock3,
    CheckCircle2,
    Truck,
    XCircle,
} from "lucide-react";

interface Order {
    _id: string;
    customer: string;
    amount: number;
    paymentStatus: "Paid" | "Pending" | "Failed";
    orderStatus:
    | "Pending"
    | "Processing"
    | "Shipped"
    | "Delivered"
    | "Cancelled";
    date: string;
}

// const orders: Order[] = [
//     {
//         _id: "ORD-10231",
//         customer: "Nikhil Arora",
//         amount: 2400,
//         paymentStatus: "Paid",
//         orderStatus: "Delivered",
//         date: "28 Jun 2026",
//     },
//     {
//         _id: "ORD-10232",
//         customer: "Rahul Sharma",
//         amount: 850,
//         paymentStatus: "Pending",
//         orderStatus: "Processing",
//         date: "28 Jun 2026",
//     },
//     {
//         _id: "ORD-10233",
//         customer: "Priya Gupta",
//         amount: 12999,
//         paymentStatus: "Paid",
//         orderStatus: "Shipped",
//         date: "27 Jun 2026",
//     },
//     {
//         _id: "ORD-10234",
//         customer: "Amit Kumar",
//         amount: 5600,
//         paymentStatus: "Failed",
//         orderStatus: "Cancelled",
//         date: "27 Jun 2026",
//     },
//     {
//         _id: "ORD-10235",
//         customer: "John Doe",
//         amount: 1999,
//         paymentStatus: "Paid",
//         orderStatus: "Pending",
//         date: "26 Jun 2026",
//     },
// ];

function paymentBadge(status: string) {
    switch (status) {
        case "Paid":
            return "bg-green-100 text-green-700";
        case "Pending":
            return "bg-yellow-100 text-yellow-700";
        default:
            return "bg-red-100 text-red-700";
    }
}

function statusBadge(status: string) {
    switch (status) {
        case "Delivered":
            return "bg-green-100 text-green-700";
        case "Processing":
            return "bg-blue-100 text-blue-700";
        case "Shipped":
            return "bg-purple-100 text-purple-700";
        case "Cancelled":
            return "bg-red-100 text-red-700";
        default:
            return "bg-yellow-100 text-yellow-700";
    }
}

function statusIcon(status: string) {
    switch (status) {
        case "Delivered":
            return <CheckCircle2 size={16} />;
        case "Processing":
            return <Clock3 size={16} />;
        case "Shipped":
            return <Truck size={16} />;
        case "Cancelled":
            return <XCircle size={16} />;
        default:
            return <Clock3 size={16} />;
    }
}

export default function RecentOrders(recentorders: any) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

            <div className="flex items-center justify-between border-b border-slate-200 p-6 dark:border-slate-700">

                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Recent Orders
                    </h2>

                    <p className="text-sm text-slate-500">
                        Latest customer purchases
                    </p>
                </div>

                <Link
                    href="/admin/orders"
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                >
                    View All

                    <ArrowRight size={18} />
                </Link>

            </div>

            <div className="overflow-x-auto">

                <table className="min-w-full">

                    <thead>

                        <tr className="border-b border-slate-200 dark:border-slate-700">

                            <th className="px-6 py-4 text-left text-sm font-semibold">
                                Order ID
                            </th>

                            <th className="px-6 py-4 text-left text-sm font-semibold">
                                Customer
                            </th>

                            <th className="px-6 py-4 text-left text-sm font-semibold">
                                Amount
                            </th>

                            <th className="px-6 py-4 text-left text-sm font-semibold">
                                Payment
                            </th>

                            <th className="px-6 py-4 text-left text-sm font-semibold">
                                Status
                            </th>

                            <th className="px-6 py-4 text-left text-sm font-semibold">
                                Date
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {recentorders.recentorders.map((order: any) => (

                            <tr
                                key={order._id}
                                className="border-b border-slate-100 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
                            >

                                <td className="px-6 py-5 font-semibold">
                                    {order._id}
                                </td>

                                <td className="px-6 py-5">

                                    <div className="flex items-center gap-3">

                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">

                                            {/* {order.customer.split(" ").map((x: any) => x[0]).join("").slice(0, 2)} */}

                                        </div>

                                        <div>

                                            <p className="font-medium">
                                                {order.customer}
                                            </p>

                                        </div>

                                    </div>

                                </td>

                                <td className="px-6 py-5 font-semibold">

                                    ₹{order.amount.toLocaleString()}

                                </td>

                                <td className="px-6 py-5">

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${paymentBadge(
                                            order.paymentStatus
                                        )}`}
                                    >
                                        {order.paymentStatus}
                                    </span>

                                </td>

                                <td className="px-6 py-5">

                                    <span
                                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(
                                            order.orderStatus
                                        )}`}
                                    >

                                        {statusIcon(order.orderStatus)}

                                        {order.orderStatus}

                                    </span>

                                </td>

                                <td className="px-6 py-5 text-slate-500">
                                    {order.date}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}