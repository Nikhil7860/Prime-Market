"use client";

import { ChevronDown } from "lucide-react";

export default function OrdersToolbar() {
    return (
        <div className="mt-12 mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex gap-4">

                <button className="flex items-center gap-3 rounded-xl border border-slate-700 bg-[#111827] px-5 py-3 text-slate-300 hover:border-indigo-500">

                    All Orders

                    <ChevronDown size={18} />

                </button>

                <button className="flex items-center gap-3 rounded-xl border border-slate-700 bg-[#111827] px-5 py-3 text-slate-300 hover:border-indigo-500">

                    Latest

                    <ChevronDown size={18} />

                </button>

            </div>

        </div>
    );
}