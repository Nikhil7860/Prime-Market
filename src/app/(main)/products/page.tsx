"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductFilters from "../../../components/user/products/ProductFilters";
import ProductGrid from "../../../components/user/products/ProductGrid";
import { getProductByCategoryName, getProducts } from "@/services/product.service";
import { useAppSelector } from "@/hooks/redux";

export interface Product {
    _id: string;
    name: string;
    slug: string;
    description: string;
    category: string;
    categoryName: string;
    brand: string;
    images: { _id?: string; image: string; name: string; }[];
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



export default function ProductsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const urlCategory = searchParams.get("category");
    const cart = useAppSelector((state) => state.cart);
    const [category, setCategory] = useState<any>(urlCategory);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("featured");
    const [products, setProducts] = useState<Product[]>([]);
    const [minPrice, setMinPrice] = useState(250000);
    const [rating, setRating] = useState(0);
    const [inStock, setInStock] = useState(false);

    console.log(urlCategory, "in the urlCategory")

    useEffect(() => {
        const selectedCategory: any = urlCategory;
        setCategory(selectedCategory);
        if (selectedCategory !== "All") {
            fetchProductsByCategoryName(selectedCategory);
        } else {
            fetchAllProducts()
        }
    }, [urlCategory]);


    const fetchAllProducts = async () => {
        try {
            const data: any = await getProducts();
            const productList = Array.isArray(data) ? data : [];
            setProducts(productList);
        } catch (error) {
            console.log(error, "in the error")
        }
    }

    const fetchProductsByCategoryName = async (categoryName: string) => {
        try {
            const response: any = await getProductByCategoryName(categoryName);
            setProducts(response || []);
        } catch (error) {
            console.log(error);
            setProducts([]);
        }
    };

    const filteredProducts = useMemo(() => {
        let data = [...products];

        // Active products only
        data = data.filter((item) => item.isActive);

        // Search
        if (search.trim()) {
            const query = search.toLowerCase();
            data = data.filter(
                (item) =>
                    item.name.toLowerCase().includes(query) ||
                    item.brand.toLowerCase().includes(query) ||
                    item.categoryName.toLowerCase().includes(query));
        }

        // Price
        data = data.filter((item) => item.price <= minPrice);

        // Rating
        if (rating > 0) {
            data = data.filter((item) => item.rating >= rating);
        }

        // Stock
        if (inStock) {
            data = data.filter((item) => item.stock > 0);
        }

        // Sorting
        switch (sort) {
            case "low-high":
                data.sort((a, b) => a.price - b.price);
                break;

            case "high-low":
                data.sort((a, b) => b.price - a.price);
                break;

            case "rating":
                data.sort((a, b) => b.rating - a.rating);
                break;

            case "name":
                data.sort((a, b) => a.name.localeCompare(b.name));
                break;

            case "featured":
                data.sort(
                    (a, b) => Number(b.isFeatured) - Number(a.isFeatured)
                );
                break;
        }

        return data;
    }, [products, search, minPrice, rating, inStock, sort]);

    const handleCategory = (value: string) => {
        setCategory(value);

        if (value === "All") {
            router.push("/products");
        } else {
            router.push(`/products?category=${value}`);
        }
    };

    return (
        <main className="min-h-screen bg-[#071020] text-white">

            <div className="mx-auto  px-5 py-10">

                <div className="mt-8 grid gap-8 lg:grid-cols-[320px_1fr]">

                    {/* Left Sidebar */}
                    <aside className="lg:sticky lg:top-24 h-fit">

                        <ProductFilters
                            categories={cart.categoryAry}
                            category={category}
                            search={search}
                            sort={sort}
                            minPrice={minPrice}
                            rating={rating}
                            inStock={inStock}
                            onCategoryChange={handleCategory}
                            onSearchChange={setSearch}
                            onSortChange={setSort}
                            onPriceChange={setMinPrice}
                            onRatingChange={setRating}
                            onStockChange={setInStock}
                            onClearFilters={() => {
                                setSearch("");
                                setCategory(category);
                                setSort("featured");
                                setMinPrice(minPrice);
                                setRating(rating);
                                setInStock(false);
                            }}
                        />

                    </aside>

                    {/* Right Side */}
                    <section>

                        <ProductGrid
                            products={filteredProducts}
                        />

                    </section>

                </div>

            </div>

        </main>
    );
}