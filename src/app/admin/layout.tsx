"use client";

import { useState } from "react";
import type { ReactNode } from "react";

import AdminSidebar from "@/components/admin/dashboard/AdminSidebar";
import AdminHeader from "@/components/admin/dashboard/AdminHeader";

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false)

    return (
        <div className="min-h-screen bg-slate-100">

            {/* Mobile Overlay */}

            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}

            <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            {/* Main */}

            <div className="flex min-h-screen flex-col lg:ml-72">

                <AdminHeader setSidebarOpen={setSidebarOpen} />

                <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">

                    <div className="mx-auto max-w-7xl">

                        {children}

                    </div>

                </main>

            </div>

        </div>
    );
}