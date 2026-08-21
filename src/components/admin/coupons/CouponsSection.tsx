"use client";

import { useEffect, useState } from "react";
import { deActivateCoupon, getCoupons } from "@/services/coupon.service";
import { createCoupon, updateCoupon, deleteCoupon } from "@/services/coupon.service";
import { getProducts } from "@/services/product.service";
import { getCategories } from "@/services/category.service";
import { Search, Plus, Pencil, Trash2, Power, X, Loader2, Eye } from "lucide-react";


interface Coupon {
    _id: string;

    code: string;
    description: string;

    discountType: "percentage" | "fixed";
    discountValue: number;

    minOrderAmount: number;
    maxDiscountAmount: number;

    usageLimit: number;
    usedCount: number;

    startDate: string;
    endDate: string;

    isActive: boolean;

    applicableCategories: string[];
    applicableProducts: string[];

    createdBy?: string;

    createdAt: string;
}

interface Product {
    _id: string;
    name: string;
}

interface Category {
    _id: string;
    categoryName: string;
}

const emptyForm = {
    code: "",
    description: "",

    discountType: "percentage",

    discountValue: 0,

    minOrderAmount: 0,
    maxDiscountAmount: 0,

    usageLimit: 1,

    startDate: "",
    endDate: "",

    isActive: true,

    applicableCategories: [] as string[],
    applicableProducts: [] as string[],
};

export default function CouponsSection() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    const [search, setSearch] = useState("");

    const [modalOpen, setModalOpen] = useState(false);
    const [viewModal, setViewModal] = useState(false);

    const [isEdit, setIsEdit] = useState(false);

    const [selectedCoupon, setSelectedCoupon] =
        useState<Coupon | null>(null);

    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState(emptyForm);

    /* ============================
            FETCH COUPONS
    ============================ */

    const fetchCoupons = async () => {
        try {
            const res: any = await getCoupons();

            setCoupons(Array.isArray(res) ? res : []);
        } catch (err) {
            console.log(err);
        }
    };

    /* ============================
            FETCH PRODUCTS
    ============================ */

    const fetchProducts = async () => {
        try {
            const res: any = await getProducts();

            setProducts(Array.isArray(res) ? res : []);
        } catch (err) {
            console.log(err);
        }
    };

    /* ============================
            FETCH CATEGORIES
    ============================ */

    const fetchCategories = async () => {
        try {
            const res: any = await getCategories();

            setCategories(Array.isArray(res) ? res : []);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchCoupons();
        fetchProducts();
        fetchCategories();
    }, []);

    /* ============================
            OPEN ADD
    ============================ */

    const openAddModal = () => {
        setIsEdit(false);

        setSelectedCoupon(null);

        setForm(emptyForm);

        setModalOpen(true);
    };

    /* ============================
            OPEN EDIT
    ============================ */

    const openEditModal = (coupon: Coupon) => {
        setIsEdit(true);

        setSelectedCoupon(coupon);

        setForm({
            code: coupon.code,

            description: coupon.description,

            discountType: coupon.discountType,

            discountValue: coupon.discountValue,

            minOrderAmount: coupon.minOrderAmount,

            maxDiscountAmount:
                coupon.maxDiscountAmount || 0,

            usageLimit: coupon.usageLimit,

            startDate: coupon.startDate.slice(0, 10),

            endDate: coupon.endDate.slice(0, 10),

            isActive: coupon.isActive,

            applicableCategories:
                coupon.applicableCategories || [],

            applicableProducts:
                coupon.applicableProducts || [],
        });

        setModalOpen(true);
    };

    /* ============================
            VIEW
    ============================ */

    const openViewModal = (coupon: Coupon) => {
        setSelectedCoupon(coupon);

        setViewModal(true);
    };

    /* ============================
            INPUT CHANGE
    ============================ */

    const handleChange = (
        e:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLTextAreaElement>
            | React.ChangeEvent<HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;

        setForm((prev) => ({
            ...prev,

            [name]:
                type === "number"
                    ? Number(value)
                    : value,
        }));
    };

    /* ============================
        MULTI CATEGORY
    ============================ */

    const toggleCategory = (category: string) => {
        setForm((prev) => ({
            ...prev,

            applicableCategories:
                prev.applicableCategories.includes(category)
                    ? prev.applicableCategories.filter(
                        (c) => c !== category
                    )
                    : [
                        ...prev.applicableCategories,
                        category,
                    ],
        }));
    };

    /* ============================
        MULTI PRODUCT
    ============================ */

    const toggleProduct = (id: string) => {
        setForm((prev) => ({
            ...prev,

            applicableProducts:
                prev.applicableProducts.includes(id)
                    ? prev.applicableProducts.filter(
                        (p) => p !== id
                    )
                    : [...prev.applicableProducts, id],
        }));
    };

    const filteredCoupons = coupons.filter((coupon) =>
        coupon.code.toLowerCase().includes(search.toLowerCase())
    );

    const handleSubmit = async () => {
        try {
            setSaving(true);

            if (isEdit) {
                let reponse = await updateCoupon({ id: selectedCoupon?._id, ...form });
                console.log(reponse, "IN THE RESPONSE")
            } else {
                await createCoupon(form);
            }

            await fetchCoupons();

            setModalOpen(false);
            setForm(emptyForm);
        } catch (err) {
            console.log(err);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteCoupon(id);

            let resp = fetchCoupons();

            console.log(resp, "in the resp")
        } catch (error) {
            console.log(error);
        }
    };

    const toggleStatus = async (coupon: Coupon) => {
        try {
            await deActivateCoupon(coupon._id);
            fetchCoupons();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="space-y-6">

            {/* ================= HEADER ================= */}

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Coupons
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Create and manage discount coupons for your store.
                    </p>
                </div>

                <button
                    onClick={openAddModal}
                    className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                    + Add Coupon
                </button>

            </div>

            {/* ================= SEARCH ================= */}

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search coupon..."
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 lg:max-w-sm"
                />

                <div className="text-sm text-slate-500">
                    Total Coupons :
                    <span className="ml-2 font-bold text-slate-900">
                        {filteredCoupons.length}
                    </span>
                </div>

            </div>

            {/* ================= TABLE ================= */}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow">

                <div className="overflow-x-auto">

                    <table className="min-w-[1200px] w-full">

                        <thead className="bg-slate-700">

                            <tr>

                                <th className="p-4 text-left">
                                    Coupon
                                </th>

                                <th className="p-4 text-left">
                                    Discount
                                </th>

                                <th className="p-4 text-left">
                                    Min Order
                                </th>

                                <th className="p-4 text-left">
                                    Max Discount
                                </th>

                                <th className="p-4 text-left">
                                    Usage
                                </th>

                                <th className="p-4 text-left">
                                    Validity
                                </th>

                                <th className="p-4 text-left">
                                    Status
                                </th>

                                <th className="p-4 text-left">
                                    Actions
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredCoupons.length === 0 && (

                                <tr>

                                    <td
                                        colSpan={8}
                                        className="py-10 text-center text-slate-500"
                                    >
                                        No coupons found.
                                    </td>

                                </tr>

                            )}

                            {filteredCoupons.map((coupon) => (

                                <tr
                                    key={coupon._id}
                                    className="border-t hover:bg-slate-50"
                                >

                                    {/* Coupon */}

                                    <td className="p-4">

                                        <div className="font-bold text-slate-900">
                                            {coupon.code}
                                        </div>

                                        <div className="mt-1 text-sm text-slate-500 line-clamp-2">
                                            {coupon.description || "-"}
                                        </div>

                                    </td>

                                    {/* Discount */}

                                    <td className="p-4">

                                        <span className="font-semibold text-slate-900">

                                            {coupon.discountType === "percentage"
                                                ? `${coupon.discountValue}%`
                                                : `₹${coupon.discountValue}`}

                                        </span>

                                    </td>

                                    {/* Min */}

                                    <td className="p-4 text-slate-700">
                                        ₹{coupon.minOrderAmount}
                                    </td>

                                    {/* Max */}

                                    <td className="p-4 text-slate-700">

                                        {coupon.maxDiscountAmount
                                            ? `₹${coupon.maxDiscountAmount}`
                                            : "-"}

                                    </td>

                                    {/* Usage */}

                                    <td className="p-4">

                                        <span className="font-semibold text-slate-900">
                                            {coupon.usedCount}
                                        </span>

                                        <span className="text-slate-500">
                                            {" "}
                                            / {coupon.usageLimit}
                                        </span>

                                    </td>

                                    {/* Dates */}

                                    <td className="p-4">

                                        <div className="text-sm text-slate-900">

                                            {new Date(
                                                coupon.startDate
                                            ).toLocaleDateString()}

                                        </div>

                                        <div className="text-xs text-slate-500">

                                            to

                                        </div>

                                        <div className="text-sm text-slate-900">

                                            {new Date(
                                                coupon.endDate
                                            ).toLocaleDateString()}

                                        </div>

                                    </td>

                                    {/* Status */}

                                    <td className="p-4">

                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold

                                        ${coupon.isActive
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}
                                        >

                                            {coupon.isActive
                                                ? "Active"
                                                : "Inactive"}

                                        </span>

                                    </td>

                                    {/* Actions */}

                                    <td className="p-4">

                                        <div className="flex flex-wrap gap-2">

                                            <button onClick={() => openViewModal(coupon)} className="rounded-lg bg-slate-800 px-3 py-1 text-sm text-white transition hover:bg-black">
                                                <Eye size={18} />
                                            </button>

                                            <button onClick={() => openEditModal(coupon)} className="rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700">
                                                <Pencil size={18} />
                                            </button>

                                            <button onClick={() => toggleStatus(coupon)} className="rounded-lg bg-yellow-500 p-2 text-white hover:bg-yellow-600">
                                                <Power size={18} />
                                            </button>

                                            <button className="rounded bg-red-500 px-3 py-1 text-white text-sm" onClick={() => handleDelete(coupon._id)}>
                                                <Trash2 size={18} />
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

            {/* ================= VIEW MODAL ================= */}

            {viewModal && selectedCoupon && (

                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
                    onClick={() => setViewModal(false)}
                >

                    <div
                        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* Header */}

                        <div className="sticky top-0 flex items-center justify-between border-b bg-white px-8 py-5">

                            <div>

                                <h2 className="text-2xl font-bold text-slate-900">
                                    Coupon Details
                                </h2>

                                <p className="text-sm text-slate-500">
                                    Complete coupon information
                                </p>

                            </div>

                            <button
                                onClick={() => setViewModal(false)}
                                className="rounded-lg bg-slate-100 px-4 py-2 font-medium text-slate-700 hover:bg-slate-200"
                            >
                                Close
                            </button>

                        </div>

                        {/* Body */}

                        <div className="space-y-8 p-8">

                            {/* Basic */}

                            <div>

                                <h3 className="mb-4 text-lg font-bold text-slate-900">
                                    Basic Information
                                </h3>

                                <div className="grid gap-5 md:grid-cols-2">

                                    <div>

                                        <p className="text-sm text-slate-500">
                                            Coupon Code
                                        </p>

                                        <p className="font-semibold text-slate-900">
                                            {selectedCoupon.code}
                                        </p>

                                    </div>

                                    <div>

                                        <p className="text-sm text-slate-500">
                                            Status
                                        </p>

                                        <span
                                            className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold

                                        ${selectedCoupon.isActive
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {selectedCoupon.isActive
                                                ? "Active"
                                                : "Inactive"}
                                        </span>

                                    </div>

                                </div>

                                <div className="mt-5">

                                    <p className="text-sm text-slate-500">
                                        Description
                                    </p>

                                    <p className="mt-2 text-slate-800">
                                        {selectedCoupon.description || "-"}
                                    </p>

                                </div>

                            </div>

                            {/* Discount */}

                            <div>

                                <h3 className="mb-4 text-lg font-bold text-slate-900">
                                    Discount
                                </h3>

                                <div className="grid gap-5 md:grid-cols-2">

                                    <div>

                                        <p className="text-sm text-slate-500">
                                            Discount Type
                                        </p>

                                        <p className="font-semibold capitalize text-slate-900">
                                            {selectedCoupon.discountType}
                                        </p>

                                    </div>

                                    <div>

                                        <p className="text-sm text-slate-500">
                                            Discount Value
                                        </p>

                                        <p className="font-semibold text-green-600">

                                            {selectedCoupon.discountType === "percentage"
                                                ? `${selectedCoupon.discountValue}%`
                                                : `₹${selectedCoupon.discountValue}`}

                                        </p>

                                    </div>

                                    <div>

                                        <p className="text-sm text-slate-500">
                                            Minimum Order
                                        </p>

                                        <p className="font-semibold text-slate-900">
                                            ₹{selectedCoupon.minOrderAmount}
                                        </p>

                                    </div>

                                    <div>

                                        <p className="text-sm text-slate-500">
                                            Maximum Discount
                                        </p>

                                        <p className="font-semibold text-slate-900">

                                            {selectedCoupon.maxDiscountAmount
                                                ? `₹${selectedCoupon.maxDiscountAmount}`
                                                : "-"}

                                        </p>

                                    </div>

                                </div>

                            </div>

                            {/* Usage */}

                            <div>

                                <h3 className="mb-4 text-lg font-bold text-slate-900">
                                    Usage
                                </h3>

                                <div className="grid gap-5 md:grid-cols-2">

                                    <div>

                                        <p className="text-sm text-slate-500">
                                            Usage Limit
                                        </p>

                                        <p className="font-semibold text-slate-900">
                                            {selectedCoupon.usageLimit}
                                        </p>

                                    </div>

                                    <div>

                                        <p className="text-sm text-slate-500">
                                            Used Count
                                        </p>

                                        <p className="font-semibold text-slate-900">
                                            {selectedCoupon.usedCount}
                                        </p>

                                    </div>

                                </div>

                            </div>

                            {/* Validity */}

                            <div>

                                <h3 className="mb-4 text-lg font-bold text-slate-900">
                                    Validity
                                </h3>

                                <div className="grid gap-5 md:grid-cols-2">

                                    <div>

                                        <p className="text-sm text-slate-500">
                                            Start Date
                                        </p>

                                        <p className="font-semibold text-slate-900">

                                            {new Date(
                                                selectedCoupon.startDate
                                            ).toLocaleDateString()}

                                        </p>

                                    </div>

                                    <div>

                                        <p className="text-sm text-slate-500">
                                            End Date
                                        </p>

                                        <p className="font-semibold text-slate-900">

                                            {new Date(
                                                selectedCoupon.endDate
                                            ).toLocaleDateString()}

                                        </p>

                                    </div>

                                </div>

                            </div>

                            {/* Categories */}

                            <div>

                                <h3 className="mb-4 text-lg font-bold text-slate-900">
                                    Applicable Categories
                                </h3>

                                <div className="flex flex-wrap gap-2">

                                    {selectedCoupon.applicableCategories.length > 0 ? (

                                        selectedCoupon.applicableCategories.map(
                                            (category, index) => (

                                                <span
                                                    key={index}
                                                    className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700"
                                                >
                                                    {category}
                                                </span>

                                            )
                                        )

                                    ) : (

                                        <span className="text-slate-500">
                                            All Categories
                                        </span>

                                    )}

                                </div>

                            </div>

                            {/* Products */}

                            <div>

                                <h3 className="mb-4 text-lg font-bold text-slate-900">
                                    Applicable Products
                                </h3>

                                <div className="flex flex-wrap gap-2">

                                    {selectedCoupon.applicableProducts.length > 0 ? (

                                        selectedCoupon.applicableProducts.map(
                                            (productId) => {

                                                const product = products.find(
                                                    (p) => p._id === productId
                                                );

                                                return (

                                                    <span
                                                        key={productId}
                                                        className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700"
                                                    >
                                                        {product?.name || productId}
                                                    </span>

                                                );

                                            }
                                        )

                                    ) : (

                                        <span className="text-slate-500">
                                            All Products
                                        </span>

                                    )}

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            )}


            {/* ================= ADD / EDIT MODAL ================= */}

            {modalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
                    onClick={() => setModalOpen(false)}
                >
                    <div
                        className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}

                        <div className="sticky top-0 z-20 flex items-center justify-between border-b bg-white px-8 py-5">

                            <div>

                                <h2 className="text-2xl font-bold text-slate-900">

                                    {isEdit
                                        ? "Edit Coupon"
                                        : "Create Coupon"}

                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Configure your coupon settings.
                                </p>

                            </div>

                            <button
                                onClick={() => setModalOpen(false)}
                                className="rounded-lg bg-slate-100 px-4 py-2 text-slate-700 hover:bg-slate-200"
                            >
                                Close
                            </button>

                        </div>

                        {/* BODY */}

                        <div className="space-y-8 p-8">

                            {/* ================= BASIC ================= */}

                            <div>

                                <h3 className="mb-5 text-lg font-bold text-slate-900">
                                    Basic Information
                                </h3>

                                <div className="grid gap-6 md:grid-cols-2">

                                    <div>

                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            Coupon Code
                                        </label>

                                        <input
                                            name="code"
                                            value={form.code}
                                            onChange={handleChange}
                                            placeholder="SAVE100"
                                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-600"
                                        />

                                    </div>

                                    <div>

                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            Discount Type
                                        </label>

                                        <select
                                            name="discountType"
                                            value={form.discountType}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-600"
                                        >
                                            <option value="percentage">
                                                Percentage
                                            </option>

                                            <option value="fixed">
                                                Fixed Amount
                                            </option>

                                        </select>

                                    </div>

                                </div>

                                <div className="mt-6">

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Description
                                    </label>

                                    <textarea
                                        rows={4}
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        placeholder="Coupon description..."
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-600"
                                    />

                                </div>

                            </div>

                            {/* ================= DISCOUNT ================= */}

                            <div>

                                <h3 className="mb-5 text-lg font-bold text-slate-900">
                                    Discount Details
                                </h3>

                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

                                    <div>

                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            Discount Value
                                        </label>

                                        <input
                                            type="number"
                                            name="discountValue"
                                            value={form.discountValue}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900"
                                        />

                                    </div>

                                    <div>

                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            Minimum Order
                                        </label>

                                        <input
                                            type="number"
                                            name="minOrderAmount"
                                            value={form.minOrderAmount}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900"
                                        />

                                    </div>

                                    <div>

                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            Maximum Discount
                                        </label>

                                        <input
                                            type="number"
                                            name="maxDiscountAmount"
                                            value={form.maxDiscountAmount}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900"
                                        />

                                    </div>

                                    <div>

                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            Usage Limit
                                        </label>

                                        <input
                                            type="number"
                                            name="usageLimit"
                                            value={form.usageLimit}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900"
                                        />

                                    </div>

                                </div>

                            </div>

                            {/* ================= DATES ================= */}

                            <div>

                                <h3 className="mb-5 text-lg font-bold text-slate-900">
                                    Validity
                                </h3>

                                <div className="grid gap-6 md:grid-cols-2">

                                    <div>

                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            Start Date
                                        </label>

                                        <input
                                            type="date"
                                            name="startDate"
                                            value={form.startDate}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900"
                                        />

                                    </div>

                                    <div>

                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            End Date
                                        </label>

                                        <input
                                            type="date"
                                            name="endDate"
                                            value={form.endDate}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900"
                                        />

                                    </div>

                                </div>

                            </div>

                            {/* ================= STATUS ================= */}

                            <div className="rounded-2xl border border-slate-200 p-5">

                                <label className="flex items-center gap-4">

                                    <input
                                        type="checkbox"
                                        checked={form.isActive}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                isActive: e.target.checked,
                                            })
                                        }
                                        className="h-5 w-5"
                                    />

                                    <div>

                                        <p className="font-semibold text-slate-900">
                                            Active Coupon
                                        </p>

                                        <p className="text-sm text-slate-500">
                                            Coupon can be used by customers.
                                        </p>

                                    </div>

                                </label>

                            </div>

                            {/* ================= CATEGORIES ================= */}

                            <div>

                                <h3 className="mb-4 text-lg font-bold text-slate-900">
                                    Applicable Categories
                                </h3>

                                <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">

                                    {categories.map((category) => (

                                        <label
                                            key={category._id}
                                            className="flex cursor-pointer items-center gap-3 rounded-xl border p-3 hover:bg-slate-50"
                                        >

                                            <input
                                                type="checkbox"
                                                checked={form.applicableCategories.includes(
                                                    category.categoryName
                                                )}
                                                onChange={() =>
                                                    toggleCategory(
                                                        category.categoryName
                                                    )
                                                }
                                            />

                                            <span className="text-slate-800">

                                                {category.categoryName}

                                            </span>

                                        </label>

                                    ))}

                                </div>

                            </div>
                            {/* ================= PRODUCTS ================= */}

                            <div>

                                <h3 className="mb-4 text-lg font-bold text-slate-900">
                                    Applicable Products
                                </h3>

                                <div className="max-h-72 overflow-y-auto rounded-2xl border border-slate-200 p-4">

                                    <div className="grid gap-3 md:grid-cols-2">

                                        {products.map((product) => (

                                            <label
                                                key={product._id}
                                                className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:bg-slate-50"
                                            >

                                                <input
                                                    type="checkbox"
                                                    checked={form.applicableProducts.includes(
                                                        product._id
                                                    )}
                                                    onChange={() =>
                                                        toggleProduct(product._id)
                                                    }
                                                />

                                                <span className="font-medium text-slate-800">
                                                    {product.name}
                                                </span>

                                            </label>

                                        ))}

                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* ================= FOOTER ================= */}

                        <div className="sticky bottom-0 flex justify-end gap-3 border-t bg-white px-8 py-5">

                            <button
                                onClick={() => {
                                    setModalOpen(false);
                                    setForm(emptyForm);
                                }}
                                className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
                            >
                                Cancel
                            </button>

                            <button
                                disabled={saving}
                                onClick={handleSubmit}
                                className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {saving ? "Saving..." : isEdit ? "Update Coupon" : "Create Coupon"}
                            </button>

                        </div>

                    </div>

                </div>

            )}
        </div>
    );
}