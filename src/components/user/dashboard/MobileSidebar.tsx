"use client";

import { X } from "lucide-react";
import DashboardSidebar from "./DashboardSidebar";

interface Props {
    open: boolean;
    setOpen: (value: boolean) => void;
}

export default function MobileSidebar({
    open,
    setOpen,
}: Props) {
    return (
        <>
            {/* Overlay */}

            <div
                onClick={() => setOpen(false)}
                className={`fixed inset-0 z-40 bg-black/60 transition-all duration-300
                ${open
                        ? "visible opacity-100"
                        : "invisible opacity-0"
                    }`}
            />

            {/* Drawer */}

            <div
                className={`fixed left-0 top-0 z-50 h-screen w-[320px] bg-[#0B1220] transition-transform duration-300 lg:hidden
                ${open
                        ? "translate-x-0"
                        : "-translate-x-full"
                    }`}
            >
                <div className="flex items-center justify-between border-b border-slate-800 p-5">

                    <h2 className="text-xl font-bold">

                        My Store

                    </h2>

                    <button
                        onClick={() => setOpen(false)}
                    >
                        <X />
                    </button>

                </div>

                <DashboardSidebar mobile />

            </div>
        </>
    );
}