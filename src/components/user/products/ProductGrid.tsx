"use client";

import Link from "next/link";
import Image from "next/image";

export interface Product {
    _id: string;
    name: string;
    slug: string;
    description: string;
    category: string;
    categoryName: string;
    brand: string;
    images: {
        _id?: string;
        image: string;
        name: string;
    }[];
    price: number;
    discountPercentage: number;
    stock: number;
    rating: number;
    reviews: number;
    highlights: string[];
    specifications: Record<string, string>;
    isFeatured: boolean;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

interface ProductGridProps {
    products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
    if (!products.length) {
        return (
            <div className="py-20 text-center text-gray-400">
                No products found.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

            {products.map((product) => (
                <Link
                    key={product._id}
                    href={`/products/${product._id}`}
                    className="rounded-xl border border-slate-700 bg-slate-900 p-4 transition hover:shadow-lg"
                >
                    <Image
                        src={product.images[0].image}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="h-60 w-full rounded-lg object-cover"
                    />

                    <h2 className="mt-4 text-lg font-semibold">{product.name}</h2>

                    <p className="mt-2 line-clamp-2 text-sm text-gray-400">
                        {product.description}
                    </p>

                    <p className="mt-3 text-2xl font-bold text-green-400">
                        ₹{product.price.toLocaleString()}
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                        Stock: {product.stock}
                    </p>
                </Link>
            ))}
        </div>
    );
}