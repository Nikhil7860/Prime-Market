"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Search, Plus, Pencil, Trash2, Power, X, Loader2 } from "lucide-react";

import { postRequest, putRequest } from "../../../services/apiMethods";
import { deleteProductApi, getProducts, updateProductStatus } from "@/services/product.service";

interface Product {
    _id: string;
    name: string;
    price: number;
    stock: number;
    description: string;
    category: string;
    images: string[];
    isActive: boolean;
}

const emptyForm = {
    name: "",
    price: "",
    stock: "",
    description: "",
    category: "",
    image: "",
    isActive: true,
};

export default function ProductSection() {
    const [products, setProducts] = useState<Product[]>([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(false);

    const [saving, setSaving] = useState(false);

    const [imageFile, setImageFile] = useState<File | null>(null);

    // Edit Modal
    const [editOpen, setEditOpen] = useState(false);

    // Create Modal
    const [createOpen, setCreateOpen] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const [form, setForm] = useState<any>(emptyForm);

    //---------------------------------------
    // Fetch Products
    //---------------------------------------

    const fetchProducts = async () => {
        try {
            const data: any = await getProducts();
            setProducts(Array.isArray(data) ? data : data || []);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    //---------------------------------------
    // Search Filter
    //---------------------------------------

    const filteredProducts = useMemo(() => {
        return products.filter(
            (product) =>
                product.name
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                product.category
                    .toLowerCase().includes(search.toLowerCase())
        );
    }, [products, search]);

    //---------------------------------------
    // Toggle Status
    //---------------------------------------

    const toggleStatus = async (product: Product) => {
        try {
            let response = await updateProductStatus({ id: product._id, status: !product.isActive, });

            toast.success("Status Updated");

            fetchProducts();
        } catch {
            toast.error("Unable to update status");
        }
    };

    //---------------------------------------
    // Open Edit Modal
    //---------------------------------------

    const openEditModal = (product: Product) => {
        setSelectedProduct(product);

        setForm({
            name: product.name,
            price: product.price,
            stock: product.stock,
            description: product.description,
            category: product.category,
            image: product.images,
            isActive: product.isActive,
        });

        setImageFile(null); // ✅ reset file
        setEditOpen(true);
    };


    //---------------------------------------
    // Close Edit Modal
    //---------------------------------------

    const closeEditModal = () => {
        setSelectedProduct(null);
        setForm(emptyForm);
        setImageFile(null); // ✅ reset file
        setEditOpen(false);
    };

    //---------------------------------------
    // Update Product
    //---------------------------------------

    const updateProduct = async () => {
        if (!selectedProduct) return;

        try {
            setSaving(true);

            let imageUrl = form.image;

            if (imageFile) {
                imageUrl = await uploadToCloudinary(imageFile);
            }

            const fd = new FormData();

            fd.append("id", selectedProduct._id);
            fd.append("name", form.name);
            fd.append("price", String(form.price));
            fd.append("stock", String(form.stock));
            fd.append("description", form.description);
            fd.append("category", form.category);
            fd.append("image", imageUrl); // ✅ Cloudinary URL
            fd.append("isActive", String(form.isActive));

            await putRequest("products/edit", fd);

            toast.success("Product Updated");

            closeEditModal();
            fetchProducts();
        } catch (err) {
            console.log(err);
            toast.error("Update Failed");
        } finally {
            setSaving(false);
        }
    };

    //---------------------------------------
    // Create Product
    //---------------------------------------

    const createProduct = async () => {
        try {
            setSaving(true);

            let imageUrl = form.image;

            if (imageFile) {
                imageUrl = await uploadToCloudinary(imageFile);
            }

            const fd = new FormData();

            fd.append("name", form.name);
            fd.append("price", String(form.price));
            fd.append("stock", String(form.stock));
            fd.append("description", form.description);
            fd.append("category", form.category);
            fd.append("image", imageUrl); // ✅ Cloudinary URL
            fd.append("isActive", String(form.isActive));

            await postRequest("products/create", fd);

            toast.success("Product Created");

            setCreateOpen(false);
            setForm(emptyForm);
            setImageFile(null);
            fetchProducts();
        } catch (err) {
            console.log(err);
            toast.error("Create Failed");
        } finally {
            setSaving(false);
        }
    };

    //---------------------------------------
    // Delete Product
    //---------------------------------------

    const deleteProduct = async (id: string) => {
        const confirmDelete = window.confirm("Delete this product?");
        if (!confirmDelete) return;
        try {
            await deleteProductApi(id);
            toast.success("Product Deleted");
            fetchProducts();
        } catch {
            toast.error("Delete Failed");
        }
    };


    const uploadToCloudinary = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append(
            "upload_preset",
            process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
        );

        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
                method: "POST",
                body: formData,
            }
        );

        const data = await res.json();
        return data.secure_url;
    };


    return (
        <>
            <div className="space-y-6">

                {/* Header */}

                <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <h1 className="text-2xl font-bold text-slate-900">
                            Products
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Manage all your products
                        </p>

                    </div>

                    <button
                        onClick={() => {
                            setForm(emptyForm);
                            setCreateOpen(true);
                        }}
                        className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                        <Plus size={20} />

                        Create Product
                    </button>

                </div>

                {/* Search */}

                <div className="relative">

                    <Search
                        size={20}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        placeholder="Search products..."
                        className="w-full rounded-xl border border-slate-300 bg-black py-3 pl-12 pr-4 outline-none focus:border-blue-500"
                    />

                </div>

                {/* Loading */}

                {loading ? (

                    <div className="flex justify-center py-20">

                        <Loader2
                            size={40}
                            className="animate-spin text-blue-600"
                        />

                    </div>

                ) : (

                    <>
                        {/* Desktop Table */}

                        <div className="hidden overflow-x-auto rounded-2xl bg-white shadow lg:block">

                            <table className="w-full">

                                <thead className="bg-blue-600 text-white">

                                    <tr>

                                        <th className="p-4 text-left">
                                            Product
                                        </th>

                                        <th className="p-4 text-left">
                                            Category
                                        </th>

                                        <th className="p-4 text-left">
                                            Price
                                        </th>

                                        <th className="p-4 text-left">
                                            Stock
                                        </th>

                                        <th className="p-4 text-left">
                                            Status
                                        </th>

                                        <th className="p-4 text-center">
                                            Actions
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {filteredProducts.map((product: any) => (
                                        <tr key={product._id} className="border-b hover:bg-slate-50">

                                            {/* Product */}

                                            <td className="p-4">

                                                <div className="flex items-center gap-4">

                                                    <img src={product.images[0].image} className="h-16 w-16 rounded-xl border object-cover" />
                                                    <div>
                                                        <h3 className="mt-1 max-w-xs truncate text-sm text-slate-500">{product.name}</h3>
                                                        <p className="mt-1 max-w-xs truncate text-sm text-slate-500">{product.description}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="p-4 text-slate-700"> {product.categoryName}</td>

                                            <td className="p-4 font-semibold text-green-600"> ₹ {product.price.toLocaleString()}</td>

                                            <td className="p-4 text-slate-700">{product.stock}</td>

                                            <td className="p-4">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${product.isActive ? "bg-green-600" : "bg-red-600"}`}>
                                                    {product.isActive ? "ACTIVE" : "INACTIVE"}
                                                </span>
                                            </td>

                                            <td className="p-4">
                                                <div className="flex justify-center gap-2">
                                                    <button onClick={() => toggleStatus(product)} className="rounded-lg bg-yellow-500 p-2 text-white hover:bg-yellow-600">
                                                        <Power size={18} />
                                                    </button>
                                                    <button onClick={() => openEditModal(product)} className="rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700">
                                                        <Pencil size={18} />
                                                    </button>

                                                    <button onClick={() => deleteProduct(product._id)} className="rounded-lg bg-red-600 p-2 text-white hover:bg-red-700">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}

                        <div className="space-y-4 lg:hidden">
                            {filteredProducts.map((product: any) => (
                                <div key={product._id} className="rounded-2xl bg-white p-5 shadow">
                                    <div className="flex gap-4">
                                        <img src={product.images[0].image} className="h-24 w-24 rounded-xl border object-cover" />
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-bold">{product.name}</h3>
                                            <p className="mt-1 line-clamp-2 text-sm text-slate-500">{product.description}</p>
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">{product.category}</span>
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs text-white ${product.isActive ? "bg-green-600" : "bg-red-600"}`}>
                                                    {product.isActive ? "ACTIVE" : "INACTIVE"}
                                                </span>
                                            </div>

                                            <div className="mt-4">
                                                <p className="font-bold text-green-600">₹ {product.price.toLocaleString()}</p>
                                                <p className="text-sm text-slate-500">Stock : {product.stock}</p>
                                            </div>

                                            <div className="mt-5 flex gap-2">

                                                <button onClick={() => toggleStatus(product)} className="rounded-lg bg-yellow-500 p-2 text-white">
                                                    <Power size={18} />
                                                </button>

                                                <button onClick={() => openEditModal(product)} className="rounded-lg bg-blue-600 p-2 text-white">
                                                    <Pencil size={18} />
                                                </button>

                                                <button onClick={() => deleteProduct(product._id)} className="rounded-lg bg-red-600 p-2 text-white">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>

                )}

            </div>

            {/* ================= EDIT PRODUCT MODAL ================= */}

            {editOpen && selectedProduct && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
                        {/* Header */}
                        <div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-4">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900"> Edit Product</h2>
                                <p className="text-sm text-slate-500">Update product information</p>
                            </div>

                            <button onClick={closeEditModal} className="rounded-lg p-2 transition hover:bg-slate-100">
                                <X size={22} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="space-y-5 p-6">
                            {/* Product ID */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">Product ID</label>
                                <input value={selectedProduct._id} readOnly className="w-full rounded-xl border border-slate-300 bg-slate-100 p-3 text-slate-700" />
                            </div>

                            {/* Name */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">Product Name</label>
                                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none focus:border-blue-500" />
                            </div>

                            {/* Price + Stock */}
                            <div className="grid gap-5 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">Price</label>
                                    <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700"> Stock</label>
                                    <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Category */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700"> Category</label>
                                <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none focus:border-blue-500" />
                            </div>

                            {/* Image */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Upload Image
                                </label>

                                <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0] || null; setImageFile(file); }} className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900"
                                />
                            </div>

                            {/* Preview */}
                            {(imageFile || form.image) && (
                                <div className="flex justify-center">
                                    <img src={imageFile ? URL.createObjectURL(imageFile) : form.image} className="h-44 rounded-xl border object-cover" />
                                </div>
                            )}

                            {/* Description */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">Description</label>

                                <textarea rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Write product description..." className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500" />
                            </div>

                            {/* Status */}
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={form.isActive}
                                    onChange={(e) =>
                                        setForm({ ...form, isActive: e.target.checked })
                                    }
                                    className="h-4 w-4 accent-blue-600"
                                />
                                <span className="font-medium text-slate-700">
                                    Active Product
                                </span>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="sticky bottom-0 flex justify-end gap-3 border-t bg-white px-6 py-4">

                            <button
                                onClick={closeEditModal}
                                className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                disabled={saving}
                                onClick={updateProduct}
                                className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                {saving && <Loader2 size={18} className="animate-spin" />}
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ================= CREATE PRODUCT MODAL ================= */}

            {createOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">

                    <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

                        {/* Header */}
                        <div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-4">

                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">
                                    Create Product
                                </h2>
                                <p className="text-sm text-slate-500">
                                    Add a new product to your store
                                </p>
                            </div>

                            <button
                                onClick={() => {
                                    setCreateOpen(false);
                                    setForm(emptyForm);
                                }}
                                className="rounded-lg p-2 transition hover:bg-slate-100"
                            >
                                <X size={22} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="space-y-5 p-6">

                            {/* Name */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Product Name
                                </label>

                                <input
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm({ ...form, name: e.target.value })
                                    }
                                    placeholder="Enter product name"
                                    className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500"
                                />
                            </div>

                            {/* Price + Stock */}
                            <div className="grid gap-5 md:grid-cols-2">

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Price
                                    </label>

                                    <input
                                        type="number"
                                        value={form.price}
                                        onChange={(e) =>
                                            setForm({ ...form, price: e.target.value })
                                        }
                                        placeholder="Enter price"
                                        className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Stock
                                    </label>

                                    <input
                                        type="number"
                                        value={form.stock}
                                        onChange={(e) =>
                                            setForm({ ...form, stock: e.target.value })
                                        }
                                        placeholder="0"
                                        className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Category */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Category
                                </label>

                                <input
                                    value={form.category}
                                    onChange={(e) =>
                                        setForm({ ...form, category: e.target.value })
                                    }
                                    placeholder="Electronics"
                                    className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500"
                                />
                            </div>

                            {/* Image */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Upload Image
                                </label>

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0] || null;
                                        setImageFile(file);
                                    }}
                                    className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900"
                                />
                            </div>

                            {/* Preview */}
                            {(imageFile || form.image) && (
                                <div className="flex justify-center">
                                    <img
                                        src={
                                            imageFile
                                                ? URL.createObjectURL(imageFile)
                                                : form.image
                                        }
                                        className="h-44 rounded-xl border object-cover"
                                    />
                                </div>
                            )}

                            {/* Description */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Description
                                </label>

                                <textarea
                                    rows={5}
                                    value={form.description}
                                    onChange={(e) =>
                                        setForm({ ...form, description: e.target.value })
                                    }
                                    placeholder="Write product description..."
                                    className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500"
                                />
                            </div>

                            {/* Active */}
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={form.isActive}
                                    onChange={(e) =>
                                        setForm({ ...form, isActive: e.target.checked })
                                    }
                                    className="h-4 w-4 accent-blue-600"
                                />
                                <span className="font-medium text-slate-700">
                                    Active Product
                                </span>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="sticky bottom-0 flex justify-end gap-3 border-t bg-white px-6 py-4">

                            <button
                                onClick={() => { setCreateOpen(false); setForm(emptyForm); }}
                                className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                disabled={saving}
                                onClick={createProduct}
                                className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                {saving && <Loader2 size={18} className="animate-spin" />}
                                Create Product
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}




