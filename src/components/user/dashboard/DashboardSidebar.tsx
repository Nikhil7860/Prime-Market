"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Wallet, Receipt, MapPin, User, Settings, LogOut, Headphones } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { logout } from "@/redux/auth/authSlice";
import axios from "axios";

interface Props {
    mobile?: boolean;
}

const menu = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Orders",
        href: "/dashboard/orders",
        icon: ShoppingBag,
    },
    {
        title: "Wallet",
        href: "/dashboard/wallet",
        icon: Wallet,
    },
    {
        title: "Transactions",
        href: "/dashboard/transactions",
        icon: Receipt,
    },
    // {
    //     title: "Addresses",
    //     href: "/dashboard/address",
    //     icon: MapPin,
    // },
    {
        title: "Profile",
        href: "/dashboard/profile",
        icon: User,
    },
    // {
    //     title: "Settings",
    //     href: "/dashboard/settings",
    //     icon: Settings,
    // },
];

export default function DashboardSidebar({ mobile = false }: Props) {
    const pathname = usePathname();
    const router = useRouter();

    const auth: any = useAppSelector((state) => state.auth);

    const dispatch = useAppDispatch();

    const handleLogout = async () => {
        try {
            await axios.post("/api/auth/logout", {}, { headers: { Authorization: `Bearer ${auth.accessToken}` } });
            router.push("/login");
            dispatch(logout());
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <div className={`flex h-full flex-col ${mobile ? "p-5" : "p-8"}`}>
            {/* USER */}
            <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-[#121d31] p-6">
                <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 text-2xl font-bold">{auth?.user?.name[0]}</div>
                    <div>
                        <h2 className="text-lg font-bold">{auth?.user?.name}</h2>
                        <p className="text-sm text-slate-400">{auth?.user?.email}</p>
                    </div>
                </div>
            </div>

            {/* MENU */}

            <div className="mt-8 flex-1">
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">MENU</p>
                <div className="space-y-2">
                    {menu.map((item) => {
                        const Icon = item.icon;
                        const active = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`group flex items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-300
                                ${active
                                        ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/20"
                                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                    }`}
                            >
                                <Icon size={20} />

                                <span className="font-medium">

                                    {item.title}

                                </span>

                            </Link>
                        );
                    })}

                </div>
            </div>

            {/* LOGOUT */}

            <button className="mt-8 flex items-center justify-center gap-3 rounded-2xl bg-red-600 py-4 font-semibold transition hover:bg-red-700" onClick={handleLogout}>

                <LogOut size={20} />

                Logout

            </button>

            {/* HELP CARD */}

            <div className="mt-8 rounded-3xl border border-slate-800 bg-gradient-to-br from-[#111827] to-[#17233b] p-6">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600">

                    <Headphones size={26} />

                </div>

                <h3 className="mt-5 text-xl font-bold">

                    Need Help?

                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">

                    We're available 24/7 to help with your
                    orders, payments and account.

                </p>

                <button className="mt-6 w-full rounded-xl border border-indigo-500 py-3 font-semibold text-indigo-400 transition hover:bg-indigo-600 hover:text-white">

                    Contact Support

                </button>

            </div>
        </div>
    );
}