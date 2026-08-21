"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, BadgeCheck } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
    addToCartState,
    decrement,
    increment,
} from "@/redux/cart/cartSlice";

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

interface Props {
    product: Product[];
}

export default function ProductCard({ product }: Props) {

    console.log(product, "In the product")
    const router = useRouter();

    const dispatch = useAppDispatch();

    const cart = useAppSelector((state) => state.cart);

    const auth = useAppSelector((state) => state.auth);

    const addToCartFun = (product: any) => {
        if (!auth.accessToken) {
            router.push("/login");
            return;
        }

        dispatch(
            addToCartState({
                ...product,
                quantity: 1,
            })
        );
    };

    return (
        <div className="flex gap-6 w-max">
            {product.map((product) => {
                const cartItem = cart.products.find((item) => item._id === product._id);
                return (
                    <div
                        key={product._id}
                        className="group w-[290px] overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-900/20"
                    >

                        {/* IMAGE */}

                        <Link href={`/products/${product._id}`}>
                            <div className="relative h-56 w-full overflow-hidden rounded-t-2xl bg-slate-950">
                                {product.isFeatured && (
                                    <div className="absolute left-3 top-3 z-20 flex items-center gap-1 rounded-full bg-yellow-500 px-3 py-1 text-xs font-bold text-black">
                                        <BadgeCheck size={14} />
                                        Featured
                                    </div>
                                )}

                                <div className="flex h-56 items-center justify-center bg-slate-950">
                                    <Image
                                        src={product.images?.[0]?.image || "/placeholder.png"}
                                        alt={product.name}
                                        width={220}
                                        height={220}
                                        className="max-h-[220px] w-auto object-contain"
                                    />
                                </div>
                            </div>
                        </Link>

                        {/* CONTENT */}

                        <div className="space-y-4 p-5">

                            {/* Brand */}

                            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">
                                {product.brand}
                            </p>

                            {/* Name */}

                            <h2 className="line-clamp-2 text-lg font-bold text-white">
                                {product.name}
                            </h2>

                            {/* Category */}

                            <p className="text-sm text-slate-400">
                                {product.categoryName}
                            </p>

                            {/* Description */}

                            <p className="line-clamp-2 text-sm text-slate-500">
                                {product.description}
                            </p>

                            {/* Rating */}

                            <div className="flex items-center justify-between">

                                <div className="flex items-center gap-2">

                                    <div className="flex items-center gap-1 rounded-full bg-yellow-500 px-2 py-1 text-xs font-bold text-black">
                                        <Star size={13} fill="currentColor" />
                                        {product.rating}
                                    </div>

                                    <span className="text-xs text-slate-400">
                                        ({product.reviews} Reviews)
                                    </span>

                                </div>

                                {product.discountPercentage > 0 && (
                                    <span className="rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">
                                        {product.discountPercentage}% OFF
                                    </span>
                                )}

                            </div>

                            {/* Highlights */}

                            <div className="space-y-2">
                                {product.highlights
                                    .slice(0, 2)
                                    .map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2 text-sm text-slate-300"
                                        >
                                            <span className="text-green-400">
                                                ✔
                                            </span>

                                            <span className="line-clamp-1">
                                                {item}
                                            </span>
                                        </div>
                                    ))}
                            </div>

                            {/* Specifications */}

                            <div className="flex flex-wrap gap-2">
                                {Object.entries(product.specifications)
                                    .slice(0, 2)
                                    .map(([key, value]) => (
                                        <span
                                            key={key}
                                            className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-300"
                                        >
                                            <span className="font-semibold">
                                                {key}:
                                            </span>{" "}
                                            {value}
                                        </span>
                                    ))}
                            </div>

                            {/* Price */}

                            <div className="flex items-center justify-between">

                                <div>

                                    <h2 className="text-2xl font-bold text-green-400">
                                        ₹{product.price.toLocaleString()}
                                    </h2>

                                    {product.discountPercentage > 0 && (
                                        <p className="text-xs text-slate-500">
                                            Save {product.discountPercentage}%
                                        </p>
                                    )}

                                </div>

                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-bold ${product.stock > 0
                                        ? "bg-green-500/20 text-green-400"
                                        : "bg-red-500/20 text-red-400"
                                        }`}
                                >
                                    {product.stock > 0
                                        ? `${product.stock} In Stock`
                                        : "Out of Stock"}
                                </span>

                            </div>

                            {/* Cart Buttons */}

                            {cartItem ? (
                                <div className="flex items-center justify-between overflow-hidden rounded-xl border border-blue-500">

                                    <button
                                        onClick={() =>
                                            dispatch(decrement(cartItem))
                                        }
                                        className="flex h-12 w-12 items-center justify-center bg-slate-800 text-xl font-bold text-white transition hover:bg-blue-600"
                                    >
                                        −
                                    </button>

                                    <span className="text-lg font-bold text-white">
                                        {cartItem.quantity}
                                    </span>

                                    <button
                                        onClick={() =>
                                            dispatch(increment(cartItem))
                                        }
                                        disabled={
                                            cartItem.quantity >= product.stock
                                        }
                                        className="flex h-12 w-12 items-center justify-center bg-slate-800 text-xl font-bold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        +
                                    </button>

                                </div>
                            ) : (
                                <button
                                    onClick={() => addToCartFun(product)}
                                    disabled={product.stock === 0}
                                    className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {product.stock === 0
                                        ? "Out of Stock"
                                        : "Add To Cart"}
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}