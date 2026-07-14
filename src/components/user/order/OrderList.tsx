"use client";

import { useMemo, useState, useEffect } from "react";
import OrderCard from "./OrderCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface OrderItem {
    _id: string;
    productName: string;
    product: string;
    quantity: number;
    price: number;
}

interface Order {
    _id: string;
    user: string;
    items: OrderItem[];
    totalAmount: number;
    couponDiscount: number;
    paymentStatus: string;
    status:
    | "pending"
    | "confirmed"
    | "shipped"
    | "delivered"
    | "cancelled";
    createdAt?: string;
}

interface Props {
    orders: any[];
    loading: boolean;
    onView: (order: any) => void;
    onReceipt: (order: any) => void;
}

const ITEMS_PER_PAGE = 5;

export default function OrderList({ orders, loading, onView, onReceipt }: Props) {
    const [currentPage, setCurrentPage] = useState(1);
    useEffect(() => {
        setCurrentPage(1);
    }, [orders]);

    const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);

    const currentOrders = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return orders.slice(start, start + ITEMS_PER_PAGE);
    }, [orders, currentPage]);

    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages) return;

        setCurrentPage(page);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    if (loading) {
        return (
            <div className="flex h-60 items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
            </div>
        );
    }


    if (!loading && orders.length === 0) {
        return (
            <div className="rounded-3xl border border-white/10 bg-slate-900 p-12 text-center">
                <h3 className="text-xl font-semibold text-white">
                    No Orders Found
                </h3>

                <p className="mt-2 text-slate-400">
                    You haven't placed any orders yet.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Orders */}
            <div className="space-y-6">
                {currentOrders.map((order) => (
                    <OrderCard
                        key={order._id}
                        order={order}
                        onView={() => onView(order)}
                        onReceipt={() => onReceipt(order)}
                    />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="rounded-3xl border border-violet-500/30 bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 p-6 shadow-2xl">
                    <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
                        {/* Left */}
                        <p className="text-sm text-slate-300">
                            Showing{" "}
                            <span className="font-bold text-white">
                                {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                            </span>{" "}
                            -
                            <span className="font-bold text-white">
                                {" "}
                                {Math.min(
                                    currentPage * ITEMS_PER_PAGE,
                                    orders.length
                                )}
                            </span>{" "}
                            of{" "}
                            <span className="font-bold text-white">
                                {orders.length}
                            </span>{" "}
                            orders
                        </p>

                        {/* Right */}
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            {/* Previous */}
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronLeft size={18} />
                            </button>

                            {/* Page Numbers */}
                            {Array.from(
                                { length: totalPages },
                                (_, index) => {
                                    const isActive =
                                        currentPage === index + 1;

                                    return (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                goToPage(index + 1)
                                            }
                                            className={`h-11 w-11 rounded-xl text-sm font-bold transition-all duration-300 ${isActive
                                                ? "bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 text-white shadow-lg shadow-pink-500/30 scale-105"
                                                : "border border-white/20 bg-white/10 text-white backdrop-blur-md hover:scale-105 hover:bg-white/20"
                                                }`}
                                        >
                                            {index + 1}
                                        </button>
                                    );
                                }
                            )}

                            {/* Next */}
                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}