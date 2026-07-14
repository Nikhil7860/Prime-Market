"use client";

import { useEffect, useState } from "react";
import { getRequest, postRequest } from "@/services/apiMethods";
import { addUser, getUsers, updateUser, updateUserStatus } from "@/services/user.service";
import { getRoles } from "@/services/role.service";

interface User {
    _id: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    role: string;
    status: string
    isActive?: boolean;
    createdAt: string;
    roleId: string
}


interface requestpayload {
    id: string;
    status: string
}

export default function UsersSection() {
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState("");
    const [roles, setRole] = useState<any>()
    const [modalOpen, setModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const userStatusAry = ["Active", "Inactive", "Blocked"]
    const [selectedRoleId, setSelectedRoleId] = useState("");
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "",
        status: "",
        roleId: "",
    });

    // ---------------- FETCH USERS ----------------
    const fetchUsers = async () => {
        try {
            const res: any = await getUsers();
            const data = Array.isArray(res) ? res : res?.data || [];
            setUsers(data);
        } catch (err) {
            console.log(err);
        }
    };
    const fetchRoles = async () => {
        try {
            const res: any = await getRoles();
            const data = Array.isArray(res) ? res : res || [];
            setRole(data);

        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchRoles()
    }, []);

    // ---------------- ADD ----------------
    const openAddModal = () => {
        setIsEdit(false);
        setSelectedUser(null);
        setForm({ name: "", email: "", phone: "", password: "", role: "", status: "", roleId: "" });
        setModalOpen(true);
    };

    // ---------------- EDIT ----------------
    const openEditModal = (user: User) => {
        setIsEdit(true);
        setSelectedUser(user);
        setForm({
            name: user.name,
            email: user.email,
            phone: user.phone,
            password: "",
            role: user.role,
            status: user.status,
            roleId: user.roleId,
        });
        setModalOpen(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === "role") {
            const selectedRole = roles.find((role: any) => role._id === value);

            setSelectedRoleId(value);

            setForm((prev) => ({
                ...prev,
                roleId: value,
                role: selectedRole?.roleName || "",
            }));

            return;
        }

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            if (isEdit && selectedUser) {

                await updateUser({
                    id: selectedUser._id,
                    ...form,
                })
            } else {

                await addUser(form)
            }

            setModalOpen(false);
            fetchUsers();
        } catch (err) {
            console.log(err);
        }
    };

    const toggleUserStatus = async (user: User) => {
        try {

            let payload: requestpayload = {
                id: user._id,
                status: user.status === "Active" ? "Inactive" : "Active"
            }
            await updateUserStatus(payload)
            fetchUsers();
        } catch (err) {
            console.log(err);
        }
    };

    const filteredUsers = users.filter((u) => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Users
                    </h1>
                    <p className="text-slate-500 mt-2">
                        Manage registered users.
                    </p>
                </div>

                <button
                    onClick={openAddModal}
                    className="rounded bg-blue-600 px-4 py-2 text-white"
                >
                    + Add User
                </button>
            </div>

            {/* SEARCH */}
            <input
                className="w-full max-w-sm rounded border border-slate-300 bg-white p-2 text-slate-900 focus:border-blue-500 focus:outline-none"
                placeholder="Search user..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* TABLE WRAPPER */}
            <div className="overflow-x-auto rounded-xl bg-white shadow-sm border border-slate-200">

                <table className="w-full min-w-[800px]">

                    {/* HEADER */}
                    <thead className="bg-slate-100">
                        <tr>
                            <th className="p-4 text-left text-slate-700 font-semibold">Name</th>
                            <th className="p-4 text-left text-slate-700 font-semibold">Email</th>
                            <th className="p-4 text-left text-slate-700 font-semibold">Role</th>
                            <th className="p-4 text-left text-slate-700 font-semibold">Status</th>
                            <th className="p-4 text-left text-slate-700 font-semibold">Action</th>
                        </tr>
                    </thead>

                    {/* BODY */}
                    <tbody>

                        {filteredUsers.map((user) => (
                            <tr
                                key={user._id}
                                className="border-t border-slate-200 hover:bg-slate-50 transition"
                            >

                                <td className="p-4 text-slate-900 font-medium">
                                    {user.name}
                                </td>

                                <td className="p-4 text-slate-700">
                                    {user.email}
                                </td>

                                <td className="p-4 text-slate-700">
                                    {user.role}
                                </td>

                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium
                                        ${user.status === "Active"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {user.status === "Active" ? "Active" : "Inactive"}
                                    </span>
                                </td>

                                <td className="p-4">
                                    <div className="flex gap-2">

                                        <button onClick={() => openEditModal(user)} className="rounded bg-yellow-500 px-3 py-1 text-white text-sm">
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => toggleUserStatus(user)}
                                            className={`rounded px-3 py-1 text-white text-sm ${user.status === "Active" ? "bg-red-600" : "bg-green-600"}`}>
                                            {user.status === "Active" ? "Deactivate" : "Activate"}
                                        </button>

                                    </div>
                                </td>

                            </tr>
                        ))}

                    </tbody>

                </table>

            </div>

            {/* MODAL */}
            {modalOpen && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
                    onClick={() => setModalOpen(false)}
                >
                    <div
                        className="w-full max-w-md rounded-xl bg-white p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="mb-6 text-2xl font-bold text-slate-900">
                            {isEdit ? "Edit User" : "Add User"}
                        </h2>

                        <div className="space-y-5">

                            {/* Name */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Full Name
                                </label>
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Enter full name"
                                    className="w-full rounded-lg border border-slate-300 p-3 text-slate-900 outline-none transition focus:border-blue-600"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="Enter email address"
                                    className="w-full rounded-lg border border-slate-300 p-3 text-slate-900 outline-none transition focus:border-blue-600"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Phone Number
                                </label>
                                <input
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="Enter phone number"
                                    className="w-full rounded-lg border border-slate-300 p-3 text-slate-900 outline-none transition focus:border-blue-600"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Enter password"
                                    className="w-full rounded-lg border border-slate-300 p-3 text-slate-900 outline-none transition focus:border-blue-600"
                                />
                            </div>

                            {/* Role */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    User Role
                                </label>

                                <select
                                    name="role"
                                    value={form.roleId}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-300 p-3 text-slate-900"
                                >
                                    <option value="">Select Role</option>

                                    {roles.map((role: any) => (
                                        <option key={role._id} value={role._id}>
                                            {role.roleName}
                                        </option>
                                    ))}
                                </select>
                            </div>


                            {/* Status */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    User Status
                                </label>
                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-300 p-3 text-slate-900 outline-none transition focus:border-blue-600"
                                >
                                    {userStatusAry.map((s: any) => (
                                        <option key={s} value={s}>
                                            {s}
                                        </option>
                                    ))}
                                </select>
                            </div>

                        </div>

                        <div className="mt-8 flex justify-end gap-3">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="rounded-lg bg-red-600 px-5 py-2.5 font-medium text-white transition hover:bg-red-700"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSubmit}
                                className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
                            >
                                {isEdit ? "Update User" : "Create User"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}