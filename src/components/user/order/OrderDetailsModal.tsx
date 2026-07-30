"use client";

import {
    X,
    Clock3,
    Package,
    Truck,
    CheckCircle2,
    XCircle,
    Receipt,
} from "lucide-react";

import { Order } from "@/components/user/order/OrdersSection";

interface Props {
    open: boolean;
    order: Order | null;

    onClose: () => void;

    onCancel: (id: string) => void;

    onReceipt: (order: Order) => void;
}

export default function OrderDetailsModal({ open, order, onClose, onCancel, onReceipt }: Props) {
    if (!open || !order) return null;

    const statusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-700";

            case "processing":
                return "bg-blue-100 text-blue-700";

            case "shipped":
                return "bg-indigo-100 text-indigo-700";

            case "delivered":
                return "bg-green-100 text-green-700";

            case "cancelled":
                return "bg-red-100 text-red-700";

            default:
                return "bg-slate-100 text-slate-700";
        }
    };

    const paymentColor = (status: string) => {
        switch (status) {
            case "paid":
                return "bg-green-100 text-green-700";

            case "pending":
                return "bg-yellow-100 text-yellow-700";

            case "failed":
                return "bg-red-100 text-red-700";

            default:
                return "bg-slate-100 text-slate-700";
        }
    };

    const timelineSteps = [
        {
            label: "Pending",
            value: "pending",
            icon: Clock3,
        },
        {
            label: "Processing",
            value: "processing",
            icon: Package,
        },
        {
            label: "Shipped",
            value: "shipped",
            icon: Truck,
        },
        {
            label: "Delivered",
            value: "delivered",
            icon: CheckCircle2,
        },
    ];

    const currentIndex = timelineSteps.findIndex((step) => step.value === order.status);

    return (
        <div
            className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <div className="flex min-h-screen items-center justify-center p-4">

                <div
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl"
                >
                    {/* ================= HEADER ================= */}

                    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-8 py-6 text-white">

                        <div className="flex items-start justify-between">

                            <div>

                                <p className="text-sm uppercase tracking-widest text-slate-400">
                                    Order Details
                                </p>

                                <h2 className="mt-2 text-3xl font-bold">
                                    #{order._id.slice(-8)}
                                </h2>

                                <p className="mt-2 text-slate-300">
                                    {order.products.length} Item
                                    {order.products.length > 1 ? "s" : ""}
                                </p>

                            </div>

                            <button
                                onClick={onClose}
                                className="rounded-xl bg-white/10 p-3 transition hover:bg-white/20"
                            >
                                <X size={22} />
                            </button>

                        </div>
                    </div>

                    {/* ================= CONTENT ================= */}

                    <div className="grid gap-8 p-8 lg:grid-cols-[2fr_1fr]">

                        {/* LEFT */}

                        <div className="space-y-8">

                            {/* Status */}

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">

                                <h3 className="text-xl font-bold text-slate-900">
                                    Order Status
                                </h3>

                                <div className="mt-5 flex flex-wrap gap-3">

                                    <span
                                        className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${statusColor(
                                            order.status
                                        )}`}
                                    >
                                        {order.status}
                                    </span>

                                    <span
                                        className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${paymentColor(
                                            order.paymentStatus
                                        )}`}
                                    >
                                        {order.paymentStatus}
                                    </span>

                                </div>

                            </div>

                            {/* Timeline */}

                            <div className="rounded-2xl border border-slate-200 bg-white p-6">

                                <h3 className="mb-8 text-xl font-bold">
                                    Order Progress
                                </h3>

                                <div className="flex items-center">

                                    {timelineSteps.map((step, index) => {

                                        const Icon = step.icon;

                                        const active =
                                            index <= currentIndex;

                                        return (
                                            <div
                                                key={step.value}
                                                className="flex flex-1 items-center"
                                            >
                                                <div className="flex flex-col items-center">

                                                    <div
                                                        className={`flex h-12 w-12 items-center justify-center rounded-full ${active
                                                            ? "bg-green-600 text-white"
                                                            : "bg-slate-200 text-slate-500"
                                                            }`}
                                                    >
                                                        <Icon size={20} />
                                                    </div>

                                                    <p className="mt-3 text-xs font-semibold uppercase text-center">
                                                        {step.label}
                                                    </p>

                                                </div>

                                                {index !== timelineSteps.length - 1 && (

                                                    <div
                                                        className={`h-1 flex-1 ${active
                                                            ? "bg-green-500"
                                                            : "bg-slate-200"
                                                            }`}
                                                    />

                                                )}

                                            </div>
                                        );
                                    })}

                                </div>

                            </div>

                            {/* ================= PRODUCTS ================= */}

                            <div className="rounded-2xl border border-slate-200 bg-white p-6">

                                <div className="mb-6 flex items-center justify-between">

                                    <div>

                                        <h3 className="text-2xl font-bold text-slate-900">
                                            Ordered Products
                                        </h3>

                                        <p className="mt-1 text-sm text-slate-500">
                                            {order.products.length} Item{order.products.length > 1 ? "s" : ""} in this order
                                        </p>

                                    </div>

                                    <div className="rounded-xl bg-slate-100 px-4 py-2">

                                        <span className="text-sm font-semibold text-slate-700">
                                            ₹{order.amount.toLocaleString()}
                                        </span>

                                    </div>

                                </div>

                                <div className="space-y-5">

                                    {order.products.map((item: any) => {

                                        const subtotal =
                                            item.price * item.quantity;

                                        return (

                                            <div
                                                key={item._id}
                                                className="overflow-hidden rounded-2xl border border-slate-200 transition-all duration-300 hover:border-blue-300 hover:shadow-lg"
                                            >

                                                <div className="flex flex-col gap-6 p-5 md:flex-row">

                                                    {/* PRODUCT IMAGE */}

                                                    <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl bg-slate-100">

                                                        <Package
                                                            size={42}
                                                            className="text-slate-400"
                                                        />

                                                    </div>

                                                    {/* PRODUCT INFO */}

                                                    <div className="flex-1">

                                                        <h4 className="text-lg font-bold text-slate-900">

                                                            {item.productName}

                                                        </h4>

                                                        <p className="mt-2 text-sm text-slate-500">

                                                            Product ID

                                                        </p>

                                                        <p className="break-all text-sm text-slate-700">

                                                            {item.product}

                                                        </p>

                                                        <div className="mt-5 flex flex-wrap gap-3">

                                                            <div className="rounded-lg bg-slate-100 px-4 py-2">

                                                                <p className="text-xs uppercase text-slate-400">
                                                                    Quantity
                                                                </p>

                                                                <p className="mt-1 font-semibold text-slate-900">

                                                                    {item.quantity}

                                                                </p>

                                                            </div>

                                                            <div className="rounded-lg bg-slate-100 px-4 py-2">

                                                                <p className="text-xs uppercase text-slate-400">
                                                                    Unit Price
                                                                </p>

                                                                <p className="mt-1 font-semibold text-slate-900">

                                                                    ₹{item.price.toLocaleString()}

                                                                </p>

                                                            </div>

                                                        </div>

                                                    </div>

                                                    {/* PRICE */}

                                                    <div className="flex flex-col items-end justify-between">

                                                        <div>

                                                            <p className="text-xs uppercase tracking-wider text-slate-400">

                                                                Subtotal

                                                            </p>

                                                            <h3 className="mt-2 text-3xl font-bold text-blue-600">

                                                                ₹{subtotal.toLocaleString()}

                                                            </h3>

                                                        </div>

                                                        <div className="rounded-full bg-green-100 px-4 py-2">

                                                            <span className="text-sm font-semibold text-green-700">

                                                                In Stock

                                                            </span>

                                                        </div>

                                                    </div>

                                                </div>

                                            </div>

                                        );

                                    })}

                                </div>

                            </div>




                        </div>

                        {/* RIGHT */}

                        <div className="space-y-6">

                            {/* ================= BILL SUMMARY ================= */}

                            <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-violet-700 via-fuchsia-700 to-indigo-800 p-[1px] shadow-xl">

                                <div className="rounded-2xl bg-gradient-to-br from-violet-900/95 via-fuchsia-900/90 to-indigo-950 p-6">

                                    <h3 className="mb-6 text-xl font-bold text-white">
                                        Bill Summary
                                    </h3>

                                    <div className="space-y-5">

                                        <div className="flex items-center justify-between border-b border-white/10 pb-3">

                                            <span className="text-violet-200">
                                                Products
                                            </span>

                                            <span className="font-semibold text-white">
                                                {order.products.length}
                                            </span>

                                        </div>

                                        <div className="flex items-center justify-between border-b border-white/10 pb-3">

                                            <span className="text-violet-200">
                                                Items Quantity
                                            </span>

                                            <span className="font-semibold text-white">
                                                {order.products.reduce(
                                                    (sum: number, item: any) => sum + item.quantity,
                                                    0
                                                )}
                                            </span>

                                        </div>

                                        <div className="flex items-center justify-between border-b border-white/10 pb-3">

                                            <span className="text-violet-200">
                                                Coupon Discount
                                            </span>

                                            <span className="font-semibold text-emerald-400">
                                                - ₹{order.discount.toLocaleString()}
                                            </span>

                                        </div>

                                        <div className="flex items-center justify-between border-b border-white/10 pb-3">

                                            <span className="text-violet-200">
                                                Payment
                                            </span>

                                            <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm font-semibold capitalize text-green-300">
                                                {order.paymentStatus}
                                            </span>

                                        </div>

                                        <div className="flex items-center justify-between">

                                            <span className="text-violet-200">
                                                Order Status
                                            </span>

                                            <span className="rounded-full bg-blue-500/20 px-3 py-1 text-sm font-semibold capitalize text-blue-300">
                                                {order.status}
                                            </span>

                                        </div>

                                        <div className="my-2 border-t border-white/10"></div>

                                        <div className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-4">

                                            <span className="text-lg font-bold text-white">
                                                Grand Total
                                            </span>

                                            <span className="text-3xl font-extrabold text-yellow-300">
                                                ₹{order.amount.toLocaleString()}
                                            </span>

                                        </div>

                                    </div>

                                </div>

                            </div>

                            {/* ================= SHIPPING ================= */}

                            <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 p-[1px] shadow-xl">

                                <div className="rounded-2xl bg-gradient-to-br from-slate-900/95 via-slate-800 to-slate-900 p-6">

                                    <h3 className="mb-6 text-xl font-bold text-white">
                                        Shipping Details
                                    </h3>

                                    <div className="space-y-5">

                                        <div className="flex items-center justify-between border-b border-white/10 pb-3">

                                            <span className="text-slate-300">
                                                Delivery
                                            </span>

                                            <span className="font-semibold text-white">
                                                Standard Delivery
                                            </span>

                                        </div>

                                        <div className="flex items-center justify-between border-b border-white/10 pb-3">

                                            <span className="text-slate-300">
                                                Courier
                                            </span>

                                            <span className="font-semibold text-cyan-300">
                                                Delhivery
                                            </span>

                                        </div>

                                        <div className="flex items-center justify-between border-b border-white/10 pb-3">

                                            <span className="text-slate-300">
                                                Tracking
                                            </span>

                                            <span className="font-medium text-yellow-300">
                                                Available after shipping
                                            </span>

                                        </div>

                                        <div className="flex items-center justify-between">

                                            <span className="text-slate-300">
                                                Estimated Delivery
                                            </span>

                                            <span className="font-semibold text-green-400">
                                                3 – 5 Business Days
                                            </span>

                                        </div>

                                    </div>

                                </div>

                            </div>



                            <div className="rounded-2xl bg-blue-50 p-6">

                                <h3 className="text-lg font-bold text-blue-900">

                                    Need Help?

                                </h3>

                                <p className="mt-3 text-sm text-blue-700 leading-6">

                                    Having issues with this order?
                                    Our support team is available
                                    24/7 to help you.

                                </p>

                                <button
                                    className="mt-5 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
                                >
                                    Contact Support
                                </button>

                            </div>

                            {/* Actions */}

                            <div className="space-y-3">

                                {order.status === "pending" && (

                                    <button
                                        onClick={() => onCancel(order._id)}
                                        className="w-full rounded-xl bg-red-600 py-3 font-semibold text-white hover:bg-red-700"
                                    >
                                        Cancel Order
                                    </button>

                                )}

                                {order.status === "delivered" && (

                                    <>
                                        <button
                                            onClick={() => onReceipt(order)}
                                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3 font-semibold text-white hover:bg-green-700"
                                        >
                                            <Receipt size={18} />

                                            Download Receipt
                                        </button>

                                        <button
                                            className="w-full rounded-xl bg-slate-900 py-3 font-semibold text-white hover:bg-slate-800"
                                        >
                                            Buy Again
                                        </button>

                                        <button
                                            className="w-full rounded-xl border border-slate-300 py-3 font-semibold hover:bg-slate-100"
                                        >
                                            ⭐ Rate Products
                                        </button>

                                    </>

                                )}

                                <button
                                    onClick={onClose}
                                    className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-red-700"
                                >
                                    Close
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}