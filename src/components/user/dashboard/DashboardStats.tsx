"use client";

import {
    ShoppingBag,
    CheckCircle2,
    Clock3,
    CreditCard,
} from "lucide-react";

interface Props {
    totalOrders: number;
    delivered: number;
    pending: number;
    totalSpent: number;
}

export default function StatsCards({
    totalOrders,
    delivered,
    pending,
    totalSpent,
}: Props) {
    const cards = [
        {
            title: "Total Orders",
            value: totalOrders,
            subtitle: "All time orders",
            icon: ShoppingBag,
            color: "bg-indigo-600",
        },
        {
            title: "Delivered",
            value: delivered,
            subtitle: "Successfully delivered",
            icon: CheckCircle2,
            color: "bg-green-600",
        },
        {
            title: "Pending",
            value: pending,
            subtitle: "Awaiting processing",
            icon: Clock3,
            color: "bg-amber-500",
        },
        {
            title: "Total Spent",
            value: `₹${totalSpent}`,
            subtitle: "All time amount",
            icon: CreditCard,
            color: "bg-violet-600",
        },
    ];

    return (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

            {cards.map((card) => {

                const Icon = card.icon;

                return (

                    <div
                        key={card.title}
                        className="group rounded-3xl border border-slate-800 bg-[#111827] p-6 transition-all duration-300 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-600/10"
                    >

                        <div className="flex items-start justify-between">

                            <div>

                                <p className="text-sm text-slate-400">

                                    {card.title}

                                </p>

                                <h2 className="mt-4 text-4xl font-bold text-white">

                                    {card.value}

                                </h2>

                                <p className="mt-4 text-sm text-slate-500">

                                    {card.subtitle}

                                </p>

                            </div>

                            <div
                                className={`rounded-2xl ${card.color} p-4`}
                            >

                                <Icon
                                    size={28}
                                    className="text-white"
                                />

                            </div>

                        </div>

                    </div>

                );
            })}

        </div>
    );
}