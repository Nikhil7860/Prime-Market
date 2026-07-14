"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
    Heart,
    Minus,
    Plus,
    ShoppingCart,
    CreditCard,
    Share2,
    Truck,
    ShieldCheck,
    RotateCcw,
    Star,
    BadgeCheck,
    Tag,
    Headphones,
} from "lucide-react";

import { useParams } from "next/navigation";
import { getProductById } from "@/services/product.service";

/* ===========================================================
                    INTERFACES
=========================================================== */

interface ProductImage {
    _id: string;
    image: string;
    name: string;
}

interface Product {
    _id: string;

    name: string;

    slug: string;

    description: string;

    categoryName: string;

    category: string;

    brand: string;

    images: ProductImage[];

    price: number;

    discountPercentage: number;

    stock: number;

    rating: number;

    reviews: number;

    highlights: string[];

    specifications: Record<string, string>;

    isFeatured: boolean;

    isActive: boolean;

    createdAt: string;

    updatedAt: string;
}

export default function ProductDetails() {
    const params = useParams();

    const id = params.id as string;

    /* ===========================================================
                        STATES
    =========================================================== */

    const [product, setProduct] = useState<Product | null>(null);

    const [selectedImage, setSelectedImage] = useState<ProductImage | null>(null);

    const [quantity, setQuantity] = useState(1);

    const [wishlist, setWishlist] = useState(false);

    const [zoom, setZoom] = useState(false);

    const [backgroundPosition, setBackgroundPosition] = useState("50% 50%");

    /* ===========================================================
                        FETCH PRODUCT
    =========================================================== */

    useEffect(() => {
        if (!id) return;

        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response: any = await getProductById(id);

            setProduct(response);

            if (response.images?.length > 0) {
                setSelectedImage(response.images[0]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    if (!product || !selectedImage) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <div className="h-14 w-14 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            </div>
        );
    }

    /* ===========================================================
                        IMAGE MAGNIFIER
    =========================================================== */

    const handleMouseMove = (
        e: React.MouseEvent<HTMLDivElement>
    ) => {
        const { left, top, width, height } =
            e.currentTarget.getBoundingClientRect();

        const x = ((e.clientX - left) / width) * 100;

        const y = ((e.clientY - top) / height) * 100;

        setBackgroundPosition(`${x}% ${y}%`);
    };

    /* ===========================================================
                        QUANTITY
    =========================================================== */

    const increaseQty = () =>
        setQuantity((prev) =>
            Math.min(product.stock, prev + 1)
        );

    const decreaseQty = () =>
        setQuantity((prev) =>
            Math.max(1, prev - 1)
        );

    /* ===========================================================
                        ACTIONS
    =========================================================== */

    const toggleWishlist = () =>
        setWishlist(!wishlist);

    const handleAddToCart = () => {
        console.log(product._id, quantity);
    };

    const handleBuyNow = () => {
        console.log("Buy Now");
    };

    const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title: product.name,
                text: product.description,
                url: window.location.href,
            });
        }
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">

            <div className="grid gap-10 lg:grid-cols-2">

                {/* ======================================================
                            LEFT SIDE
                ====================================================== */}

                <div className="space-y-5">

                    {/* Main Image */}

                    <div
                        className="relative h-[350px] overflow-hidden rounded-3xl border bg-white shadow-xl sm:h-[450px] lg:h-[600px]"
                        onMouseMove={handleMouseMove}
                        onMouseEnter={() => setZoom(true)}
                        onMouseLeave={() => setZoom(false)}
                    >
                        <Image
                            src={selectedImage.image}
                            alt={selectedImage.name}
                            fill
                            priority
                            className={`object-contain p-8 transition duration-300 ${zoom ? "opacity-0" : "opacity-100"
                                }`}
                        />

                        {zoom && (
                            <div
                                className="absolute inset-0"
                                style={{
                                    backgroundImage: `url(${selectedImage.image})`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundSize: "220%",
                                    backgroundPosition,
                                }}
                            />
                        )}

                        {/* Featured */}

                        {product.isFeatured && (
                            <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-yellow-500 px-4 py-2 text-sm font-bold text-black shadow-lg">
                                <BadgeCheck size={16} />
                                Featured
                            </div>
                        )}

                        {/* Wishlist */}

                        <button
                            onClick={toggleWishlist}
                            className="absolute right-4 top-4 rounded-full bg-white p-3 shadow-lg transition hover:scale-110"
                        >
                            <Heart
                                size={22}
                                className={
                                    wishlist
                                        ? "fill-red-500 text-red-500"
                                        : "text-slate-500"
                                }
                            />
                        </button>

                        {/* Share */}

                        <button
                            onClick={handleShare}
                            className="absolute left-4 bottom-4 rounded-full bg-white p-3 shadow-lg transition hover:scale-110"
                        >
                            <Share2 size={20} />
                        </button>
                    </div>

                    {/* Thumbnail Gallery */}

                    <div className="grid grid-cols-4 gap-4">

                        {product.images.map((img) => (

                            <button
                                key={img._id}
                                onClick={() =>
                                    setSelectedImage(img)
                                }
                                className={`relative h-24 overflow-hidden rounded-2xl border-2 bg-white transition-all hover:scale-105 ${selectedImage._id === img._id
                                    ? "border-blue-600 shadow-lg"
                                    : "border-slate-200"
                                    }`}
                            >
                                <Image
                                    src={img.image}
                                    alt={img.name}
                                    fill
                                    className="object-contain p-2"
                                />
                            </button>

                        ))}

                    </div>

                    <div className="rounded-2xl bg-blue-50 p-4 text-sm text-blue-700">
                        🔍 Hover over the image to zoom. Click any thumbnail to switch images.
                    </div>

                </div>

                {/* ======================================================
                        RIGHT SIDE STARTS HERE
                ====================================================== */}

                <div className="space-y-6">
                    {/* ======================================================
        PRODUCT CATEGORY + BRAND
====================================================== */}

                    <div className="flex flex-wrap items-center gap-3">

                        <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                            {product.categoryName}
                        </span>

                        <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                            {product.brand}
                        </span>

                        {product.isFeatured && (
                            <span className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700">
                                ⭐ Featured Product
                            </span>
                        )}

                    </div>

                    {/* ======================================================
                    PRODUCT NAME
====================================================== */}

                    <div>

                        <h1 className="text-3xl font-bold leading-tight text-slate-900 lg:text-5xl">
                            {product.name}
                        </h1>

                        <p className="mt-3 text-lg text-slate-500">
                            {product.brand} • Official Product • Genuine Warranty
                        </p>

                    </div>

                    {/* ======================================================
                        RATINGS
====================================================== */}

                    <div className="flex flex-wrap items-center gap-5">

                        <div className="flex items-center gap-1 rounded-xl bg-green-600 px-3 py-2 text-white">

                            <Star
                                size={18}
                                fill="currentColor"
                            />

                            <span className="font-semibold">
                                {product.rating}
                            </span>

                        </div>

                        <span className="font-semibold text-slate-700">
                            {product.reviews.toLocaleString()} Reviews
                        </span>

                        <span className="text-slate-400">
                            {product.stock > 0
                                ? `${product.stock} Available`
                                : "Out of Stock"}
                        </span>

                    </div>

                    {/* ======================================================
                        PRICE
====================================================== */}

                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">

                        <div className="flex flex-wrap items-center gap-4">

                            <h2 className="text-5xl font-bold text-green-600">
                                ₹{product.price.toLocaleString()}
                            </h2>

                            {product.discountPercentage > 0 && (

                                <span className="rounded-full bg-red-100 px-4 py-2 text-sm font-bold text-red-600">

                                    {product.discountPercentage}% OFF

                                </span>

                            )}

                        </div>

                        {product.discountPercentage > 0 && (

                            <p className="mt-4 text-lg text-slate-500 line-through">

                                ₹
                                {Math.round(
                                    product.price /
                                    (1 - product.discountPercentage / 100)
                                ).toLocaleString()}

                            </p>

                        )}

                        <p className="mt-2 text-sm text-slate-500">
                            Inclusive of all taxes
                        </p>

                    </div>

                    {/* ======================================================
                        STOCK
====================================================== */}

                    <div
                        className={`inline-flex rounded-full px-5 py-3 font-semibold ${product.stock > 0
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                            }`}
                    >
                        {product.stock > 0
                            ? `✔ ${product.stock} Items In Stock`
                            : "Out Of Stock"}
                    </div>

                    {/* ======================================================
                    DESCRIPTION
====================================================== */}

                    <div>

                        <h3 className="mb-3 text-xl font-bold text-slate-900">
                            Description
                        </h3>

                        <p className="leading-8 text-slate-600">
                            {product.description}
                        </p>

                    </div>

                    {/* ======================================================
                    QUICK INFORMATION
====================================================== */}

                    <div className="grid gap-4 sm:grid-cols-2">

                        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

                            <p className="text-sm text-slate-500">
                                Brand
                            </p>

                            <h4 className="mt-1 text-lg font-semibold text-slate-900">
                                {product.brand}
                            </h4>

                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

                            <p className="text-sm text-slate-500">
                                Category
                            </p>

                            <h4 className="mt-1 text-lg font-semibold text-slate-900">
                                {product.categoryName}
                            </h4>

                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

                            <p className="text-sm text-slate-500">
                                Product Rating
                            </p>

                            <h4 className="mt-1 text-lg font-semibold text-yellow-500">
                                ⭐ {product.rating}/5
                            </h4>

                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

                            <p className="text-sm text-slate-500">
                                Customer Reviews
                            </p>

                            <h4 className="mt-1 text-lg font-semibold text-slate-900">
                                {product.reviews.toLocaleString()}
                            </h4>

                        </div>

                    </div>

                    {/* ======================================================
                    PRODUCT HIGHLIGHTS
====================================================== */}

                    <div>

                        <h3 className="mb-4 text-2xl font-bold text-slate-900">
                            Product Highlights
                        </h3>

                        <div className="grid gap-3 sm:grid-cols-2">

                            {product.highlights.map((highlight, index) => (

                                <div
                                    key={index}
                                    className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-500 hover:bg-blue-50"
                                >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-sm font-bold text-white">
                                        ✓
                                    </div>

                                    <span className="font-medium text-slate-700">
                                        {highlight}
                                    </span>

                                </div>

                            ))}

                        </div>

                    </div>

                    {/* ======================================================
                    SPECIFICATIONS
====================================================== */}

                    <div>

                        <h3 className="mb-4 text-2xl font-bold text-slate-900">
                            Specifications
                        </h3>

                        <div className="overflow-hidden rounded-2xl border border-slate-200">

                            {Object.entries(product.specifications).map(([key, value], index) => (

                                <div
                                    key={key}
                                    className={`grid grid-cols-2 px-6 py-4 ${index % 2 === 0
                                        ? "bg-white"
                                        : "bg-slate-50"
                                        }`}
                                >
                                    <div className="font-semibold text-slate-700">
                                        {key}
                                    </div>

                                    <div className="text-slate-600">
                                        {value}
                                    </div>

                                </div>

                            ))}

                        </div>

                    </div>

                    {/* ======================================================
                    QUANTITY
====================================================== */}

                    <div>

                        <h3 className="mb-3 text-xl font-bold">
                            Quantity
                        </h3>

                        <div className="flex w-fit items-center overflow-hidden rounded-2xl border border-slate-300 shadow-sm">

                            <button
                                onClick={decreaseQty}
                                className="flex h-14 w-14 items-center justify-center transition hover:bg-slate-100"
                            >
                                <Minus size={20} />
                            </button>

                            <div className="flex w-20 items-center justify-center text-xl font-bold">
                                {quantity}
                            </div>

                            <button
                                onClick={increaseQty}
                                disabled={quantity >= product.stock}
                                className="flex h-14 w-14 items-center justify-center transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Plus size={20} />
                            </button>

                        </div>

                    </div>

                    {/* ======================================================
                    ACTION BUTTONS
====================================================== */}

                    <div className="grid gap-4 pt-2 md:grid-cols-3">

                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className="flex items-center justify-center gap-3 rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-blue-700 hover:shadow-xl disabled:cursor-not-allowed disabled:bg-slate-400"
                        >
                            <ShoppingCart size={22} />

                            Add To Cart
                        </button>

                        <button
                            onClick={handleBuyNow}
                            disabled={product.stock === 0}
                            className="flex items-center justify-center gap-3 rounded-2xl bg-emerald-600 px-8 py-4 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-700 hover:shadow-xl disabled:cursor-not-allowed disabled:bg-slate-400"
                        >
                            <CreditCard size={22} />

                            Buy Now
                        </button>

                        <button
                            onClick={toggleWishlist}
                            className={`flex items-center justify-center gap-3 rounded-2xl border-2 px-8 py-4 font-semibold transition-all duration-300 hover:-translate-y-1

        ${wishlist
                                    ? "border-red-500 bg-red-50 text-red-600"
                                    : "border-slate-300 bg-white text-slate-700 hover:border-red-500 hover:text-red-500"
                                }`}
                        >
                            <Heart
                                size={22}
                                className={wishlist ? "fill-red-500" : ""}
                            />

                            Wishlist
                        </button>

                    </div>

                    {/* ======================================================
                DELIVERY & SERVICES
====================================================== */}

                    <div>

                        <h3 className="mb-6 text-3xl font-bold text-white">
                            Services
                        </h3>

                        <div className="grid gap-6 sm:grid-cols-3">

                            {/* Free Delivery */}

                            <div className="group rounded-3xl border border-blue-500/20 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 p-6 text-center shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-blue-500/20">

                                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/20">

                                    <Truck
                                        size={36}
                                        className="text-blue-400 transition-transform duration-300 group-hover:scale-110"
                                    />

                                </div>

                                <h4 className="text-xl font-bold text-white">
                                    Free Delivery
                                </h4>

                                <p className="mt-3 text-sm leading-6 text-slate-300">
                                    Delivered within 2–4 business days anywhere in India.
                                </p>

                            </div>

                            {/* Warranty */}

                            <div className="group rounded-3xl border border-green-500/20 bg-gradient-to-br from-slate-900 via-slate-800 to-green-950 p-6 text-center shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-green-500 hover:shadow-green-500/20">

                                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">

                                    <ShieldCheck
                                        size={36}
                                        className="text-green-400 transition-transform duration-300 group-hover:scale-110"
                                    />

                                </div>

                                <h4 className="text-xl font-bold text-white">
                                    Official Warranty
                                </h4>

                                <p className="mt-3 text-sm leading-6 text-slate-300">
                                    Includes 1-year manufacturer warranty with genuine support.
                                </p>

                            </div>

                            {/* Returns */}

                            <div className="group rounded-3xl border border-orange-500/20 bg-gradient-to-br from-slate-900 via-slate-800 to-orange-950 p-6 text-center shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-orange-500 hover:shadow-orange-500/20">

                                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/20">

                                    <RotateCcw
                                        size={36}
                                        className="text-orange-400 transition-transform duration-300 group-hover:scale-110"
                                    />

                                </div>

                                <h4 className="text-xl font-bold text-white">
                                    Easy Returns
                                </h4>

                                <p className="mt-3 text-sm leading-6 text-slate-300">
                                    7-day hassle-free replacement and return policy.
                                </p>

                            </div>

                        </div>

                    </div>
                    {/* ======================================================
                    PRODUCT DETAILS
====================================================== */}

                    <div>

                        <h3 className="mb-5 text-2xl font-bold text-slate-900">
                            Product Details
                        </h3>

                        <div className="overflow-hidden rounded-3xl border border-slate-200">

                            <div className="grid grid-cols-2 border-b border-slate-200 bg-white px-6 py-4">
                                <span className="font-semibold text-slate-700">
                                    Product ID
                                </span>

                                <span className="break-all text-slate-600">
                                    {product._id}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50 px-6 py-4">
                                <span className="font-semibold text-slate-700">
                                    Slug
                                </span>

                                <span className="text-slate-600">
                                    {product.slug}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 border-b border-slate-200 bg-white px-6 py-4">
                                <span className="font-semibold text-slate-700">
                                    Brand
                                </span>

                                <span className="text-slate-600">
                                    {product.brand}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50 px-6 py-4">
                                <span className="font-semibold text-slate-700">
                                    Category
                                </span>

                                <span className="text-slate-600">
                                    {product.categoryName}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 border-b border-slate-200 bg-white px-6 py-4">
                                <span className="font-semibold text-slate-700">
                                    Status
                                </span>

                                <span
                                    className={`font-semibold ${product.isActive
                                        ? "text-green-600"
                                        : "text-red-600"
                                        }`}
                                >
                                    {product.isActive ? "Active" : "Inactive"}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 bg-slate-50 px-6 py-4">
                                <span className="font-semibold text-slate-700">
                                    Added On
                                </span>

                                <span className="text-slate-600">
                                    {new Date(product.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                        </div>

                    </div>

                    {/* ======================================================
                WHY BUY FROM US
====================================================== */}

                    <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white shadow-xl">

                        <h3 className="mb-6 text-3xl font-bold">
                            Why Buy From Us?
                        </h3>

                        <div className="grid gap-5 md:grid-cols-2">

                            <div className="flex gap-4">

                                <div className="text-3xl">
                                    ✅
                                </div>

                                <div>

                                    <h4 className="font-bold">
                                        Genuine Products
                                    </h4>

                                    <p className="mt-1 text-blue-100">
                                        100% authentic products sourced directly from
                                        authorized brands.
                                    </p>

                                </div>

                            </div>

                            <div className="flex gap-4">

                                <div className="text-3xl">
                                    🚚
                                </div>

                                <div>

                                    <h4 className="font-bold">
                                        Fast Delivery
                                    </h4>

                                    <p className="mt-1 text-blue-100">
                                        Free shipping across India with quick delivery.
                                    </p>

                                </div>

                            </div>

                            <div className="flex gap-4">

                                <div className="text-3xl">
                                    🔒
                                </div>

                                <div>

                                    <h4 className="font-bold">
                                        Secure Payments
                                    </h4>

                                    <p className="mt-1 text-blue-100">
                                        Razorpay, UPI, Debit Cards, Credit Cards &
                                        Net Banking supported.
                                    </p>

                                </div>

                            </div>

                            <div className="flex gap-4">

                                <div className="text-3xl">
                                    🎧
                                </div>

                                <div>

                                    <h4 className="font-bold">
                                        24×7 Customer Support
                                    </h4>

                                    <p className="mt-1 text-blue-100">
                                        Our support team is available whenever you
                                        need assistance.
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* ======================================================
                    PAYMENT INFO
====================================================== */}

                    <div className="rounded-3xl border border-green-200 bg-green-50 p-6">

                        <h3 className="text-xl font-bold text-green-700">
                            Secure Checkout
                        </h3>

                        <p className="mt-3 leading-7 text-slate-600">

                            All transactions are protected using industry-standard SSL
                            encryption. Your payment information is never stored on
                            our servers.

                        </p>

                    </div>

                    {/* ======================================================
                    CUSTOMER SUPPORT
====================================================== */}

                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">

                        <h3 className="text-xl font-bold">
                            Need Help?
                        </h3>

                        <p className="mt-3 leading-7 text-slate-600">

                            Have questions regarding this product?

                            Contact our support team for product recommendations,
                            warranty information, installation assistance,
                            and order tracking.

                        </p>

                    </div>

                </div>

            </div>


            {/* ======================================================
                TRUST INDICATORS
====================================================== */}

            <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                {/* Free Shipping */}

                <div className="group rounded-3xl border border-slate-700 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-center shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-blue-900/30">

                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 transition group-hover:scale-110">
                        <Truck size={30} />
                    </div>

                    <h3 className="text-xl font-bold text-white">
                        Free Shipping
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-400">
                        Enjoy free delivery on all orders above ₹999 across India.
                    </p>

                </div>

                {/* Secure Payment */}

                <div className="group rounded-3xl border border-slate-700 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-center shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-green-500 hover:shadow-green-900/30">

                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 text-green-400 transition group-hover:scale-110">
                        <ShieldCheck size={30} />
                    </div>

                    <h3 className="text-xl font-bold text-white">
                        Secure Payment
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-400">
                        100% secure checkout powered by Razorpay with SSL encryption.
                    </p>

                </div>

                {/* Easy Returns */}

                <div className="group rounded-3xl border border-slate-700 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-center shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-orange-500 hover:shadow-orange-900/30">

                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/20 text-orange-400 transition group-hover:scale-110">
                        <RotateCcw size={30} />
                    </div>

                    <h3 className="text-xl font-bold text-white">
                        Easy Returns
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-400">
                        Hassle-free replacement and returns within 7 days.
                    </p>

                </div>

                {/* Support */}

                <div className="group rounded-3xl border border-slate-700 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-center shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-purple-500 hover:shadow-purple-900/30">

                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/20 text-purple-400 transition group-hover:scale-110">
                        <Headphones size={30} />
                    </div>

                    <h3 className="text-xl font-bold text-white">
                        24×7 Support
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-400">
                        Contact us anytime through Chat, Email or Phone support.
                    </p>

                </div>

            </div>

            {/* ======================================================
                PRODUCT INFORMATION
====================================================== */}

            <div className="mt-12 overflow-hidden rounded-3xl border border-blue-700/40 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-8 shadow-2xl">

                <h2 className="mb-6 text-3xl font-bold">
                    Product Information
                </h2>

                <div className="grid gap-6 md:grid-cols-2">

                    <div>

                        <h3 className="mb-3 text-xl font-semibold">
                            About this Product
                        </h3>

                        <p className="leading-8 text-slate-600">
                            {product.description}
                        </p>

                    </div>

                    <div>

                        <h3 className="mb-3 text-xl font-semibold">
                            Product Highlights
                        </h3>

                        <ul className="space-y-3">

                            {product.highlights.map((item, index) => (

                                <li
                                    key={index}
                                    className="flex items-start gap-3"
                                >
                                    <span className="text-green-600">
                                        ✔
                                    </span>

                                    <span className="text-slate-600">
                                        {item}
                                    </span>

                                </li>

                            ))}

                        </ul>

                    </div>

                </div>

            </div>

            {/* ======================================================
                PRODUCT META
====================================================== */}

            <div className="mt-12 overflow-hidden rounded-3xl border border-blue-700/40 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-8 shadow-2xl">

                <h2 className="mb-5 text-2xl font-bold">
                    Additional Information
                </h2>

                <div className="grid gap-4 md:grid-cols-2">

                    <div>
                        <span className="font-semibold">
                            Product ID :
                        </span>{" "}
                        {product._id}
                    </div>

                    <div>
                        <span className="font-semibold">
                            Slug :
                        </span>{" "}
                        {product.slug}
                    </div>

                    <div>
                        <span className="font-semibold">
                            Brand :
                        </span>{" "}
                        {product.brand}
                    </div>

                    <div>
                        <span className="font-semibold">
                            Category :
                        </span>{" "}
                        {product.categoryName}
                    </div>

                    <div>
                        <span className="font-semibold">
                            Status :
                        </span>{" "}
                        {product.isActive ? "Active" : "Inactive"}
                    </div>

                    <div>
                        <span className="font-semibold">
                            Added On :
                        </span>{" "}
                        {new Date(product.createdAt).toLocaleDateString()}
                    </div>

                </div>

            </div>

            {/* ======================================================
                    FOOTER
====================================================== */}

            <div className="mt-20 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-10 text-center text-white">

                <h2 className="text-4xl font-bold">
                    Thank You for Shopping With Us ❤️
                </h2>

                <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-300">

                    We are committed to delivering genuine products,
                    secure payments, fast shipping,
                    and an exceptional shopping experience.

                </p>

            </div>
        </div>
    )
}