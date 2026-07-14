"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Product {
    _id: string;
    name: string;
    category: string;
    description: string;
    image: string;
    price: number;
    stock: number;
}

export default function ProductDetails({
    id,
}: {
    id: string;
}) {
    const [product, setProduct] = useState<Product | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`
                );

                const data = await res.json();

                setProduct(data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchProduct();
    }, [id]);

    if (!product) {
        return (
            <div className="flex justify-center py-20 text-white">
                Loading...
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-6 py-12">
            <div className="grid gap-10 lg:grid-cols-2">
                {/* Image */}

                <div className="relative h-[500px] rounded-2xl bg-slate-900">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain p-10"
                    />
                </div>

                {/* Details */}

                <div className="space-y-6">
                    <h1 className="text-4xl font-bold">
                        {product.name}
                    </h1>

                    <p className="text-blue-400 text-lg">
                        {product.category}
                    </p>

                    <h2 className="text-4xl font-bold text-green-500">
                        ₹{product.price.toLocaleString()}
                    </h2>

                    <p className="leading-8 text-slate-400">
                        {product.description}
                    </p>

                    <p
                        className={`text-lg font-semibold ${product.stock > 0
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                    >
                        {product.stock > 0
                            ? `In Stock (${product.stock})`
                            : "Out of Stock"}
                    </p>

                    <button className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700">
                        Add To Cart
                    </button>
                </div>
            </div>
        </div>
    );
}