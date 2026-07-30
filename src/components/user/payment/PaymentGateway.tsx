"use client";

import { useState } from "react";
import {
    CreditCard,
    Smartphone,
    Landmark,
    Wallet,
    Loader2,
    CheckCircle2,
    XCircle,
} from "lucide-react";

interface PaymentGatewayProps {
    amount: number;
    orderId: string;
    onSuccess: (method: string, transactionId: string) => void;
    onFailure: (method: string) => void;
}

export default function PaymentGateway({ amount, orderId, onSuccess, onFailure }: PaymentGatewayProps) {
    const [selectedMethod, setSelectedMethod] = useState("UPI");

    const [processing, setProcessing] = useState(false);

    const paymentMethods = [
        {
            name: "UPI",
            icon: Smartphone,
        },
        {
            name: "Card",
            icon: CreditCard,
        },
        {
            name: "NetBanking",
            icon: Landmark,
        },
        {
            name: "COD",
            icon: Landmark,
        },
        {
            name: "Wallet",
            icon: Wallet,
        },
    ];

    const processPayment = async (
        success: boolean
    ) => {
        setProcessing(true);

        // Simulate gateway processing
        await new Promise((resolve) =>
            setTimeout(resolve, 2000)
        );

        const transactionId = `TXN_${Date.now()}_${Math.floor(
            Math.random() * 100000
        )}`;

        setProcessing(false);

        if (success) {
            onSuccess(selectedMethod, transactionId);
        } else {
            onFailure(selectedMethod);
        }
    };

    return (
        <div className="rounded-3xl bg-slate-900 p-8 shadow-xl">

            <div className="mb-8 text-center">

                <h1 className="text-3xl font-bold text-white">
                    Payment Gateway
                </h1>

                <p className="mt-2 text-slate-400">
                    Simulating Razorpay / Stripe
                </p>

            </div>

            <div className="mb-8 rounded-xl bg-slate-800 p-6">

                <div className="flex justify-between">

                    <span className="text-slate-400">
                        Order ID
                    </span>

                    <span className="font-semibold text-white">
                        {orderId}
                    </span>

                </div>

                <div className="mt-4 flex justify-between">

                    <span className="text-slate-400">
                        Amount
                    </span>

                    <span className="text-2xl font-bold text-blue-400">
                        ₹{amount.toLocaleString()}
                    </span>

                </div>

            </div>

            <h2 className="mb-4 text-xl font-semibold text-white">
                Select Payment Method
            </h2>

            <div className="space-y-4">

                {paymentMethods.map((method) => {

                    const Icon = method.icon;

                    return (
                        <label
                            key={method.name}
                            className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${selectedMethod === method.name ? "border-blue-500 bg-blue-500/10" : "border-slate-700"}`}>
                            <input type="radio" name="paymentMethod" checked={selectedMethod === method.name} onChange={() => setSelectedMethod(method.name)} />

                            <Icon className="text-blue-500" size={22} />

                            <span className="text-white">{method.name}</span>

                        </label>
                    );
                })}

            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2">

                <button
                    disabled={processing}
                    onClick={() =>
                        processPayment(true)
                    }
                    className="flex items-center justify-center gap-3 rounded-xl bg-green-600 py-4 font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
                >
                    {processing ? (
                        <>
                            <Loader2
                                className="animate-spin"
                                size={20}
                            />
                            Processing...
                        </>
                    ) : (
                        <>
                            <CheckCircle2
                                size={20}
                            />
                            Simulate Success
                        </>
                    )}
                </button>

                <button
                    disabled={processing}
                    onClick={() =>
                        processPayment(false)
                    }
                    className="flex items-center justify-center gap-3 rounded-xl bg-red-600 py-4 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                >
                    {processing ? (
                        <>
                            <Loader2
                                className="animate-spin"
                                size={20}
                            />
                            Processing...
                        </>
                    ) : (
                        <>
                            <XCircle size={20} />
                            Simulate Failure
                        </>
                    )}
                </button>

            </div>

            <div className="mt-8 rounded-xl border border-yellow-600 bg-yellow-500/10 p-4">

                <p className="text-sm text-yellow-300">
                    This is a mock payment gateway used for
                    development. Later, it can be replaced with
                    Razorpay or Stripe without changing the
                    checkout flow.
                </p>

            </div>

        </div>
    );
}