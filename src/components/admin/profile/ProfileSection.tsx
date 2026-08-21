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
    X,
    Eye,
    EyeOff,
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { postRequest, putRequest } from "@/services/apiMethods";
import { updateUser } from "@/redux/auth/authSlice";

export default function Profile() {

    const user = useAppSelector((state: any) => state.auth.user);

    const dispatch = useAppDispatch();

    const initials =
        user?.name
            ?.split(" ")
            ?.map((word: string) => word[0])
            ?.join("")
            ?.toUpperCase()
            ?.slice(0, 2) || "U";

    /* =====================================================
            MODAL STATES
    ====================================================== */

    const [editModal, setEditModal] = useState(false);
    const [passwordModal, setPasswordModal] =
        useState(false);

    const [loading, setLoading] = useState(false);

    /* =====================================================
            EDIT PROFILE FORM
    ====================================================== */

    const [profileForm, setProfileForm] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
    });

    /* =====================================================
            CHANGE PASSWORD FORM
    ====================================================== */

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);

    const [showNewPassword, setShowNewPassword] = useState(false);

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    /* =====================================================
            HANDLE INPUTS
    ====================================================== */

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProfileForm({
            ...profileForm,
            [e.target.name]: e.target.value,
        });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordForm({
            ...passwordForm,
            [e.target.name]: e.target.value,
        });
    };

    /* =====================================================
            OPEN MODALS
    ====================================================== */

    const openEditModal = () => {
        setProfileForm({
            name: user?.name || "",
            email: user?.email || "",
            phone: user?.phone || "",
        });

        setEditModal(true);
    };

    const openPasswordModal = () => {
        setPasswordForm({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });

        setPasswordModal(true);
    };

    /* =====================================================
        UPDATE PROFILE API
===================================================== */

    const updateProfile = async () => {
        try {
            if (!profileForm.name.trim()) {
                return alert("Name is required.");
            }

            if (!profileForm.email.trim()) {
                return alert("Email is required.");
            }

            if (!profileForm.phone.toString().trim()) {
                return alert("Phone number is required.");
            }

            setLoading(true);

            const response = await putRequest("users/updateUser",
                {
                    id: user._id,
                    name: profileForm.name,
                    email: profileForm.email,
                    phone: profileForm.phone,
                }
            );



            dispatch(updateUser({ userDetails: { name: profileForm.name, email: profileForm.email, phone: profileForm.phone, }, }));

            alert("Profile updated successfully.");

            setEditModal(false);

            // Optional:
            // dispatch(updateUser(response.data));
            // or fetchProfile();

        } catch (error: any) {
            console.log(error);

            alert(
                error?.response?.data?.message ||
                "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    };

    /* =====================================================
            CHANGE PASSWORD API
    ===================================================== */

    const changePassword = async () => {
        try {
            if (!passwordForm.currentPassword) {
                return alert("Current password is required.");
            }

            if (!passwordForm.newPassword) {
                return alert("New password is required.");
            }

            if (passwordForm.newPassword.length < 6) {
                return alert(
                    "Password should be at least 6 characters."
                );
            }

            if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                return alert("Passwords do not match.");
            }

            setLoading(true);

            const response = await postRequest("users/changePassword",
                {
                    id: user._id,
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword,
                }
            );
            
            alert("Password changed successfully.");

            setPasswordModal(false);

            setPasswordForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (error: any) {
            console.log(error);

            alert(
                error?.response?.data?.message ||
                "Unable to change password."
            );
        } finally {
            setLoading(false);
        }
    };

    /* =====================================================
            CLOSE MODALS
    ===================================================== */

    const closeEditModal = () => {
        setEditModal(false);

        setProfileForm({
            name: user?.name || "",
            email: user?.email || "",
            phone: user?.phone || "",
        });
    };

    const closePasswordModal = () => {
        setPasswordModal(false);

        setPasswordForm({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
    };


    return (
        <div className="space-y-8">

            {/* Header */}

            <div>
                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl">
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
                            onClick={openEditModal}
                            disabled={loading}
                            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                        >
                            <Edit size={18} />
                            Edit Profile
                        </button>

                        <button
                            onClick={openPasswordModal}
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


            {/* =====================================================
                            EDIT PROFILE MODAL
                ===================================================== */}

            {editModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
                    onClick={closeEditModal}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-2xl overflow-hidden rounded-3xl bg-slate-900 shadow-2xl"
                    >
                        {/* Header */}

                        <div className="flex items-center justify-between border-b border-slate-800 px-8 py-6">

                            <div>

                                <h2 className="text-2xl font-bold text-white">
                                    Edit Profile
                                </h2>

                                <p className="mt-1 text-sm text-slate-400">
                                    Update your personal information
                                </p>

                            </div>

                            <button
                                onClick={closeEditModal}
                                className="rounded-xl p-2 transition hover:bg-slate-800"
                            >
                                <X
                                    size={22}
                                    className="text-slate-300"
                                />
                            </button>

                        </div>

                        {/* Body */}

                        <div className="space-y-7 p-8">

                            {/* Avatar */}

                            <div className="flex flex-col items-center">

                                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-3xl font-bold text-white">

                                    {initials}

                                </div>

                                <p className="mt-3 text-sm text-slate-400">
                                    Avatar is generated from your name.
                                </p>

                            </div>

                            {/* Name */}

                            <div>

                                <label className="mb-2 block font-medium text-slate-300">
                                    Full Name
                                </label>

                                <div className="relative">

                                    <User
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                                    />

                                    <input
                                        type="text"
                                        name="name"
                                        value={profileForm.name}
                                        onChange={handleProfileChange}
                                        placeholder="Enter your full name"
                                        className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-12 pr-4 text-white outline-none transition focus:border-blue-500"
                                    />

                                </div>

                            </div>

                            {/* Email */}

                            <div>

                                <label className="mb-2 block font-medium text-slate-300">
                                    Email Address
                                </label>

                                <div className="relative">

                                    <Mail
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                                    />

                                    <input
                                        type="email"
                                        name="email"
                                        value={profileForm.email}
                                        onChange={handleProfileChange}
                                        placeholder="Enter email address"
                                        className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-12 pr-4 text-white outline-none transition focus:border-blue-500"
                                    />

                                </div>

                            </div>

                            {/* Phone */}

                            <div>

                                <label className="mb-2 block font-medium text-slate-300">
                                    Phone Number
                                </label>

                                <div className="relative">

                                    <Phone
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                                    />

                                    <input
                                        type="text"
                                        name="phone"
                                        value={profileForm.phone}
                                        onChange={handleProfileChange}
                                        placeholder="Enter phone number"
                                        className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-12 pr-4 text-white outline-none transition focus:border-blue-500"
                                    />

                                </div>

                            </div>

                        </div>

                        {/* Footer */}

                        <div className="flex justify-end gap-4 border-t border-slate-800 px-8 py-6">

                            <button
                                onClick={closeEditModal}
                                className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={updateProfile}
                                disabled={loading}
                                className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading
                                    ? "Updating..."
                                    : "Update Profile"}
                            </button>

                        </div>

                    </div>

                </div>
            )}


            {/* =====================================================
                                 CHANGE PASSWORD MODAL
                ===================================================== */}

            {passwordModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
                    onClick={closePasswordModal}
                >
                    <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        {/* Header */}

                        <div className="flex items-center justify-between border-b border-slate-800 px-8 py-6">

                            <div>

                                <h2 className="text-2xl font-bold text-white">
                                    Change Password
                                </h2>

                                <p className="mt-1 text-sm text-slate-400">
                                    Choose a strong password to keep your account secure.
                                </p>

                            </div>

                            <button
                                onClick={closePasswordModal}
                                className="rounded-xl p-2 transition hover:bg-slate-800"
                            >
                                <X
                                    size={22}
                                    className="text-slate-300"
                                />
                            </button>

                        </div>

                        {/* Body */}

                        <div className="space-y-6 p-8">

                            {/* Current Password */}

                            <div>

                                <label className="mb-2 block font-medium text-slate-300">
                                    Current Password
                                </label>

                                <div className="relative">

                                    <Lock
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                                    />

                                    <input
                                        type={
                                            showCurrentPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="currentPassword"
                                        value={passwordForm.currentPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="Enter current password"
                                        className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-12 pr-14 text-white outline-none transition focus:border-blue-500"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowCurrentPassword(
                                                !showCurrentPassword
                                            )
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    >
                                        {showCurrentPassword ? (
                                            <EyeOff size={20} />
                                        ) : (
                                            <Eye size={20} />
                                        )}
                                    </button>

                                </div>

                            </div>

                            {/* New Password */}

                            <div>

                                <label className="mb-2 block font-medium text-slate-300">
                                    New Password
                                </label>

                                <div className="relative">

                                    <Lock
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                                    />

                                    <input
                                        type={
                                            showNewPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="newPassword"
                                        value={passwordForm.newPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="Enter new password"
                                        className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-12 pr-14 text-white outline-none transition focus:border-blue-500"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowNewPassword(
                                                !showNewPassword
                                            )
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    >
                                        {showNewPassword ? (
                                            <EyeOff size={20} />
                                        ) : (
                                            <Eye size={20} />
                                        )}
                                    </button>

                                </div>

                            </div>

                            {/* Confirm Password */}

                            <div>

                                <label className="mb-2 block font-medium text-slate-300">
                                    Confirm Password
                                </label>

                                <div className="relative">

                                    <Lock
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                                    />

                                    <input
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="confirmPassword"
                                        value={passwordForm.confirmPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="Confirm new password"
                                        className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-12 pr-14 text-white outline-none transition focus:border-blue-500"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff size={20} />
                                        ) : (
                                            <Eye size={20} />
                                        )}
                                    </button>

                                </div>

                            </div>

                            {/* Password Tips */}

                            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4">

                                <h4 className="font-semibold text-blue-300">
                                    Password Requirements
                                </h4>

                                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
                                    <li>Minimum 6 characters</li>
                                    <li>Use uppercase & lowercase letters</li>
                                    <li>Include at least one number</li>
                                    <li>Use a special character for better security</li>
                                </ul>

                            </div>

                        </div>

                        {/* Footer */}

                        <div className="flex justify-end gap-4 border-t border-slate-800 px-8 py-6">

                            <button
                                onClick={closePasswordModal}
                                className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={changePassword}
                                disabled={loading}
                                className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading
                                    ? "Updating..."
                                    : "Change Password"}
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}