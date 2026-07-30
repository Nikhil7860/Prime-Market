"use client";

import { useEffect, useState } from "react";
import { addCategory, deleteCategoryApi, getCategories, updateCategory, updateCategoryStatus } from "@/services/category.service";
import { useAppSelector } from "@/hooks/redux";
import { Search, Plus, Pencil, Trash2, Power, X, Loader2, Eye } from "lucide-react";

interface ProductCategory {
    _id: string;
    categoryName: string;
    slug: string;
    description: string;
    image: string;
    displayOrder: number;
    isFeatured: boolean;
    status: boolean;
    createdAt: string;
}


interface requestpayload {
    id: string;
    status: boolean
}

export default function ProductCategory() {
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedCategory, setselectedCategory] = useState<ProductCategory | null>(null);
    const [form, setForm] = useState({ categoryName: "", slug: "", description: "", image: "", displayOrder: 1, isFeatured: false, status: true, });
    const auth: any = useAppSelector((state) => state.auth);

    // ---------------- FETCH USERS ----------------
    const fetchProductCategory = async () => {
        try {
            const res: any = await getCategories();
            const data = Array.isArray(res) ? res : res?.data || [];
            setCategories(data);
        } catch (err) {
            console.log(err);
        }
    };


    useEffect(() => {
        fetchProductCategory();
    }, []);

    // ---------------- ADD ----------------
    const openAddModal = () => {
        setIsEdit(false);
        setselectedCategory(null);
        setForm({ categoryName: "", slug: "", description: "", image: "", displayOrder: 1, isFeatured: false, status: true });
        setModalOpen(true);
    };

    // ---------------- EDIT ----------------
    const openEditModal = (prodCat: ProductCategory) => {
        setIsEdit(true);
        setselectedCategory(prodCat);
        setForm({
            categoryName: prodCat.categoryName,
            slug: prodCat.slug,
            description: prodCat.description,
            image: prodCat.image,
            displayOrder: prodCat.displayOrder,
            isFeatured: prodCat.isFeatured,
            status: prodCat.status,
        });
        setModalOpen(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: name === "status" ? value === "true" : value }));
    };

    const handleSubmit = async () => {
        try {
            if (isEdit && selectedCategory) {
                let payload = { id: selectedCategory._id, ...form, }
                await updateCategory(payload)
            } else {
                const generatedSlug = form.categoryName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
                form.slug = generatedSlug
                let payload = { addedBy: auth.user._id, ...form }
                await addCategory(payload)
            }
            setModalOpen(false);
            fetchProductCategory();
        } catch (err) {
            console.log(err);
        }
    };

    const toggleCategoryStatus = async (prodCat: ProductCategory) => {
        try {
            let payload: requestpayload = {
                id: prodCat._id,
                status: prodCat.status === true ? false : true
            }
            await updateCategoryStatus(payload)
            fetchProductCategory();
        } catch (err) {
            console.log(err);
        }
    };


    const handleDelete = async (prodCat: ProductCategory) => {
        try {
            await deleteCategoryApi(prodCat._id)
            fetchProductCategory()
        } catch (error) {
            console.log(error, "in the error")
        }
    }

    const filteredCategories = categories.filter((u) => u.categoryName?.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Product Category
                    </h1>
                    <p className="text-slate-500 mt-2">
                        Manage Product Category.
                    </p>
                </div>

                <button
                    onClick={openAddModal}
                    className="rounded bg-blue-600 px-4 py-2 text-white"
                >
                    + Add Category
                </button>
            </div>

            {/* SEARCH */}
            <input
                className="w-full max-w-sm rounded border border-slate-300 bg-white p-2 text-slate-900 focus:border-blue-500 focus:outline-none"
                placeholder="Search Product Category..."
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
                            <th className="p-4 text-left text-slate-700 font-semibold">Description</th>

                            <th className="p-4 text-left text-slate-700 font-semibold">Status</th>
                            <th className="p-4 text-left text-slate-700 font-semibold">Action</th>
                        </tr>
                    </thead>

                    {/* BODY */}
                    <tbody>

                        {filteredCategories.map((prodCat) => (
                            <tr
                                key={prodCat._id}
                                className="border-t border-slate-200 hover:bg-slate-50 transition"
                            >

                                <td className="p-4 text-slate-900 font-medium">
                                    {prodCat.categoryName}
                                </td>

                                <td className="p-4 text-slate-700">
                                    {prodCat.description}
                                </td>


                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium
                                           ${prodCat.status === true
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                        }`}>
                                        {prodCat.status === true ? "Active" : "InActive"}
                                    </span>
                                </td>

                                <td className="p-4">
                                    <div className="flex gap-2">
                                        <button onClick={() => toggleCategoryStatus(prodCat)} className="rounded-lg bg-yellow-500 p-2 text-white hover:bg-yellow-600">
                                            <Power size={18} />
                                        </button>
                                        <button onClick={() => openEditModal(prodCat)} className="rounded bg-blue-500 px-3 py-1 text-white text-sm">
                                            <Pencil size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(prodCat)} className="rounded bg-red-500 px-3 py-1 text-white text-sm">
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
                    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
                    onClick={() => setModalOpen(false)}
                >
                    <div
                        className="w-full max-w-md rounded-xl bg-white p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="mb-6 text-2xl font-bold text-slate-900">
                            {isEdit ? "Edit Category" : "Add Category"}
                        </h2>

                        <div className="space-y-5">

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="categoryName"
                                    value={form.categoryName}
                                    onChange={handleChange}
                                    placeholder="Enter category Name"
                                    className="w-full rounded-lg border border-slate-300 p-3 text-slate-900 outline-none transition focus:border-blue-600"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    placeholder="Enter Category Description"
                                    className="w-full rounded-lg border border-slate-300 p-3 text-slate-900 outline-none transition focus:border-blue-600"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={String(form.status)}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-300 p-3 text-slate-900 outline-none transition focus:border-blue-600"
                                >
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
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
                                {isEdit ? "Update Category" : "Create Category"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}




