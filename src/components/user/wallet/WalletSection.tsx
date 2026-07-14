"use client";

import { Wallet, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { useAppSelector } from "@/hooks/redux";
import { useEffect, useState } from "react";
import { getWalletBalance } from "@/services/wallet.service";
import { useRouter } from "next/navigation";
import { getTransactionById } from "@/services/transaction.service";

interface WalletSectionProps {
    onAddMoney: () => void;
    onWithdraw: () => void;
}

export default function WalletSection({ onAddMoney, onWithdraw }: WalletSectionProps) {
    const userDetails = useAppSelector((state: any) => state.auth.user);

    const [walletBalance, setwalletBalance] = useState<any>()
    const [Transactions, setTransactions] = useState<any>()

    const fetchWalletBalance = async (id: string) => {
        try {
            let walletBalanceResp: any = await getWalletBalance(id)
            setwalletBalance(walletBalanceResp.balance)
        } catch (error) {
            console.log(error, "In the Error fetchWalletBalance")
        }
    }


    const fetchTransactions = async (id: string) => {
        try {
            let TransactionsResp = await getTransactionById(id)
            setTransactions(TransactionsResp)
        } catch (error) {
            console.log(error, "In the Error fetchTransactions")
        }
    }

    useEffect(() => {
        fetchWalletBalance(userDetails?._id)
        fetchTransactions(userDetails?._id)
    }, [userDetails?._id])




    return (
        <div className="space-y-8">

            <div>

                <h1 className="text-3xl font-bold text-white">
                    Wallet
                </h1>

                <p className="mt-2 text-slate-400">
                    Manage your wallet balance.
                </p>

            </div>

            {/* Balance Card */}

            <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 shadow-xl">

                <div className="flex items-center justify-between">

                    <div>

                        <p className="text-white/80">
                            Current Balance
                        </p>

                        <h2 className="mt-3 text-5xl font-bold text-white">
                            ₹{walletBalance}
                        </h2>

                    </div>

                    <Wallet
                        className="text-white"
                        size={70}
                    />

                </div>

                <div className="mt-10 flex gap-4">

                    <button
                        onClick={onAddMoney}
                        className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 transition hover:scale-105"
                    >
                        <ArrowDownCircle size={20} />

                        Add Money
                    </button>

                    <button
                        onClick={onWithdraw}
                        className="flex items-center gap-2 rounded-xl border border-white px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-blue-700"
                    >
                        <ArrowUpCircle size={20} />

                        Withdraw
                    </button>

                </div>

            </div>

            {/* Recent Activity */}

            <div className="rounded-3xl bg-slate-900 p-6">
                <h2 className="mb-6 text-xl font-semibold text-white">
                    Recent Wallet Activity
                </h2>

                <div className="space-y-4">
                    {Transactions?.length === 0 ? (
                        <div className="rounded-xl bg-slate-800 py-10 text-center text-slate-400">
                            No wallet activity found.
                        </div>
                    ) : (
                        Transactions?.map((transaction: any) => {
                            const isCredit =
                                transaction.type === "deposit" ||
                                transaction.type === "refund";

                            return (
                                <div
                                    key={transaction._id}
                                    className="flex items-center justify-between rounded-xl bg-slate-800 p-4 transition-all duration-300 hover:bg-slate-700"
                                >
                                    <div>
                                        <p className="font-medium capitalize text-white">
                                            {transaction.description}
                                        </p>

                                        <div className="mt-1 flex items-center gap-3">
                                            <span className="text-sm text-slate-400">
                                                {new Date(
                                                    transaction.createdAt
                                                ).toLocaleString("en-IN", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>

                                            <span
                                                className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${transaction.status === "success"
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

                                    <div className="text-right">
                                        <p
                                            className={`text-lg font-semibold ${isCredit
                                                ? "text-green-400"
                                                : "text-red-400"
                                                }`}
                                        >
                                            {isCredit ? "+" : "-"} ₹
                                            {transaction.amount.toLocaleString(
                                                "en-IN"
                                            )}
                                        </p>

                                        <p className="text-xs capitalize text-slate-400">
                                            {transaction.type}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

        </div>
    );
}