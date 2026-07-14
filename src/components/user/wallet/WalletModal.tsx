"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { depositMoney, getWalletBalance } from "@/services/wallet.service";
import { useAppSelector } from "@/hooks/redux";

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function WalletModal({ open, onClose }: Props) {

    const userDetails = useAppSelector((state: any) => state.auth.user);


    const [amount, setAmount] = useState("0");

    if (!open) return null;

    const handleSubmit = async () => {

        // console.log(amount);

        let reponse = await depositMoney({ amount: parseInt(amount), userId: userDetails._id })

        console.log(reponse, "in the reponse of deposit Money")

        await getWalletBalance(userDetails._id)
        onClose();
    };

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">

            <div className="w-full max-w-md rounded-3xl bg-slate-900 p-8">

                <div className="mb-6 flex items-center justify-between">

                    <h2 className="text-2xl font-bold text-white">Add Money</h2>

                    <button onClick={onClose}><X className="text-white" /></button>

                </div>

                <input
                    type="number"
                    placeholder="Enter Amount"
                    value={amount}
                    onChange={(e) =>
                        setAmount(e.target.value)
                    }
                    className="mb-6 w-full rounded-xl border border-slate-700 bg-slate-800 p-4 text-white outline-none"
                />

                <button onClick={handleSubmit} className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700">
                    Add Money
                </button>

            </div>

        </div>

    );
}