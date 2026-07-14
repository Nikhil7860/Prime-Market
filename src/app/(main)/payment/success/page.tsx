"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
    CheckCircle,
    ShoppingBag,
    Receipt,
    Home,
    Package,
} from "lucide-react";

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams();

    const transactionId =
        searchParams.get("transactionId") || "N/A";

    return (
        <section className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">

            <div className="w-full rounded-3xl bg-slate-900 p-5 shadow-2xl sm:p-8 lg:p-10">

                {/* Success Icon */}

                <div className="flex justify-center">

                    <div className="rounded-full bg-green-500/20 p-4 sm:p-6">

                        <CheckCircle
                            size={60}
                            className="text-green-500 sm:h-20 sm:w-20"
                        />

                    </div>

                </div>

                {/* Heading */}

                <div className="mt-6 text-center sm:mt-8">

                    <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                        Payment Successful 🎉
                    </h1>

                    <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                        Thank you for shopping with us. Your payment has been
                        received successfully and your order has been confirmed.
                    </p>

                </div>

                {/* Transaction Details */}

                <div className="mt-8 rounded-2xl bg-slate-800 p-5 sm:mt-10 sm:p-6">

                    <div className="flex flex-col gap-2 border-b border-slate-700 pb-4 sm:flex-row sm:items-center sm:justify-between">

                        <span className="text-slate-400">
                            Transaction ID
                        </span>

                        <span className="break-all font-semibold text-white sm:text-right">
                            {transactionId}
                        </span>

                    </div>

                    <div className="mt-4 flex flex-col gap-2 border-b border-slate-700 pb-4 sm:flex-row sm:items-center sm:justify-between">

                        <span className="text-slate-400">
                            Payment Status
                        </span>

                        <span className="font-semibold text-green-400">
                            Paid
                        </span>

                    </div>

                    <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                        <span className="text-slate-400">
                            Estimated Delivery
                        </span>

                        <span className="font-semibold text-white">
                            3 – 5 Business Days
                        </span>

                    </div>

                </div>

                {/* Buttons */}

                <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">

                    <Link
                        href="/dashboard/orders"
                        className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-4 text-center font-semibold text-white transition hover:bg-blue-700"
                    >
                        <Package size={20} />
                        View Orders
                    </Link>

                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 rounded-xl bg-slate-700 px-4 py-4 text-center font-semibold text-white transition hover:bg-slate-600"
                    >
                        <Home size={20} />
                        Continue Shopping
                    </Link>

                    <button
                        onClick={() =>
                            alert("Invoice download will be implemented later.")
                        }
                        className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-4 text-center font-semibold text-white transition hover:bg-emerald-700"
                    >
                        <Receipt size={20} />
                        Download Invoice
                    </button>

                </div>

                {/* Footer */}

                <div className="mt-8 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-center sm:mt-10 sm:p-6">

                    <ShoppingBag
                        className="mx-auto mb-3 text-green-400"
                        size={32}
                    />

                    <p className="text-sm leading-6 text-green-300 sm:text-base">
                        A confirmation email has been sent to your registered
                        email address.
                    </p>

                </div>

            </div>

        </section>
    );
}