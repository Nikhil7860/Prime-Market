"use client";

import { useEffect, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Clock3, Wallet } from "lucide-react";

import { getRequest } from "@/services/apiMethods";
import { useAppSelector } from "@/hooks/redux";
import { getTransactionById } from "@/services/transaction.service";

interface Transaction {
    _id: string;
    amount: number;
    type: "credit" | "debit";
    description: string;
    status: "success" | "pending" | "failed";
    createdAt: string;
}

export default function Transactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const userDetails = useAppSelector((state: any) => state.auth.user);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const data: any = await getTransactionById(userDetails._id)

            setTransactions(Array.isArray(data) ? data : data.transactions || []);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="space-y-8">

            {/* Heading */}

            <div>

                <h1 className="text-3xl font-bold text-white">
                    Transactions
                </h1>

                <p className="mt-2 text-slate-400">
                    View all wallet transactions.
                </p>

            </div>

            {transactions.length === 0 ? (
                <div className="flex h-80 flex-col items-center justify-center rounded-3xl bg-slate-900">

                    <Wallet
                        size={70}
                        className="mb-5 text-slate-500"
                    />

                    <h2 className="text-2xl font-bold text-white">
                        No Transactions Found
                    </h2>

                    <p className="mt-2 text-slate-400">
                        Your wallet activity will appear here.
                    </p>

                </div>
            ) : (
                <div className="space-y-5">

                    {transactions.map((transaction) => (
                        <div
                            key={transaction._id}
                            className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-blue-500"
                        >

                            {/* Left */}

                            <div className="flex items-center gap-5">

                                <div
                                    className={`rounded-full p-3 ${transaction.type === "credit"
                                        ? "bg-green-500/20"
                                        : "bg-red-500/20"
                                        }`}
                                >
                                    {transaction.type === "credit" ? (
                                        <ArrowDownLeft
                                            className="text-green-400"
                                            size={24}
                                        />
                                    ) : (
                                        <ArrowUpRight
                                            className="text-red-400"
                                            size={24}
                                        />
                                    )}
                                </div>

                                <div>

                                    <h3 className="font-semibold text-white">
                                        {transaction.description}
                                    </h3>

                                    <div className="mt-1 flex items-center gap-2 text-sm text-slate-400">

                                        <Clock3 size={14} />

                                        {new Date(
                                            transaction.createdAt
                                        ).toLocaleString()}

                                    </div>

                                </div>

                            </div>

                            {/* Right */}

                            <div className="text-right">

                                <h2
                                    className={`text-2xl font-bold ${transaction.type === "credit"
                                        ? "text-green-400"
                                        : "text-red-400"
                                        }`}
                                >
                                    {transaction.type === "credit"
                                        ? "+"
                                        : "-"}
                                    ₹
                                    {transaction.amount.toLocaleString()}
                                </h2>

                                <span
                                    className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${transaction.status === "success"
                                        ? "bg-green-500/20 text-green-400"
                                        : transaction.status ===
                                            "pending"
                                            ? "bg-yellow-500/20 text-yellow-400"
                                            : "bg-red-500/20 text-red-400"
                                        }`}
                                >
                                    {transaction.status}
                                </span>

                            </div>

                        </div>
                    ))}

                </div>
            )}
        </div>
    );
}