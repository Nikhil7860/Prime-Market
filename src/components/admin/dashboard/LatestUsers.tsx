"use client";

import Link from "next/link";
import {
    ArrowRight,
    UserCheck,
    UserX,
    ShieldCheck,
    User,
} from "lucide-react";

interface DashboardUser {
    _id: string;
    name: string;
    email: string;
    role: "admin" | "user";
    status: "Active" | "Blocked";
    joinedAt: string;
}

// const users: DashboardUser[] = [
//     {
//         _id: "1",
//         name: "Nikhil Arora",
//         email: "nikhil@gmail.com",
//         role: "admin",
//         status: "Active",
//         joinedAt: "28 Jun 2026",
//     },
//     {
//         _id: "2",
//         name: "Rahul Sharma",
//         email: "rahul@gmail.com",
//         role: "user",
//         status: "Active",
//         joinedAt: "27 Jun 2026",
//     },
//     {
//         _id: "3",
//         name: "Priya Gupta",
//         email: "priya@gmail.com",
//         role: "user",
//         status: "Blocked",
//         joinedAt: "26 Jun 2026",
//     },
//     {
//         _id: "4",
//         name: "Amit Kumar",
//         email: "amit@gmail.com",
//         role: "user",
//         status: "Active",
//         joinedAt: "25 Jun 2026",
//     },
//     {
//         _id: "5",
//         name: "John Doe",
//         email: "john@gmail.com",
//         role: "user",
//         status: "Active",
//         joinedAt: "24 Jun 2026",
//     },
// ];

function getStatusColor(status: string) {
    return status === "Active"
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700";
}

function getRoleColor(role: string) {
    return role === "admin"
        ? "bg-purple-100 text-purple-700"
        : "bg-blue-100 text-blue-700";
}

export default function LatestUsers(users: any) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

            <div className="flex items-center justify-between border-b border-slate-200 p-6 dark:border-slate-700">

                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Latest Users
                    </h2>

                    <p className="text-sm text-slate-500">
                        Recently joined customers
                    </p>
                </div>

                <Link
                    href="/admin/users"
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                >
                    View All

                    <ArrowRight size={18} />
                </Link>

            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">

                {users.users.map((user: any) => (

                    <div
                        key={user._id}
                        className="flex items-center justify-between p-5 transition hover:bg-slate-50 dark:hover:bg-slate-800"
                    >

                        <div className="flex items-center gap-4">

                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white font-bold">

                                {user.name
                                    .split(" ")
                                    .map((word: any) => word[0])
                                    .join("")
                                    .slice(0, 2)}

                            </div>

                            <div>

                                <h3 className="font-semibold text-slate-900 dark:text-white">
                                    {user.name}
                                </h3>

                                <p className="text-sm text-slate-500">
                                    {user.email}
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                    Joined {user.joinedAt}
                                </p>

                            </div>

                        </div>

                        <div className="flex items-center gap-3">

                            <span
                                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${getRoleColor(
                                    user.role
                                )}`}
                            >
                                {user.role === "admin" ? (
                                    <ShieldCheck size={14} />
                                ) : (
                                    <User size={14} />
                                )}

                                {user.role}
                            </span>

                            <span
                                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                                    user.status
                                )}`}
                            >
                                {user.status === "Active" ? (
                                    <UserCheck size={14} />
                                ) : (
                                    <UserX size={14} />
                                )}

                                {user.status}
                            </span>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
}