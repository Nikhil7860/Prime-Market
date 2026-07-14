"use client";

import {
    DollarSign,
    ShoppingBag,
    Users,
    Package,
    TrendingUp,
} from "lucide-react";

interface DashboardStatsProps {
    stats: {
        revenue: number;
        orders: number;
        users: number;
        products: number;
    };
}

export default function DashboardStats({
    stats,
}: DashboardStatsProps) {
    const cards = [
        {
            title: "Total Revenue",
            value: `₹${stats.revenue.toLocaleString()}`,
            icon: DollarSign,
            color: "bg-green-500",
            light: "bg-green-100",
            change: "+12%",
        },
        {
            title: "Total Orders",
            value: stats.orders,
            icon: ShoppingBag,
            color: "bg-blue-500",
            light: "bg-blue-100",
            change: "+8%",
        },
        {
            title: "Total Users",
            value: stats.users,
            icon: Users,
            color: "bg-purple-500",
            light: "bg-purple-100",
            change: "+18%",
        },
        {
            title: "Products",
            value: stats.products,
            icon: Package,
            color: "bg-orange-500",
            light: "bg-orange-100",
            change: "+3%",
        },
    ];

    return (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => {
                const Icon = card.icon;

                return (
                    <div
                        key={card.title}
                        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">
                                    {card.title}
                                </p>

                                <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                                    {card.value}
                                </h2>
                            </div>

                            <div
                                className={`rounded-xl p-4 ${card.light}`}
                            >
                                <Icon
                                    className={card.color.replace(
                                        "bg",
                                        "text"
                                    )}
                                    size={28}
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex items-center gap-2 text-sm text-green-600">
                            <TrendingUp size={16} />

                            <span>{card.change}</span>

                            <span className="text-slate-500">
                                this month
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}