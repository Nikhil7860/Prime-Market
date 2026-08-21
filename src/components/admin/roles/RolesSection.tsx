"use client";

import { useEffect, useState } from "react";
import { getRequest, postRequest } from "@/services/apiMethods";
import { createRole, deActivateRole, deleteRoleApi, getRoles, updateRole } from "@/services/role.service";
import { Pencil, Power, Trash2 } from "lucide-react";

interface Role {
    _id: string;
    roleName: string;
    description: string;
    status: "Active" | "Inactive";
    permissions: any[];
    createdAt: string;
}

export default function RolesSection() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [search, setSearch] = useState("");

    const [modalOpen, setModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);

    const [form, setForm] = useState({
        name: "",
        description: "",
    });



    // ---------------- FETCH ROLES ----------------
    const fetchRoles = async () => {
        try {
            const res: any = await getRoles();
            const data = Array.isArray(res) ? res : res?.data || [];
            setRoles(data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    // ---------------- OPEN ADD ----------------
    const openAddModal = () => {
        setIsEdit(false);
        setSelectedRole(null);
        setForm({ name: "", description: "" });
        setModalOpen(true);
    };

    // ---------------- OPEN EDIT ----------------
    const openEditModal = (role: Role) => {
        setIsEdit(true);
        setSelectedRole(role);
        setForm({
            name: role.roleName,
            description: role.description,
        });
        setModalOpen(true);
    };

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // ---------------- CREATE / UPDATE ----------------
    const handleSubmit = async () => {
        try {
            if (isEdit && selectedRole) {
                await updateRole({
                    id: selectedRole._id,
                    roleName: form.name,
                    description: form.description,
                });
            } else {
                await createRole({
                    roleName: form.name,
                    description: form.description
                });
            }

            setModalOpen(false);
            fetchRoles();
        } catch (err) {
            console.log(err);
        }
    };

    // ---------------- DELETE ROLE ----------------
    const deleteRole = async (id: string) => {
        try {
            await deleteRoleApi(id);
            fetchRoles();
        } catch (err) {
            console.log(err);
        }
    };

    // ---------------- TOGGLE STATUS ----------------
    const toggleRoleStatus = async (role: Role) => {
        try {
            await deActivateRole(role._id);

            fetchRoles();
        } catch (err) {
            console.log(err);
        }
    };

    const filteredRoles = roles.filter((r) =>
        r.roleName.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Roles
                    </h1>
                    <p className="text-slate-500">
                        Manage user roles and permissions.
                    </p>
                </div>

                <button
                    onClick={openAddModal}
                    className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                >
                    + Add Role
                </button>

            </div>

            {/* SEARCH */}
            <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search roles..."
                className="w-full max-w-sm rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 focus:border-blue-500 focus:outline-none"
            />

            {/* TABLE */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">

                <table className="w-full min-w-[700px]">

                    <thead className="bg-slate-100">
                        <tr>
                            <th className="p-4 text-left text-slate-700">Role</th>
                            <th className="p-4 text-left text-slate-700">Description</th>
                            <th className="p-4 text-left text-slate-700">Status</th>
                            <th className="p-4 text-left text-slate-700">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredRoles.map((role) => (
                            <tr
                                key={role._id}
                                className="border-t border-slate-200 hover:bg-slate-50"
                            >

                                <td className="p-4 font-medium text-slate-900">
                                    {role.roleName}
                                </td>

                                <td className="p-4 text-slate-600">
                                    {role.description}
                                </td>

                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium
                    ${role.status === "Active"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {role.status}
                                    </span>
                                </td>

                                <td className="p-4">
                                    <div className="flex flex-wrap gap-2">

                                        <button
                                            onClick={() => openEditModal(role)}
                                            className="rounded bg-yellow-500 px-3 py-1 text-white text-sm"
                                        >
                                            <Pencil size={18} />
                                        </button>

                                        <button
                                            onClick={() => toggleRoleStatus(role)}
                                            className={`rounded px-3 py-1 text-white text-sm ${role.status === "Active"
                                                ? "bg-red-600"
                                                : "bg-green-600"
                                                }`}
                                        >
                                            <Power size={18} />
                                        </button>

                                        <button
                                            onClick={() => deleteRole(role._id)}
                                            className="rounded bg-red-500 px-3 py-1 text-white text-sm"
                                        >
                                            <Trash2 size={18} />
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
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onClick={() => setModalOpen(false)}
                >

                    <div
                        className="w-full max-w-md rounded-xl bg-slate-900 p-6 text-white space-y-4"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <h2 className="text-xl font-bold">
                            {isEdit ? "Edit Role" : "Add Role"}
                        </h2>

                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Role name"
                            className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                        />

                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Role description"
                            className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                        />

                        <div className="flex justify-end gap-2 pt-2">

                            <button
                                onClick={() => setModalOpen(false)}
                                className="rounded border border-slate-600 px-4 py-2"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSubmit}
                                className="rounded bg-blue-600 px-4 py-2 text-white"
                            >
                                {isEdit ? "Update" : "Create"}
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}




