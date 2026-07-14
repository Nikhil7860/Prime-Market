"use client";

import { useState } from "react";
import {
    User,
    Mail,
    Phone,
    Shield,
    Calendar,
    Edit,
    Lock,
} from "lucide-react";

import { useAppSelector } from "@/hooks/redux";

export default function Profile() {
    const user = useAppSelector(
        (state: any) => state.auth.user
    );

    const [loading] = useState(false);

    const initials =
        user?.name
            ?.split(" ")
            ?.map((word: string) => word[0])
            ?.join("")
            ?.toUpperCase()
            ?.slice(0, 2) || "U";

    return (
        <div className="space-y-8">

            {/* Header */}

            <div>
                <h1 className="text-3xl font-bold text-white">
                    My Profile
                </h1>

                <p className="mt-2 text-slate-400">
                    Manage your personal information
                </p>
            </div>

            {/* Profile Card */}

            <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-xl">

                {/* Banner */}

                <div className="h-36 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />

                {/* Avatar */}

                <div className="-mt-16 flex justify-center">
                    <div className="flex h-32 w-32 items-center justify-center rounded-full border-8 border-slate-900 bg-blue-600 text-4xl font-bold text-white shadow-lg">
                        {initials}
                    </div>
                </div>

                <div className="p-8">

                    {/* Name */}

                    <div className="text-center">

                        <h2 className="text-3xl font-bold text-white">
                            {user?.name}
                        </h2>

                        <span className="mt-3 inline-flex rounded-full bg-green-500/20 px-4 py-2 text-sm font-semibold capitalize text-green-400">
                            {user?.role}
                        </span>

                    </div>

                    {/* Info */}

                    <div className="mt-10 grid gap-6 md:grid-cols-2">

                        <div className="flex items-center gap-4 rounded-2xl bg-slate-800 p-5">

                            <Mail
                                className="text-blue-400"
                                size={24}
                            />

                            <div>

                                <p className="text-sm text-slate-400">
                                    Email
                                </p>

                                <h3 className="font-medium text-white">
                                    {user?.email}
                                </h3>

                            </div>

                        </div>

                        <div className="flex items-center gap-4 rounded-2xl bg-slate-800 p-5">

                            <Phone
                                className="text-green-400"
                                size={24}
                            />

                            <div>

                                <p className="text-sm text-slate-400">
                                    Phone
                                </p>

                                <h3 className="font-medium text-white">
                                    {user?.phone || "Not Available"}
                                </h3>

                            </div>

                        </div>

                        <div className="flex items-center gap-4 rounded-2xl bg-slate-800 p-5">

                            <Shield
                                className="text-purple-400"
                                size={24}
                            />

                            <div>

                                <p className="text-sm text-slate-400">
                                    Role
                                </p>

                                <h3 className="font-medium capitalize text-white">
                                    {user?.role}
                                </h3>

                            </div>

                        </div>

                        <div className="flex items-center gap-4 rounded-2xl bg-slate-800 p-5">

                            <Calendar
                                className="text-yellow-400"
                                size={24}
                            />

                            <div>

                                <p className="text-sm text-slate-400">
                                    Member Since
                                </p>

                                <h3 className="font-medium text-white">
                                    {user?.createdAt
                                        ? new Date(
                                            user.createdAt
                                        ).toLocaleDateString()
                                        : "N/A"}
                                </h3>

                            </div>

                        </div>

                    </div>

                    {/* Buttons */}

                    <div className="mt-10 flex flex-wrap gap-4">

                        <button
                            disabled={loading}
                            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                        >
                            <Edit size={18} />

                            Edit Profile
                        </button>

                        <button
                            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-6 py-3 font-semibold text-white transition hover:bg-slate-700"
                        >
                            <Lock size={18} />

                            Change Password
                        </button>

                    </div>

                </div>

            </div>

            {/* Account Statistics */}

            <div className="grid gap-6 md:grid-cols-3">

                <div className="rounded-2xl bg-slate-900 p-6 shadow-lg">

                    <User
                        className="mb-3 text-blue-400"
                        size={28}
                    />

                    <h2 className="text-2xl font-bold text-white">
                        Active
                    </h2>

                    <p className="text-slate-400">
                        Account Status
                    </p>

                </div>

                <div className="rounded-2xl bg-slate-900 p-6 shadow-lg">

                    <Shield
                        className="mb-3 text-green-400"
                        size={28}
                    />

                    <h2 className="text-2xl font-bold text-white">
                        Verified
                    </h2>

                    <p className="text-slate-400">
                        Email Verification
                    </p>

                </div>

                <div className="rounded-2xl bg-slate-900 p-6 shadow-lg">

                    <Calendar
                        className="mb-3 text-purple-400"
                        size={28}
                    />

                    <h2 className="text-2xl font-bold text-white">
                        {user?.createdAt
                            ? new Date(
                                user.createdAt
                            ).getFullYear()
                            : "-"}
                    </h2>

                    <p className="text-slate-400">
                        Joined
                    </p>

                </div>

            </div>

        </div>
    );
}