"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { Menu, ChevronDown, User, LogOut } from "lucide-react";
import axios from "axios";
import { logout } from "@/redux/auth/authSlice";

interface Props {
    open: boolean;
    setOpen: (value: boolean) => void;
}

export default function DashboardNavbar({ setOpen }: Props) {
    const router = useRouter();

    const auth: any = useAppSelector((state) => state.auth);

    const [showDropdown, setShowDropdown] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    const dispatch = useAppDispatch();


    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setShowDropdown(false);
            }
        }

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
    return (
        <header className="sticky top-0 z-40 border-b border-slate-800 bg-[#070B14]/90 backdrop-blur">

            <div className="mx-auto flex h-20 max-w-[1700px] items-center justify-between px-4 md:px-8">

                {/* LEFT */}

                <div className="flex items-center gap-4">

                    <button onClick={() => setOpen(true)} className="rounded-lg p-2 hover:bg-slate-800 lg:hidden"><Menu size={24} /></button>

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600">🛍️</div>

                        <div><h2 className="font-bold">My Store</h2></div>

                    </div>

                </div>

                {/* RIGHT */}

                <div className="flex items-center gap-6">

                    {/* <button className="hover:text-indigo-400">

                        <Moon size={22} />

                    </button>

                    <button className="relative hover:text-indigo-400">

                        <Bell size={22} />

                        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs">

                            3

                        </span>

                    </button> */}

                    <div
                        ref={dropdownRef}
                        className="relative"
                    >
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-slate-800"
                        >
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-600 font-bold text-white">
                                {auth.user?.name?.charAt(0)}
                            </div>

                            <div className="hidden text-left md:block">
                                <p className="font-semibold text-white">
                                    {auth.user?.name}
                                </p>

                                <p className="text-xs text-slate-400">
                                    {auth.user?.role}
                                </p>
                            </div>

                            <ChevronDown
                                size={18}
                                className={`hidden transition duration-300 md:block ${showDropdown ? "rotate-180" : ""
                                    }`}
                            />
                        </button>

                        {showDropdown && (
                            <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
                                <button
                                    onClick={() => {
                                        router.push("/dashboard/profile");
                                        setShowDropdown(false);
                                    }}
                                    className="flex w-full items-center gap-3 px-5 py-4 text-left text-white transition hover:bg-slate-800"
                                >
                                    <User size={18} />
                                    <span>Profile</span>
                                </button>

                                <div className="border-t border-slate-700" />

                                <button
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-3 px-5 py-4 text-left text-red-400 transition hover:bg-red-500/10"
                                >
                                    <LogOut size={18} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        )}
                    </div>

                </div>

            </div>

        </header>
    );
}