"use client";

import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";

interface ProductFiltersProps {
    categories: string[];
    category: string;
    search: string;
    sort: string;

    minPrice: number;
    rating: number;
    inStock: boolean;

    onCategoryChange: (value: string) => void;
    onSearchChange: (value: string) => void;
    onSortChange: (value: string) => void;

    onPriceChange: (value: number) => void;
    onRatingChange: (value: number) => void;
    onStockChange: (value: boolean) => void;

    onClearFilters: () => void;
}

export default function ProductFilters({
    categories,
    category,
    search,
    sort,
    minPrice,
    rating,
    inStock,
    onCategoryChange,
    onSearchChange,
    onSortChange,
    onPriceChange,
    onRatingChange,
    onStockChange,
    onClearFilters }: ProductFiltersProps) {


    return (
        <div className="rounded-3xl border border-slate-700 bg-slate-900/70 p-6 backdrop-blur-xl">

            <div className="mb-6 flex items-center gap-3">
                <SlidersHorizontal className="text-cyan-400" />
                <h2 className="text-xl font-semibold">
                    Filters
                </h2>
            </div>

            <div className="space-y-6">

                {/* Search */}

                <div className="lg:col-span-2">

                    <label className="mb-2 block text-sm text-slate-400">
                        Search
                    </label>

                    <div className="relative">

                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Search products..."
                            className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-11 pr-4 outline-none transition focus:border-cyan-400"
                        />

                    </div>

                </div>

                {/* Category */}

                <div>

                    <label className="mb-2 block text-sm text-slate-400">
                        Category wfe
                    </label>

                    <select
                        value={category}
                        onChange={(e) => onCategoryChange(e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 outline-none focus:border-cyan-400"
                    >
                        {categories.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>

                </div>

                {/* Sort */}

                <div>

                    <label className="mb-2 block text-sm text-slate-400">
                        Sort
                    </label>

                    <select
                        value={sort}
                        onChange={(e) =>
                            onSortChange(e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 outline-none focus:border-cyan-400"
                    >
                        <option value="featured">
                            Featured
                        </option>

                        <option value="low-high">
                            Price Low → High
                        </option>

                        <option value="high-low">
                            Price High → Low
                        </option>

                        <option value="rating">
                            Highest Rating
                        </option>

                        <option value="name">
                            Name A → Z
                        </option>
                    </select>

                </div>

                {/* Price */}

                <div>

                    <label className="mb-2 block text-sm text-slate-400">
                        Max Price
                    </label>

                    <input
                        type="range"
                        min={0}
                        max={250000}
                        step={5000}
                        value={minPrice}
                        onChange={(e) =>
                            onPriceChange(Number(e.target.value))
                        }
                        className="w-full"
                    />

                    <p className="mt-2 text-sm text-cyan-400">
                        ₹{minPrice.toLocaleString()}
                    </p>

                </div>

                {/* Rating */}

                <div>

                    <label className="mb-2 block text-sm text-slate-400">
                        Rating
                    </label>

                    <select
                        value={rating}
                        onChange={(e) =>
                            onRatingChange(Number(e.target.value))
                        }
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 outline-none focus:border-cyan-400"
                    >
                        <option value={0}>
                            All Ratings
                        </option>

                        <option value={5}>
                            ⭐⭐⭐⭐⭐
                        </option>

                        <option value={4}>
                            ⭐⭐⭐⭐ & Above
                        </option>

                        <option value={3}>
                            ⭐⭐⭐ & Above
                        </option>

                        <option value={2}>
                            ⭐⭐ & Above
                        </option>
                    </select>

                </div>

            </div>

            {/* Bottom Row */}

            <div className="mt-8 flex flex-col gap-5 border-t border-slate-700 pt-6 lg:flex-row lg:items-center lg:justify-between">

                <label className="flex cursor-pointer items-center gap-3">

                    <input
                        type="checkbox"
                        checked={inStock}
                        onChange={(e) => onStockChange(e.target.checked)}
                        className="h-5 w-5 rounded accent-cyan-500"
                    />

                    <span>
                        Show In Stock Only
                    </span>

                </label>

                <button
                    onClick={onClearFilters}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500 px-5 py-3 text-red-400 transition hover:bg-red-500 hover:text-white"
                >
                    <RotateCcw size={18} />

                    Clear Filters
                </button>

            </div>

        </div>
    );
}