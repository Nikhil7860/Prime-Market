"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Bell,
    Search,
    ChevronDown,
    User,
    LogOut,
    Menu,
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { logout } from "@/redux/auth/authSlice";
import axios from "axios";

interface AdminHeaderProps {
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AdminHeader({
    setSidebarOpen,
}: AdminHeaderProps) {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const auth: any = useAppSelector((state) => state.auth);

    const [isOpen, setIsOpen] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post("/api/auth/logout", {}, { headers: { Authorization: `Bearer ${auth.accessToken}` } });
            dispatch(logout());
            router.push("/login");
        } catch (error) {
            console.error(error);
        }
    };

    const initials =
        auth.userDetails?.name
            ?.split(" ")
            .map((word: string) => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2) || "AD";

    return (
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-black px-4 sm:px-6 lg:px-8">

            {/* Left Section */}
            <div className="flex items-center gap-4">

                {/* Mobile Menu */}
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="rounded-lg p-2 transition hover:bg-slate-100 lg:hidden"
                >
                    <Menu size={24} />
                </button>

                {/* Search */}
                <div className="relative hidden md:block">

                    <Search
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                    />

                    <input
                        type="text"
                        placeholder="Search products, users, orders..."
                        className="w-72 rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 lg:w-96"
                    />

                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3 sm:gap-5">

                {/* Mobile Search */}
                <button className="rounded-lg p-2 hover:bg-slate-100 md:hidden">
                    <Search size={22} />
                </button>

                {/* Notifications */}
                <button className="relative rounded-xl bg-slate-100 p-2.5 transition hover:bg-slate-200">

                    <Bell size={20} />

                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>

                </button>

                {/* Profile */}
                <div
                    className="relative"
                    ref={dropdownRef}
                >

                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-slate-100 sm:px-3"
                    >

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                            {initials}
                        </div>

                        <div className="hidden text-left lg:block">

                            <p className="font-semibold text-slate-800">
                                {auth.userDetails?.name || "Admin"}
                            </p>

                            <p className="text-xs text-slate-500 truncate max-w-[180px]">
                                {auth.userDetails?.email}
                            </p>

                        </div>

                        <ChevronDown
                            size={18}
                            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                                }`}
                        />

                    </button>

                    {isOpen && (

                        <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

                            <div className="border-b border-slate-100 px-5 py-4">

                                <p className="font-semibold text-slate-800">
                                    {auth.userDetails?.name || "Admin"}
                                </p>

                                <p className="break-all text-sm text-slate-500">
                                    {auth.userDetails?.email}
                                </p>

                            </div>

                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    router.push("/admin/profile");
                                }}
                                className="flex w-full items-center gap-3 px-5 py-3 text-sm text-red-600 transition hover:bg-red-50"
                            >
                                <User size={18} />
                                Profile
                            </button>

                            <button
                                onClick={handleLogout}
                                className="flex w-full items-center gap-3 px-5 py-3 text-sm text-red-600 transition hover:bg-red-50"
                            >
                                <LogOut size={18} />
                                Logout
                            </button>

                        </div>

                    )}

                </div>

            </div>
        </header>
    );
}