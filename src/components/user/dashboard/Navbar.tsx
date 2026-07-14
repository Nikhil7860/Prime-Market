"use client";

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

import { getRequest, postRequest } from "@/services/apiMethods";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { logout } from "@/redux/auth/authSlice";
import axios from "axios";

export default function Navbar() {
    const router = useRouter();

    const dispatch = useAppDispatch();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const auth: any = useAppSelector((state) => state.auth);

    const cart = useAppSelector((state) => state.cart);

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
        <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/95 backdrop-blur-lg">

            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

                {/* Logo */}

                <Link
                    href="/"
                    className="text-2xl font-bold text-white"
                >
                    🛍️ PrimeMarket
                </Link>

                {/* Search */}

                <div className="hidden w-full max-w-md lg:block">

                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-blue-500"
                    />

                </div>

                {/* Desktop Navigation */}

                <div className="hidden items-center gap-6 md:flex">

                    {!auth.isLoggedIn ? (
                        <>
                            <Link
                                href="/login"
                                className="text-white transition hover:text-blue-400"
                            >
                                Login
                            </Link>

                            <Link
                                href="/register"
                                className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700"
                            >
                                Register
                            </Link>
                        </>
                    ) : (
                        <>

                            {/* Cart */}

                            <Link
                                href="/cart"
                                className="relative text-2xl"
                            >
                                🛒

                                {cart.products.length > 0 && (
                                    <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs text-white">
                                        {cart.products.length}
                                    </span>
                                )}

                            </Link>

                            {/* Dashboard */}

                            <Link
                                href={
                                    auth.user?.role === "admin"
                                        ? "/admin/dashboard"
                                        : "/dashboard"
                                }
                                className="text-white transition hover:text-blue-400"
                            >
                                Dashboard
                            </Link>

                            {/* Profile */}

                            <div className="group relative">

                                <div className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-blue-600 font-bold text-white">

                                    {auth.user?.name
                                        ?.split(" ")
                                        .map((word: string) => word[0])
                                        .join("")
                                        .toUpperCase()
                                        .slice(0, 2)}

                                </div>

                                <div className="invisible absolute right-0 mt-3 w-64 rounded-xl border border-slate-700 bg-slate-900 p-4 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:opacity-100">

                                    <div className="mb-4">

                                        <h3 className="font-semibold text-white">
                                            {auth.user?.name}
                                        </h3>

                                        <p className="text-sm text-gray-400">
                                            {auth.user?.email}
                                        </p>

                                    </div>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full rounded-lg bg-red-500 py-2 font-medium text-white transition hover:bg-red-600"
                                    >
                                        Logout
                                    </button>

                                </div>

                            </div>

                        </>
                    )}

                </div>

                {/* Mobile Hamburger */}

                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="rounded-lg p-2 text-white transition hover:bg-slate-800 md:hidden"
                >
                    {mobileMenuOpen ? (
                        <X size={30} />
                    ) : (
                        <Menu size={30} />
                    )}
                </button>

            </div>

            {/* Mobile Menu */}

            {mobileMenuOpen && (
                <div className="border-t border-slate-800 bg-slate-900 md:hidden">
                    <div className="space-y-2 p-5">

                        {!auth.isLoggedIn ? (
                            <>
                                <Link
                                    href="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block rounded-lg px-4 py-3 text-white transition hover:bg-slate-800"
                                >
                                    Login
                                </Link>

                                <Link
                                    href="/register"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block rounded-lg bg-blue-600 px-4 py-3 text-center font-medium text-white transition hover:bg-blue-700"
                                >
                                    Register
                                </Link>
                            </>
                        ) : (
                            <>
                                {/* User */}

                                <div className="mb-4 rounded-xl border border-slate-700 bg-slate-800 p-4">

                                    <div className="mb-3 flex items-center gap-3">

                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                                            {auth.user?.name
                                                ?.split(" ")
                                                .map((word: string) => word[0])
                                                .join("")
                                                .toUpperCase()
                                                .slice(0, 2)}
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-white">
                                                {auth.user?.name}
                                            </h3>

                                            <p className="text-sm text-slate-400">
                                                {auth.user?.email}
                                            </p>
                                        </div>

                                    </div>

                                </div>

                                {/* Cart */}

                                <Link
                                    href="/cart"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center justify-between rounded-lg px-4 py-3 text-white transition hover:bg-slate-800"
                                >
                                    <span className="flex items-center gap-2">
                                        🛒 Cart
                                    </span>

                                    {cart.products.length > 0 && (
                                        <span className="rounded-full bg-red-500 px-2 py-1 text-xs font-semibold">
                                            {cart.products.length}
                                        </span>
                                    )}
                                </Link>

                                {/* Dashboard */}

                                <Link
                                    href={
                                        auth.user?.role === "admin"
                                            ? "/admin/dashboard"
                                            : "/dashboard"
                                    }
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block rounded-lg px-4 py-3 text-white transition hover:bg-slate-800"
                                >
                                    Dashboard
                                </Link>

                                {/* Logout */}

                                <button
                                    onClick={handleLogout}
                                    className="mt-2 w-full rounded-lg bg-red-500 py-3 font-semibold text-white transition hover:bg-red-600"
                                >
                                    Logout
                                </button>
                            </>
                        )}

                    </div>
                </div>
            )}

        </nav>

    );
}