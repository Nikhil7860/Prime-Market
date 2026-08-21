"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Search, Plus, Pencil, Trash2, Power, X, Loader2 } from "lucide-react";
import { postRequest, putRequest } from "../../../services/apiMethods";
import { deleteProductApi, getProducts, updateProductStatus } from "@/services/product.service";
import { getCategories } from "@/services/category.service";
import { useAppSelector } from "@/hooks/redux";

interface ProductImage {
    image: string;
    name: string;
}

type ImageFile = { file: File; preview: string; };

interface ProductSpecification {
    [key: string]: string;
}

interface Product {
    _id: string;
    name: string;
    slug: string;
    description: string;
    category: string;
    categoryName: string;
    brand: string;
    images: ProductImage[];
    price: number;
    discountPercentage: number;
    stock: number;
    rating: number;
    reviews: number;
    highlights: string[];
    specifications: ProductSpecification;
    isFeatured: boolean;
    isActive: boolean;
    addedBy: string;
    updatedBy: { user: string; updatedAt: string; }[];
    createdAt: string;
    updatedAt: string;
}

interface Category {
    _id: string;
    categoryName: string;
}


const emptyForm = {
    name: "",
    slug: "",
    brand: "",
    category: "",
    categoryName: "",
    description: "",
    price: "",
    discountPercentage: 0,
    stock: "",
    images: [],
    highlights: [""],
    specifications: [{ key: "", value: "", },],
    isFeatured: false,
    isActive: true,
};

export default function ProductSection() {
    const [products, setProducts] = useState<Product[]>([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(false);

    const [saving, setSaving] = useState(false);

    const [imageFiles, setImageFiles] = useState<{ file: File; preview: string; }[]>([]);

    // Edit Modal
    const [editOpen, setEditOpen] = useState(false);

    // Create Modal
    const [createOpen, setCreateOpen] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const [form, setForm] = useState<any>(emptyForm);

    const [categories, setCategories] = useState<Category[]>([]);

    const user = useAppSelector((state: any) => state.auth.user);
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
        fetchProducts();
        fetchCategories();
    }, []);

    //---------------------------------------
    // Search Filter
    //---------------------------------------

    const filteredProducts = useMemo(() => {
        return products.filter(
            (product) =>
                product.name.toLowerCase().includes(search.toLowerCase()) ||
                product.category.toLowerCase().includes(search.toLowerCase()));
    }, [products, search]);

    //---------------------------------------
    // Toggle Status
    //---------------------------------------

    const toggleStatus = async (product: Product) => {
        try {
            await updateProductStatus({ id: product._id, status: !product.isActive, });
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
            slug: product.slug,
            brand: product.brand,
            category: product.category,
            categoryName: product.categoryName,
            description: product.description,
            price: product.price,
            discountPercentage: product.discountPercentage,
            stock: product.stock,
            images: product.images,
            highlights: product.highlights,
            specifications: Object.entries(product.specifications || {}).map(([key, value]) => ({ key, value, })),
            isFeatured: product.isFeatured,
            isActive: product.isActive,
        });
        setImageFiles([...product.images] as any);
        setEditOpen(true);
    };


    const removeExistingImage = (index: number) => {
        setForm((prev: any) => ({
            ...prev,
            images: prev.images.filter(
                (_: any, i: number) => i !== index
            ),
        }));
    };


    const removeNewImage = (index: number) => {
        setImageFiles((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };

    //---------------------------------------
    // Close Edit Modal
    //---------------------------------------

    const closeEditModal = () => {
        setSelectedProduct(null);
        setForm(emptyForm);
        setEditOpen(false);
    };

    //---------------------------------------
    // Update Product
    //---------------------------------------

    const updateProduct = async () => {
        if (!selectedProduct) return;
        try {
            setSaving(true);

            let imageUrls: any = [];

            if (imageFiles.length > 0) {


                imageUrls = await Promise.all(
                    imageFiles.map(async (item: any) => {
                        if (item.preview && item.file) {
                            const imageUrl = await uploadToCloudinary(item.file);
                            return { image: imageUrl, name: item.file.name, };
                        }
                        return { image: item.image, name: item.name, _id: item._id, };
                    }));


            }

            // console.log(imageUrls, "Cloudinary image URLs");

            // const images = imageFiles.map((item, index) => ({ image: imageUrls[index], name: item.file.name, }));

            // console.log(images, "Final images");

            const payload = {
                id: selectedProduct._id,
                name: form.name,
                price: Number(form.price),
                stock: Number(form.stock),
                description: form.description,
                category: form.category,
                images: imageUrls,
                isActive: form.isActive,
                userId: user._id
            };

            const response = await putRequest("products/updateProduct", payload);

            toast.success("Product Updated Sucessfully");

            closeEditModal();

            setForm(emptyForm);

            imageFiles.forEach((item) => { URL.revokeObjectURL(item.preview); });

            setImageFiles([]);

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
            let imageUrls: string[] = [];

            if (imageFiles.length > 0) {
                imageUrls = await Promise.all(imageFiles.map((item) => uploadToCloudinary(item.file)));
            }

            const images = imageFiles.map((item, index) => ({ image: imageUrls[index], name: item.file.name, }));

            const payload = {
                name: form.name,
                price: Number(form.price),
                stock: Number(form.stock),
                description: form.description,
                category: form.category,
                images,
                isActive: form.isActive,
                userId: user._id
            };
            const response = await postRequest("products/addProduct", payload);
            toast.success("Product Created Sucessfully");

            setCreateOpen(false);
            setForm(emptyForm);

            imageFiles.forEach((item) => {
                URL.revokeObjectURL(item.preview);
            });

            setImageFiles([]);

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

    // ------------------------------------------------- 
    // Upload Array of image to Cloudinary 
    // --------------------------------------------------


    const uploadToCloudinary = async (file: File): Promise<string> => {

        const formData = new FormData();

        formData.append("file", file);

        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: formData });

        const data = await res.json();


        if (!res.ok) {
            console.error("Cloudinary error:", data);
            throw new Error(data?.error?.message || "Cloudinary upload failed");
        }

        return data.secure_url;
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const files = Array.from(e.target.files);
        const newImages: ImageFile[] = files.map((file) => ({ file, preview: URL.createObjectURL(file), }));
        setImageFiles((prev) => [...prev, ...newImages]);
        e.target.value = "";
    }

    const removeImage = (index: number) => {
        setImageFiles((prev) => {
            const imageToRemove = prev[index];
            if (imageToRemove) {
                URL.revokeObjectURL(imageToRemove.preview);
            }
            return prev.filter((_, i) => i !== index);
        });
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

                                                    <img src={product.images[0]?.image} className="h-16 w-16 rounded-xl border object-cover" />
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

                                                    <button onClick={() => deleteProduct(product._id)} className="rounded bg-red-500 px-3 py-1 text-white text-sm">
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
                                        <img src={product.images[0]?.image} className="h-24 w-24 rounded-xl border object-cover" />
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-bold">{product.name}</h3>
                                            <p className="mt-1 line-clamp-2 text-sm text-slate-500">{product.description}</p>
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                <span className={`rounded-full px-3 py-1 text-xs text-white ${product.isActive ? "bg-green-600" : "bg-red-600"}`}>{product.categoryName}</span>
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

                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">

                    <div className="relative max-h-[95vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

                        {/* ================= Header ================= */}

                        <div className="sticky top-0 z-20 flex items-center justify-between border-b bg-white px-8 py-6">

                            <div>

                                <h2 className="text-3xl font-bold text-slate-900">
                                    Edit Product
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Update your product information.
                                </p>

                            </div>

                            <button
                                onClick={closeEditModal}
                                className="rounded-xl p-2 transition hover:bg-slate-100">
                                <X size={24} />
                            </button>

                        </div>

                        {/* ================= Body ================= */}

                        <div className="space-y-8 p-8">

                            {/* =======================================================
                                            BASIC INFORMATION
                                ======================================================= */}

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">

                                <h3 className="mb-6 text-xl font-semibold text-slate-800">
                                    Basic Information
                                </h3>

                                <div className="grid gap-6 md:grid-cols-2">

                                    {/* Product ID */}

                                    <div>

                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            Product ID
                                        </label>

                                        <input
                                            readOnly
                                            value={selectedProduct._id}
                                            className="w-full rounded-xl border border-slate-300 bg-slate-200 p-3 text-slate-700"
                                        />

                                    </div>

                                    {/* Product Name */}

                                    <div>

                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            Product Name
                                        </label>

                                        <input
                                            type="text"
                                            value={form.name}
                                            placeholder="Product Name"
                                            onChange={(e) => {

                                                const name = e.target.value;

                                                setForm((prev: any) => ({
                                                    ...prev,
                                                    name,
                                                    slug: name
                                                        .toLowerCase()
                                                        .trim()
                                                        .replace(/\s+/g, "-")
                                                        .replace(/[^\w-]+/g, ""),
                                                }));

                                            }}
                                            className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-blue-500"
                                        />

                                    </div>

                                    {/* Slug */}

                                    <div>

                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            Slug
                                        </label>

                                        <input
                                            type="text"
                                            value={form.slug}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    slug: e.target.value,
                                                })
                                            }
                                            className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-blue-500"
                                        />

                                        <p className="mt-1 text-xs text-slate-500">
                                            Auto generated from product name.
                                        </p>

                                    </div>

                                    {/* Brand */}

                                    <div>

                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            Brand
                                        </label>

                                        <input
                                            type="text"
                                            value={form.brand}
                                            placeholder="Brand"
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    brand: e.target.value,
                                                })
                                            }
                                            className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-blue-500"
                                        />

                                    </div>

                                    {/* Category */}

                                    <div className="md:col-span-2">

                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            Category
                                        </label>

                                        <select
                                            value={form.category}
                                            onChange={(e) => {

                                                const selected = categories.find(
                                                    (cat: any) =>
                                                        cat._id === e.target.value
                                                );

                                                setForm((prev: any) => ({
                                                    ...prev,
                                                    category: selected?._id || "",
                                                    categoryName:
                                                        selected?.categoryName || "",
                                                }));

                                            }}
                                            className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-blue-500"
                                        >

                                            <option value="">
                                                Select Category
                                            </option>

                                            {categories.map((category: any) => (

                                                <option
                                                    key={category._id}
                                                    value={category._id}
                                                >
                                                    {category.categoryName}
                                                </option>

                                            ))}

                                        </select>

                                    </div>

                                </div>

                            </div>


                            {/* =======================================================
                                            PRICING & INVENTORY
                                ======================================================= */}

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">

                                <h3 className="mb-6 text-xl font-semibold text-slate-800">
                                    Pricing & Inventory
                                </h3>

                                <div className="grid gap-6 md:grid-cols-3">

                                    {/* Price */}

                                    <div>

                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            Price (₹)
                                        </label>

                                        <input
                                            type="number"
                                            min={0}
                                            value={form.price}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    price: e.target.value,
                                                })
                                            }
                                            className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-blue-500"
                                        />

                                    </div>

                                    {/* Discount */}

                                    <div>

                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            Discount (%)
                                        </label>

                                        <input
                                            type="number"
                                            min={0}
                                            max={100}
                                            value={form.discountPercentage}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    discountPercentage: Number(e.target.value),
                                                })
                                            }
                                            className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-blue-500"
                                        />

                                    </div>

                                    {/* Stock */}

                                    <div>

                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            Stock
                                        </label>

                                        <input
                                            type="number"
                                            min={0}
                                            value={form.stock}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    stock: e.target.value,
                                                })
                                            }
                                            className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-blue-500"
                                        />

                                    </div>

                                </div>

                            </div>

                            {/* =======================================================
                                                UPLOAD NEW IMAGES
                                ======================================================= */}

                            <div>
                                <h3 className="mb-6 text-xl font-semibold text-slate-800">
                                    Product Images
                                </h3>

                                <input type="file" multiple accept="image/*" onChange={handleImageChange} className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-blue-500" />

                                <p className="mt-2 text-sm text-slate-500"> You can upload multiple product images. </p>

                                {imageFiles.length > 0 && (
                                    <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
                                        {imageFiles.map((item: any, index) => (

                                            <div key={`${item?.image ? item.name : item?.file?.name}-${index}`}
                                                className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-2" >

                                                <img src={item?.image ? item?.image : item.preview} alt={item?.image ? item.name : item?.file?.name} className="h-40 w-full rounded-lg object-cover" />

                                                <p className="mt-2 truncate text-sm text-slate-600"> {item?.image ? item.name : item?.file?.name}</p>

                                                <button type="button" onClick={() => removeImage(index)} className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-sm font-bold text-white shadow-md transition hover:bg-red-600">
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>)}
                            </div>





                            {/* =======================================================
                                            PRODUCT DESCRIPTION
                                ======================================================= */}

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">

                                <h3 className="mb-6 text-xl font-semibold text-slate-800">
                                    Product Description
                                </h3>

                                <textarea
                                    rows={6}
                                    value={form.description}
                                    placeholder="Write a detailed product description..."
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            description: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-xl border border-slate-300 bg-white p-4 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500"
                                />

                            </div>

                            {/* =======================================================
                                            PRODUCT HIGHLIGHTS
                                ======================================================= */}

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">

                                <div className="mb-6 flex items-center justify-between">

                                    <h3 className="text-xl font-semibold text-slate-800">
                                        Product Highlights
                                    </h3>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setForm((prev: any) => ({
                                                ...prev,
                                                highlights: [...prev.highlights, ""],
                                            }))
                                        }
                                        className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                                    >
                                        + Add Highlight
                                    </button>

                                </div>

                                <div className="space-y-4">

                                    {form.highlights.map((highlight: string, index: number) => (

                                        <div
                                            key={index}
                                            className="flex items-center gap-3"
                                        >

                                            <input
                                                type="text"
                                                value={highlight}
                                                placeholder={`Highlight ${index + 1}`}
                                                onChange={(e) => {

                                                    const updated = [...form.highlights];
                                                    updated[index] = e.target.value;

                                                    setForm({
                                                        ...form,
                                                        highlights: updated,
                                                    });

                                                }}
                                                className="flex-1 rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-blue-500"
                                            />

                                            {form.highlights.length > 1 && (

                                                <button
                                                    type="button"
                                                    onClick={() => {

                                                        const updated = form.highlights.filter(
                                                            (_: any, i: number) => i !== index
                                                        );

                                                        setForm({
                                                            ...form,
                                                            highlights: updated,
                                                        });

                                                    }}
                                                    className="rounded-xl bg-red-500 px-4 py-3 font-medium text-white hover:bg-red-600"
                                                >
                                                    Remove
                                                </button>

                                            )}

                                        </div>

                                    ))}

                                </div>

                            </div>

                            {/* =======================================================
                                        PRODUCT SPECIFICATIONS
                                ======================================================= */}

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">

                                <div className="mb-6 flex items-center justify-between">

                                    <h3 className="text-xl font-semibold text-slate-800">
                                        Product Specifications
                                    </h3>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setForm((prev: any) => ({
                                                ...prev,
                                                specifications: [
                                                    ...prev.specifications,
                                                    {
                                                        key: "",
                                                        value: "",
                                                    },
                                                ],
                                            }))
                                        }
                                        className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                                    >
                                        + Add Specification
                                    </button>

                                </div>

                                <div className="space-y-4">

                                    {form.specifications.map(
                                        (
                                            spec: {
                                                key: string;
                                                value: string;
                                            },
                                            index: number
                                        ) => (

                                            <div
                                                key={index}
                                                className="grid gap-4 md:grid-cols-[1fr_1fr_auto]"
                                            >

                                                <input
                                                    type="text"
                                                    placeholder="Key (Example: RAM)"
                                                    value={spec.key}
                                                    onChange={(e) => {

                                                        const updated = [...form.specifications];

                                                        updated[index].key = e.target.value;

                                                        setForm({
                                                            ...form,
                                                            specifications: updated,
                                                        });

                                                    }}
                                                    className="rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-blue-500"
                                                />

                                                <input
                                                    type="text"
                                                    placeholder="Value (Example: 8 GB)"
                                                    value={spec.value}
                                                    onChange={(e) => {

                                                        const updated = [...form.specifications];

                                                        updated[index].value = e.target.value;

                                                        setForm({
                                                            ...form,
                                                            specifications: updated,
                                                        });

                                                    }}
                                                    className="rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-blue-500"
                                                />

                                                {form.specifications.length > 1 && (

                                                    <button
                                                        type="button"
                                                        onClick={() => {

                                                            const updated = form.specifications.filter(
                                                                (_: any, i: number) => i !== index
                                                            );

                                                            setForm({
                                                                ...form,
                                                                specifications: updated,
                                                            });

                                                        }}
                                                        className="rounded-xl bg-red-500 px-4 py-3 font-medium text-white hover:bg-red-600"
                                                    >
                                                        Remove
                                                    </button>

                                                )}

                                            </div>

                                        )

                                    )}

                                </div>

                            </div>

                            {/* =======================================================
                                        PRODUCT SETTINGS
                                ======================================================= */}

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">

                                <h3 className="mb-6 text-xl font-semibold text-slate-800">
                                    Product Settings
                                </h3>

                                <div className="grid gap-6 md:grid-cols-2">

                                    {/* Featured Product */}

                                    <label className="flex cursor-pointer items-center gap-4 rounded-xl border bg-white p-4">

                                        <input
                                            type="checkbox"
                                            checked={form.isFeatured}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    isFeatured: e.target.checked,
                                                })
                                            }
                                            className="h-5 w-5 accent-blue-600"
                                        />

                                        <div>

                                            <h4 className="font-semibold text-slate-800">
                                                Featured Product
                                            </h4>

                                            <p className="text-sm text-slate-500">
                                                Display this product in the featured products section.
                                            </p>

                                        </div>

                                    </label>

                                    {/* Active Product */}

                                    <label className="flex cursor-pointer items-center gap-4 rounded-xl border bg-white p-4">

                                        <input
                                            type="checkbox"
                                            checked={form.isActive}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    isActive: e.target.checked,
                                                })
                                            }
                                            className="h-5 w-5 accent-green-600"
                                        />

                                        <div>

                                            <h4 className="font-semibold text-slate-800">
                                                Active Product
                                            </h4>

                                            <p className="text-sm text-slate-500">
                                                Customers can purchase this product.
                                            </p>

                                        </div>

                                    </label>

                                </div>

                            </div>

                            {/* ================= Footer ================= */}

                            <div className="sticky bottom-0 z-20 flex items-center justify-end gap-4 border-t bg-white px-8 py-6">

                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    disabled={saving}
                                    onClick={updateProduct}
                                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >

                                    {saving && (
                                        <Loader2
                                            size={18}
                                            className="animate-spin"
                                        />
                                    )}

                                    Save Changes

                                </button>

                            </div>

                        </div>

                    </div>
                </div >

            )
            }

            {/* ================= CREATE PRODUCT MODAL ================= */}

            {
                createOpen && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">

                        <div className="relative max-h-[95vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

                            {/* ================= Header ================= */}

                            <div className="sticky top-0 z-20 flex items-center justify-between border-b bg-white px-8 py-6">

                                <div>

                                    <h2 className="text-3xl font-bold text-slate-900">
                                        Create Product
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Add a new product to your store.
                                    </p>

                                </div>

                                <button
                                    onClick={() => {
                                        setCreateOpen(false);
                                        setForm(emptyForm);
                                        setImageFiles([]);
                                    }}
                                    className="rounded-xl p-2 transition hover:bg-slate-100"
                                >
                                    <X size={24} />
                                </button>

                            </div>

                            {/* ================= Body ================= */}

                            <div className="space-y-8 p-8">

                                {/* =======================================================
                                            BASIC INFORMATION
                                    ======================================================= */}

                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">

                                    <h3 className="mb-6 text-xl font-semibold text-slate-800">
                                        Basic Information
                                    </h3>

                                    <div className="grid gap-6 md:grid-cols-2">

                                        {/* Product Name */}

                                        <div>

                                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                                Product Name
                                            </label>

                                            <input
                                                type="text"
                                                value={form.name}
                                                placeholder="Apple iPhone 16 Pro"
                                                onChange={(e) => {
                                                    const name = e.target.value;

                                                    setForm((prev: any) => ({
                                                        ...prev,
                                                        name,
                                                        slug: name
                                                            .toLowerCase()
                                                            .trim()
                                                            .replace(/\s+/g, "-")
                                                            .replace(/[^\w-]+/g, ""),
                                                    }));
                                                }}
                                                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500"
                                            />

                                        </div>

                                        {/* Slug */}

                                        <div>

                                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                                Slug
                                            </label>

                                            <input
                                                type="text"
                                                value={form.slug}
                                                placeholder="apple-iphone-16-pro"
                                                onChange={(e) =>
                                                    setForm({
                                                        ...form,
                                                        slug: e.target.value,
                                                    })
                                                }
                                                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500"
                                            />

                                            <p className="mt-1 text-xs text-slate-500">
                                                Auto-generated from product name. You can edit it.
                                            </p>

                                        </div>

                                        {/* Brand */}

                                        <div>

                                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                                Brand
                                            </label>

                                            <input
                                                type="text"
                                                value={form.brand}
                                                placeholder="Apple"
                                                onChange={(e) =>
                                                    setForm({
                                                        ...form,
                                                        brand: e.target.value,
                                                    })
                                                }
                                                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500"
                                            />

                                        </div>

                                        {/* Category */}

                                        <div>

                                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                                Category
                                            </label>

                                            <select
                                                value={form.category}
                                                onChange={(e) => {

                                                    const selected = categories.find(
                                                        (cat: any) => cat._id === e.target.value
                                                    );

                                                    setForm((prev: any) => ({
                                                        ...prev,
                                                        category: selected?._id || "",
                                                        categoryName:
                                                            selected?.categoryName || "",
                                                    }));

                                                }}
                                                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500"
                                            >

                                                <option value="">
                                                    Select Category
                                                </option>

                                                {categories.map((category: any) => (

                                                    <option
                                                        key={category._id}
                                                        value={category._id}
                                                    >
                                                        {category.categoryName}
                                                    </option>

                                                ))}

                                            </select>

                                        </div>

                                    </div>

                                </div>

                                {/* =======================================================
                                        PRICING & INVENTORY
                                ======================================================= */}

                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">

                                    <h3 className="mb-6 text-xl font-semibold text-slate-800">
                                        Pricing & Inventory
                                    </h3>

                                    <div className="grid gap-6 md:grid-cols-3">

                                        {/* Price */}

                                        <div>

                                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                                Price (₹)
                                            </label>

                                            <input
                                                type="number"
                                                min={0}
                                                value={form.price}
                                                placeholder="49999"
                                                onChange={(e) =>
                                                    setForm({
                                                        ...form,
                                                        price: e.target.value,
                                                    })
                                                }
                                                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500"
                                            />

                                        </div>

                                        {/* Discount */}

                                        <div>

                                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                                Discount (%)
                                            </label>

                                            <input
                                                type="number"
                                                min={0}
                                                max={100}
                                                value={form.discountPercentage}
                                                placeholder="10"
                                                onChange={(e) =>
                                                    setForm({
                                                        ...form,
                                                        discountPercentage: Number(e.target.value),
                                                    })
                                                }
                                                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500"
                                            />

                                        </div>

                                        {/* Stock */}

                                        <div>

                                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                                Stock
                                            </label>

                                            <input
                                                type="number"
                                                min={0}
                                                value={form.stock}
                                                placeholder="100"
                                                onChange={(e) =>
                                                    setForm({
                                                        ...form,
                                                        stock: e.target.value,
                                                    })
                                                }
                                                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500"
                                            />

                                        </div>

                                    </div>

                                </div>

                                {/* =======================================================
                                             PRODUCT IMAGES
                                ======================================================= */}

                                <div>
                                    <h3 className="mb-6 text-xl font-semibold text-slate-800">
                                        Product Images
                                    </h3>
                                    <input type="file" multiple accept="image/*" onChange={handleImageChange} className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-blue-500" />
                                    <p className="mt-2 text-sm text-slate-500"> You can upload multiple product images. </p>
                                    {imageFiles.length > 0 && (<div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5"> {imageFiles.map((item, index) => (
                                        <div key={`${item.file.name}-${index}`} className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-2" >
                                            <img src={item.preview} alt={item.file.name} className="h-40 w-full rounded-lg object-cover" />
                                            <p className="mt-2 truncate text-sm text-slate-600"> {item.file.name}</p>
                                            <button type="button" onClick={() => removeImage(index)} className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-sm font-bold text-white shadow-md transition hover:bg-red-600">
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                    </div>)}
                                </div>

                                {/* =======================================================
                                              DESCRIPTION
                                ======================================================= */}

                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">

                                    <h3 className="mb-6 text-xl font-semibold text-slate-800">
                                        Product Description
                                    </h3>

                                    <textarea
                                        rows={6}
                                        value={form.description}
                                        placeholder="Write a detailed product description..."
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                description: e.target.value,
                                            })
                                        }
                                        className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500"
                                    />

                                </div>

                                {/* =======================================================
                                            PRODUCT HIGHLIGHTS
                                ======================================================= */}

                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">

                                    <div className="mb-6 flex items-center justify-between">

                                        <h3 className="text-xl font-semibold text-slate-800">
                                            Product Highlights
                                        </h3>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setForm((prev: any) => ({
                                                    ...prev,
                                                    highlights: [...prev.highlights, ""],
                                                }))
                                            }
                                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                                        >
                                            + Add Highlight
                                        </button>

                                    </div>

                                    <div className="space-y-3">

                                        {form.highlights.map((highlight: string, index: number) => (

                                            <div
                                                key={index}
                                                className="flex items-center gap-3"
                                            >

                                                <input
                                                    type="text"
                                                    value={highlight}
                                                    placeholder={`Highlight ${index + 1}`}
                                                    onChange={(e) => {

                                                        const updated = [...form.highlights];
                                                        updated[index] = e.target.value;

                                                        setForm({
                                                            ...form,
                                                            highlights: updated,
                                                        });

                                                    }}
                                                    className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500"
                                                />

                                                {form.highlights.length > 1 && (

                                                    <button
                                                        type="button"
                                                        onClick={() => {

                                                            const updated = form.highlights.filter(
                                                                (_: any, i: number) => i !== index
                                                            );

                                                            setForm({
                                                                ...form,
                                                                highlights: updated,
                                                            });

                                                        }}
                                                        className="rounded-lg bg-red-500 px-4 py-3 text-white hover:bg-red-600"
                                                    >
                                                        Remove
                                                    </button>

                                                )}

                                            </div>

                                        ))}

                                    </div>

                                </div>

                                {/* =======================================================
                                                SPECIFICATIONS
                                ======================================================= */}

                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">

                                    <div className="mb-6 flex items-center justify-between">

                                        <h3 className="text-xl font-semibold text-slate-800">
                                            Specifications
                                        </h3>

                                        <button
                                            type="button"
                                            onClick={() => setForm((prev: any) => ({ ...prev, specifications: [...prev.specifications, { key: "", value: "", },], }))}
                                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                                        >
                                            + Add Specification
                                        </button>

                                    </div>

                                    <div className="space-y-4">

                                        {form.specifications.map((spec: { key: string; value: string; }, index: number) => (

                                            <div key={index} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">

                                                {/* Key */}

                                                <input
                                                    type="text"
                                                    placeholder="Key (Example: RAM)"
                                                    value={spec.key}
                                                    onChange={(e) => {
                                                        const updated = [...form.specifications];
                                                        updated[index].key = e.target.value;
                                                        setForm({ ...form, specifications: updated, });
                                                    }}
                                                    className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500"
                                                />

                                                {/* Value */}

                                                <input
                                                    type="text"
                                                    placeholder="Value (Example: 8 GB)"
                                                    value={spec.value}
                                                    onChange={(e) => {

                                                        const updated = [...form.specifications];

                                                        updated[index].value = e.target.value;

                                                        setForm({
                                                            ...form,
                                                            specifications: updated,
                                                        });

                                                    }}
                                                    className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500"
                                                />

                                                {/* Remove */}

                                                {form.specifications.length > 1 && (

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const updated = form.specifications.filter((_: any, i: number) => i !== index)
                                                            setForm({ ...form, specifications: updated, });
                                                        }}
                                                        className="rounded-lg bg-red-500 px-4 py-3 font-medium text-white hover:bg-red-600"
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>)
                                        )}
                                    </div>
                                </div>


                                {/* =======================================================
                                                PRODUCT SETTINGS
                                ======================================================= */}

                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">

                                    <h3 className="mb-6 text-xl font-semibold text-slate-800">
                                        Product Settings
                                    </h3>

                                    <div className="grid gap-6 md:grid-cols-2">

                                        {/* Featured Product */}

                                        <label className="flex cursor-pointer items-center gap-4 rounded-xl border bg-white p-4">

                                            <input
                                                type="checkbox"
                                                checked={form.isFeatured}
                                                onChange={(e) =>
                                                    setForm({
                                                        ...form,
                                                        isFeatured: e.target.checked,
                                                    })
                                                }
                                                className="h-5 w-5 accent-blue-600"
                                            />

                                            <div>

                                                <h4 className="font-semibold text-slate-800">
                                                    Featured Product
                                                </h4>

                                                <p className="text-sm text-slate-500">
                                                    Display this product in featured sections.
                                                </p>

                                            </div>

                                        </label>

                                        {/* Active Product */}

                                        <label className="flex cursor-pointer items-center gap-4 rounded-xl border bg-white p-4">

                                            <input
                                                type="checkbox"
                                                checked={form.isActive}
                                                onChange={(e) =>
                                                    setForm({
                                                        ...form,
                                                        isActive: e.target.checked,
                                                    })
                                                }
                                                className="h-5 w-5 accent-green-600"
                                            />

                                            <div>

                                                <h4 className="font-semibold text-slate-800">
                                                    Active Product
                                                </h4>

                                                <p className="text-sm text-slate-500">
                                                    Customers can purchase this product.
                                                </p>

                                            </div>

                                        </label>

                                    </div>

                                </div>

                                {/* ================= Footer ================= */}

                                <div className="sticky bottom-0 z-20 flex items-center justify-end gap-4 border-t bg-white px-8 py-6">

                                    <button
                                        type="button"
                                        onClick={() => {

                                            setCreateOpen(false);
                                            setForm(emptyForm);
                                            setImageFiles([]);

                                        }}
                                        className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="button"
                                        disabled={saving}
                                        onClick={createProduct}
                                        className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >

                                        {saving && (
                                            <Loader2
                                                size={18}
                                                className="animate-spin"
                                            />
                                        )}

                                        Create Product

                                    </button>

                                </div>

                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
}




