"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function RevenueChart(data: any) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

            <div className="mb-6 flex items-center justify-between">

                <div>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Revenue Analytics
                    </h2>

                    <p className="text-slate-500">
                        Monthly Revenue & Orders
                    </p>

                </div>

            </div>

            <div className="h-[420px]">

                <ResponsiveContainer width="100%" height="100%">

                    <LineChart data={data.data}>

                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="month" />

                        <YAxis />

                        <Tooltip />

                        <Legend />

                        <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#2563eb"
                            strokeWidth={4}
                            activeDot={{
                                r: 8,
                            }}
                        />

                        <Line
                            type="monotone"
                            dataKey="orders"
                            stroke="#16a34a"
                            strokeWidth={4}
                        />

                    </LineChart>

                </ResponsiveContainer>

            </div>

        </div>
    );
}