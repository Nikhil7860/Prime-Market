"use client";

import { useEffect, useState } from "react";
import { createModule, deActivateModule, deleteModuleApi, getModules, updateModule, } from "@/services/module.service";
import { Search, Plus, Pencil, Trash2, Power, X, Loader2, Eye } from "lucide-react";


interface Module {
    _id: string;
    moduleName: string;
    route: string;
    status: "Active" | "Inactive";
}

export default function ModulesSection() {

    const [search, setSearch] = useState("");

    const [modalOpen, setModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [selectedModule, setSelectedModule] = useState<Module | null>(null);

    const [modules, setModules] = useState([])

    const [form, setForm] = useState({ moduleName: "", route: "" });




    // ---------------- FETCH ROLES ----------------

    const fetchModules = async () => {
        try {
            const res: any = await getModules()
            const data = Array.isArray(res) ? res : res?.data || [];
            setModules(data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchModules();
    }, []);



    // ---------------- OPEN ADD ----------------
    const openAddModal = () => {
        setIsEdit(false);
        setSelectedModule(null);

        setForm({
            moduleName: "",
            route: "",
        });

        setModalOpen(true);
    };

    // ---------------- OPEN EDIT ----------------
    const openEditModal = (module: Module) => {
        setIsEdit(true);
        setSelectedModule(module);

        setForm({
            moduleName: module.moduleName,
            route: module.route,
        });

        setModalOpen(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // ---------------- CREATE / UPDATE ----------------
    const handleSubmit = async () => {
        try {

            if (isEdit && selectedModule) {
                await updateModule({
                    id: selectedModule._id,
                    moduleName: form.moduleName,
                    route: form.route,
                });
            } else {
                await createModule(form);
            }

            setModalOpen(false);

            fetchModules();
        } catch (err) {
            console.log(err);
        }
    };

    // ---------------- DELETE ROLE ----------------
    const deleteModule = async (id: string) => {
        try {
            await deleteModuleApi(id);

            fetchModules();
        } catch (err) {
            console.log(err);
        }
    };

    // ---------------- TOGGLE STATUS ----------------
    const toggleModuleStatus = async (module: Module) => {
        try {
            await deActivateModule(module._id);

            fetchModules();
        } catch (err) {
            console.log(err);
        }
    };


    const filteredModules = modules.filter((module: any) =>
        module.moduleName
            .toLowerCase()
            .includes(search.toLowerCase())
    );



    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Modules Management
                    </h1>
                    <p className="text-slate-500">
                        Manage application modules and their routes.
                    </p>
                </div>

                <button
                    onClick={openAddModal}
                    className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                >
                    + Add Module
                </button>

            </div>

            {/* SEARCH */}
            <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Module..."
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
                        {filteredModules.map((module: any) => (
                            <tr
                                key={module._id}
                                className="border-t border-slate-200 hover:bg-slate-50"
                            >

                                <td className="p-4 font-medium text-slate-900">
                                    {module.moduleName}
                                </td>

                                <td className="p-4 text-slate-600">
                                    {module.route}
                                </td>

                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium
                    ${module.status === "Active"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {module.status}
                                    </span>
                                </td>

                                <td className="p-4">
                                    <div className="flex flex-wrap gap-2">

                                        <button
                                            onClick={() => openEditModal(module)}
                                            className="rounded bg-yellow-500 px-3 py-1 text-white text-sm"
                                        >
                                            <Pencil size={18} />
                                        </button>

                                        <button
                                            onClick={() => toggleModuleStatus(module)}
                                            className={`rounded px-3 py-1 text-white text-sm ${module.status === "Active"
                                                ? "bg-red-600"
                                                : "bg-green-600"
                                                }`}
                                        >
                                            <Power size={18} />
                                        </button>

                                        <button
                                            onClick={() => deleteModule((module._id))}
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
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    onClick={() => setModalOpen(false)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-6 py-5">
                            <div>
                                <h2 className="text-2xl font-bold text-white">
                                    {isEdit ? "Edit Module" : "Create Module"}
                                </h2>

                                <p className="mt-1 text-sm text-blue-100">
                                    {isEdit
                                        ? "Update the module information."
                                        : "Create a new application module."}
                                </p>
                            </div>

                            <button
                                onClick={() => setModalOpen(false)}
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-xl text-white transition hover:bg-white/30"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Body */}
                        <div className="space-y-6 p-6">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Module Name
                                </label>

                                <input
                                    name="moduleName"
                                    value={form.moduleName}
                                    onChange={handleInputChange}
                                    placeholder="Enter module name"
                                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Route
                                </label>

                                <input
                                    name="route"
                                    value={form.route}
                                    onChange={handleInputChange}
                                    placeholder="/admin/dashboard"
                                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-5">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 font-medium text-slate-700 transition hover:bg-slate-100"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSubmit}
                                className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-2.5 font-semibold text-white shadow-lg transition hover:scale-105 hover:shadow-xl"
                            >
                                {isEdit ? "Update Module" : "Create Module"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}