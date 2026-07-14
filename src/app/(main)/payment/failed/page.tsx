"use client";

import Link from "next/link";
import {
    XCircle,
    RefreshCw,
    Home,
    Headphones,
    AlertTriangle,
} from "lucide-react";

export default function PaymentFailedPage() {
    return (
        <section className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">

            <div className="w-full rounded-3xl bg-slate-900 p-5 shadow-2xl sm:p-8 lg:p-10">

                {/* Failure Icon */}

                <div className="flex justify-center">

                    <div className="rounded-full bg-red-500/20 p-4 sm:p-6">

                        <XCircle
                            size={60}
                            className="text-red-500 sm:h-20 sm:w-20"
                        />

                    </div>

                </div>

                {/* Heading */}

                <div className="mt-6 text-center sm:mt-8">

                    <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                        Payment Failed
                    </h1>

                    <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                        We couldn't process your payment.
                        Don't worry, no money has been deducted.
                        Please try again using the same or another payment method.
                    </p>

                </div>

                {/* Error Details */}

                <div className="mt-8 rounded-2xl bg-slate-800 p-5 sm:mt-10 sm:p-6">

                    <div className="flex items-start gap-4">

                        <AlertTriangle
                            className="mt-1 text-yellow-400"
                            size={24}
                        />

                        <div className="flex-1">

                            <h3 className="text-lg font-semibold text-white">
                                Possible Reasons
                            </h3>

                            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-400 sm:text-base">

                                <li>• Network interruption</li>

                                <li>• Bank declined the transaction</li>

                                <li>• Payment session expired</li>

                                <li>• Insufficient account balance</li>

                                <li>• UPI / Card verification failed</li>

                            </ul>

                        </div>

                    </div>

                </div>

                {/* Action Buttons */}

                <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">

                    <Link
                        href="/payment"
                        className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-4 text-center font-semibold text-white transition hover:bg-blue-700"
                    >
                        <RefreshCw size={20} />
                        Retry Payment
                    </Link>

                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 rounded-xl bg-slate-700 px-4 py-4 text-center font-semibold text-white transition hover:bg-slate-600"
                    >
                        <Home size={20} />
                        Go Home
                    </Link>

                    <button
                        onClick={() =>
                            alert("Support system will be integrated later.")
                        }
                        className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-4 text-center font-semibold text-white transition hover:bg-emerald-700"
                    >
                        <Headphones size={20} />
                        Contact Support
                    </button>

                </div>

                {/* Footer */}

                <div className="mt-8 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-center sm:mt-10 sm:p-6">

                    <p className="text-sm leading-7 text-red-300 sm:text-base">
                        If money was deducted from your account,
                        it will usually be refunded automatically within
                        <span className="font-semibold text-white">
                            {" "}5–7 business days{" "}
                        </span>
                        depending on your bank's processing time.
                    </p>

                </div>

            </div>

        </section>
    );
}