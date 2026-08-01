"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/user/dashboard/DashboardSidebar";
import MobileSidebar from "@/components/user/dashboard/MobileSidebar";
import DashboardNavbar from "@/components/user/dashboard/DashboardNavbar";
import { SocketProvider } from "@/providers/SocketProvider";

interface Props {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#070B14] text-white">

            <DashboardNavbar open={open} setOpen={setOpen} />

            <MobileSidebar open={open} setOpen={setOpen} />

            <div className="mx-auto flex max-w-[1700px]">

                {/* Desktop Sidebar */}

                <aside className="hidden w-[300px] border-r border-slate-800 bg-[#0B1220] lg:block">

                    <DashboardSidebar />

                </aside>

                {/* Content */}

                <main className="flex-1 p-4 md:p-8">
                    <SocketProvider>
                        {children}
                    </SocketProvider>
                </main>

            </div>

        </div>
    );
}