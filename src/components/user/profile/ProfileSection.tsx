"use client";

import { useEffect, useState } from "react";
import {
    User,
    Mail,
    Phone,
    Shield,
    Calendar,
    Edit,
    Lock,
    CheckCircle,
    X,
    Save,
    Eye,
    EyeOff,
} from "lucide-react";

import { useAppSelector } from "@/hooks/redux";
import { postRequest, putRequest } from "@/services/apiMethods";

export default function Profile() {
    const user = useAppSelector((state: any) => state.auth.user);



    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [userbyId, setUserbyId] = useState<any>()
    const [emailVerified, setEmailVerified] = useState(
        user?.isEmailVerified ?? false
    );

    const [form, setForm] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
    });

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false,
    });

    const initials =
        user?.name
            ?.split(" ")
            ?.map((word: string) => word[0])
            ?.join("")
            ?.toUpperCase()
            ?.slice(0, 2) || "U";



    const fetchUserById = async () => {
        let userById: any = await postRequest("/users/getUserProfile", { id: user._id })
        console.log(userById, "userById")
        setUserbyId(userById)
    }

    useEffect(() => {
        fetchUserById()
    }, [])




    // =====================================================
    // EDIT PROFILE
    // =====================================================

    const handleEdit = () => {
        setForm({
            name: user?.name || "",
            email: user?.email || "",
            phone: user?.phone || "",
        });

        setIsEditing(true);
    };


    // =====================================================
    // CANCEL EDIT
    // =====================================================

    const handleCancel = () => {
        setForm({
            name: user?.name || "",
            email: user?.email || "",
            phone: user?.phone || "",
        });

        setIsEditing(false);
    };


    // =====================================================
    // HANDLE PROFILE CHANGE
    // =====================================================

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    // =====================================================
    // SAVE PROFILE
    // =====================================================

    const handleSave = async () => {
        try {
            setLoading(true);

            const payload = {
                name: form.name,
                email: form.email,
                phone: form.phone,
                id: user._id
            };

            console.log(payload, "Update Profile Payload");

            // Example:
            const response = await putRequest("users/updateUser", payload);

            console.log(response, "In the response")

            setIsEditing(false);

            fetchUserById()

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };


    // =====================================================
    // VERIFY EMAIL
    // =====================================================

    const handleVerifyEmail = async () => {
        try {
            setLoading(true);

            console.log(
                "Verification email sent to:",
                form.email
            );

            // Example:
            // await postRequest(
            //     "auth/sendEmailVerification",
            //     {
            //         email: form.email,
            //     }
            // );

            alert("Verification email sent successfully.");

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };


    // =====================================================
    // OPEN PASSWORD MODAL
    // =====================================================

    const handleOpenPasswordModal = () => {
        setPasswordForm({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });

        setShowPassword({
            currentPassword: false,
            newPassword: false,
            confirmPassword: false,
        });

        setIsPasswordModalOpen(true);
    };


    // =====================================================
    // CLOSE PASSWORD MODAL
    // =====================================================

    const handleClosePasswordModal = () => {
        if (loading) return;

        setPasswordForm({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });

        setIsPasswordModalOpen(false);
    };


    // =====================================================
    // PASSWORD INPUT CHANGE
    // =====================================================

    const handlePasswordChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;

        setPasswordForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    // =====================================================
    // CHANGE PASSWORD
    // =====================================================

    const handleChangePassword = async () => {

        const {
            currentPassword,
            newPassword,
            confirmPassword,
        } = passwordForm;


        // Current password validation

        if (!currentPassword) {
            alert("Please enter your current password.");
            return;
        }


        // New password validation

        if (!newPassword) {
            alert("Please enter a new password.");
            return;
        }


        // Minimum password length

        if (newPassword.length < 8) {
            alert(
                "New password must be at least 8 characters."
            );
            return;
        }


        // Confirm password

        if (!confirmPassword) {
            alert(
                "Please confirm your new password."
            );
            return;
        }


        // Password match

        if (newPassword !== confirmPassword) {
            alert(
                "New password and confirm password do not match."
            );
            return;
        }


        // Don't allow same password

        if (currentPassword === newPassword) {
            alert(
                "New password must be different from current password."
            );
            return;
        }


        try {

            setLoading(true);

            const payload = {
                currentPassword,
                newPassword,
                id: user._id
            };

            console.log(payload, "Change Password Payload");

            await putRequest("users/changePassword", payload);


            alert(
                "Password changed successfully."
            );

            handleClosePasswordModal();

        } catch (error) {

            console.log(error);

            alert(
                "Failed to change password."
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // TOGGLE PASSWORD VISIBILITY
    // =====================================================

    const togglePasswordVisibility = (
        field:
            | "currentPassword"
            | "newPassword"
            | "confirmPassword"
    ) => {

        setShowPassword((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };


    return (
        <div className="space-y-8">


            {/* =====================================================
                HEADER
            ===================================================== */}

            <div>

                <h1 className="text-3xl font-bold text-white">
                    My Profile
                </h1>

                <p className="mt-2 text-slate-400">
                    Manage your personal information
                </p>

            </div>


            {/* =====================================================
                PROFILE CARD
            ===================================================== */}

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


                    {/* =====================================================
                        NAME
                    ===================================================== */}

                    <div className="text-center">

                        {isEditing ? (

                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="mx-auto block w-full max-w-md rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-center text-2xl font-bold text-white outline-none focus:border-blue-500"
                                placeholder="Enter your name"
                            />

                        ) : (

                            <h2 className="text-3xl font-bold text-white">
                                {userbyId?.name}
                            </h2>

                        )}


                        <span className="mt-3 inline-flex rounded-full bg-green-500/20 px-4 py-2 text-sm font-semibold capitalize text-green-400">

                            {userbyId?.role}

                        </span>

                    </div>


                    {/* =====================================================
                        INFORMATION
                    ===================================================== */}

                    <div className="mt-10 grid gap-6 md:grid-cols-2">


                        {/* EMAIL */}

                        <div className="rounded-2xl bg-slate-800 p-5">

                            <div className="flex items-center gap-4">

                                <Mail
                                    className="shrink-0 text-blue-400"
                                    size={24}
                                />

                                <div className="min-w-0 flex-1">

                                    <p className="text-sm text-slate-400">
                                        Email
                                    </p>

                                    {isEditing ? (

                                        <input
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-blue-500"
                                            placeholder="Enter email"
                                        />

                                    ) : (

                                        <h3 className="break-all font-medium text-white">
                                            {userbyId?.email}
                                        </h3>

                                    )}

                                </div>

                            </div>


                            {/* Email Verification */}

                            <div className="mt-4 border-t border-slate-700 pt-4">

                                {emailVerified ? (

                                    <div className="flex items-center gap-2 text-sm font-medium text-green-400">

                                        <CheckCircle size={18} />

                                        Email Verified

                                    </div>

                                ) : (

                                    <button
                                        type="button"
                                        disabled={loading}
                                        onClick={handleVerifyEmail}
                                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                                    >

                                        <Mail size={16} />

                                        Verify Email

                                    </button>

                                )}

                            </div>

                        </div>


                        {/* PHONE */}

                        <div className="flex items-center gap-4 rounded-2xl bg-slate-800 p-5">

                            <Phone
                                className="shrink-0 text-green-400"
                                size={24}
                            />

                            <div className="min-w-0 flex-1">

                                <p className="text-sm text-slate-400">
                                    Phone
                                </p>

                                {isEditing ? (

                                    <input
                                        type="tel"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-green-500"
                                        placeholder="Enter phone number"
                                    />

                                ) : (

                                    <h3 className="font-medium text-white">
                                        {userbyId?.phone ||
                                            "Not Available"}
                                    </h3>

                                )}

                            </div>

                        </div>


                        {/* ROLE */}

                        <div className="flex items-center gap-4 rounded-2xl bg-slate-800 p-5">

                            <Shield
                                className="shrink-0 text-purple-400"
                                size={24}
                            />

                            <div>

                                <p className="text-sm text-slate-400">
                                    Role
                                </p>

                                <h3 className="font-medium capitalize text-white">
                                    {userbyId?.role}
                                </h3>

                            </div>

                        </div>


                        {/* MEMBER SINCE */}

                        <div className="flex items-center gap-4 rounded-2xl bg-slate-800 p-5">

                            <Calendar
                                className="shrink-0 text-yellow-400"
                                size={24}
                            />

                            <div>

                                <p className="text-sm text-slate-400">
                                    Member Since
                                </p>

                                <h3 className="font-medium text-white">
                                    {userbyId?.createdAt
                                        ? new Date(
                                            user.createdAt
                                        ).toLocaleDateString(
                                            "en-IN"
                                        )
                                        : "N/A"}
                                </h3>

                            </div>

                        </div>

                    </div>


                    {/* =====================================================
                        BUTTONS
                    ===================================================== */}

                    <div className="mt-10 flex flex-wrap gap-4">

                        {!isEditing ? (

                            <>

                                <button
                                    type="button"
                                    onClick={handleEdit}
                                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                                >

                                    <Edit size={18} />

                                    Edit Profile

                                </button>


                                <button
                                    type="button"
                                    onClick={handleOpenPasswordModal}
                                    className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-6 py-3 font-semibold text-white transition hover:bg-slate-700"
                                >

                                    <Lock size={18} />

                                    Change Password

                                </button>

                            </>

                        ) : (

                            <>

                                <button
                                    type="button"
                                    disabled={loading}
                                    onClick={handleSave}
                                    className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
                                >

                                    <Save size={18} />

                                    {loading
                                        ? "Saving..."
                                        : "Save Changes"}

                                </button>


                                <button
                                    type="button"
                                    disabled={loading}
                                    onClick={handleCancel}
                                    className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-6 py-3 font-semibold text-white transition hover:bg-slate-700"
                                >

                                    <X size={18} />

                                    Cancel

                                </button>

                            </>

                        )}

                    </div>

                </div>

            </div>


            {/* =====================================================
                ACCOUNT STATISTICS
            ===================================================== */}

            <div className="grid gap-6 md:grid-cols-3">


                {/* Account Status */}

                <div className="rounded-2xl bg-slate-900 p-6 shadow-lg">

                    <User
                        className="mb-3 text-blue-400"
                        size={28}
                    />

                    <h2 className="text-2xl font-bold capitalize text-white">
                        {user?.status || "Active"}
                    </h2>

                    <p className="text-slate-400">
                        Account Status
                    </p>

                </div>


                {/* Email Verification */}

                <div className="rounded-2xl bg-slate-900 p-6 shadow-lg">

                    <Shield
                        className="mb-3 text-green-400"
                        size={28}
                    />

                    <h2
                        className={`text-2xl font-bold ${emailVerified
                            ? "text-green-400"
                            : "text-yellow-400"
                            }`}
                    >

                        {emailVerified
                            ? "Verified"
                            : "Not Verified"}

                    </h2>

                    <p className="text-slate-400">
                        Email Verification
                    </p>

                </div>


                {/* Joined */}

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
                CHANGE PASSWORD MODAL
            ===================================================== */}

            {isPasswordModalOpen && (

                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
                    onMouseDown={(e) => {

                        if (e.target === e.currentTarget) {
                            handleClosePasswordModal();
                        }

                    }}
                >

                    <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl">


                        {/* Modal Header */}

                        <div className="flex items-center justify-between border-b border-slate-700 px-6 py-5">

                            <div className="flex items-center gap-3">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/20">

                                    <Lock
                                        size={22}
                                        className="text-blue-400"
                                    />

                                </div>

                                <div>

                                    <h2 className="text-xl font-bold text-white">
                                        Change Password
                                    </h2>

                                    <p className="text-sm text-slate-400">
                                        Update your account password
                                    </p>

                                </div>

                            </div>


                            <button
                                type="button"
                                onClick={handleClosePasswordModal}
                                disabled={loading}
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                            >

                                <X size={22} />

                            </button>

                        </div>


                        {/* Modal Body */}

                        <div className="space-y-5 p-6">


                            {/* Current Password */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-slate-300">
                                    Current Password
                                </label>

                                <div className="relative">

                                    <input
                                        type={
                                            showPassword.currentPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="currentPassword"
                                        value={
                                            passwordForm.currentPassword
                                        }
                                        onChange={
                                            handlePasswordChange
                                        }
                                        placeholder="Enter current password"
                                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 pr-12 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            togglePasswordVisibility(
                                                "currentPassword"
                                            )
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                    >

                                        {showPassword.currentPassword ? (
                                            <EyeOff size={20} />
                                        ) : (
                                            <Eye size={20} />
                                        )}

                                    </button>

                                </div>

                            </div>


                            {/* New Password */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-slate-300">
                                    New Password
                                </label>

                                <div className="relative">

                                    <input
                                        type={
                                            showPassword.newPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="newPassword"
                                        value={
                                            passwordForm.newPassword
                                        }
                                        onChange={
                                            handlePasswordChange
                                        }
                                        placeholder="Enter new password"
                                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 pr-12 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            togglePasswordVisibility(
                                                "newPassword"
                                            )
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                    >

                                        {showPassword.newPassword ? (
                                            <EyeOff size={20} />
                                        ) : (
                                            <Eye size={20} />
                                        )}

                                    </button>

                                </div>

                                <p className="mt-2 text-xs text-slate-500">
                                    Password must be at least 8 characters.
                                </p>

                            </div>


                            {/* Confirm Password */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-slate-300">
                                    Confirm New Password
                                </label>

                                <div className="relative">

                                    <input
                                        type={
                                            showPassword.confirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="confirmPassword"
                                        value={
                                            passwordForm.confirmPassword
                                        }
                                        onChange={
                                            handlePasswordChange
                                        }
                                        placeholder="Confirm new password"
                                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 pr-12 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            togglePasswordVisibility(
                                                "confirmPassword"
                                            )
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                    >

                                        {showPassword.confirmPassword ? (
                                            <EyeOff size={20} />
                                        ) : (
                                            <Eye size={20} />
                                        )}

                                    </button>

                                </div>

                            </div>

                        </div>


                        {/* Modal Footer */}

                        <div className="flex justify-end gap-3 border-t border-slate-700 px-6 py-5">

                            <button
                                type="button"
                                disabled={loading}
                                onClick={handleClosePasswordModal}
                                className="rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50"
                            >
                                Cancel
                            </button>


                            <button
                                type="button"
                                disabled={loading}
                                onClick={handleChangePassword}
                                className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >

                                <Lock size={18} />

                                {loading ? "Changing..." : "Change Password"}

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}