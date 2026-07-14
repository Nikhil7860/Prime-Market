"use client";

import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";

import { decrement, increment } from "@/redux/cart/cartSlice";

import { postRequest } from "@/services/apiMethods";

export default function CartPage() {
    const router = useRouter();

    const dispatch = useAppDispatch();

    const cart = useAppSelector((state) => state.cart);

    const auth = useAppSelector((state) => state.auth);

    const total = cart.products.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const increaseQty = (id: string) => {
        const item = cart.products.find((p) => p._id === id);
        if (item) dispatch(increment(item));
    };

    const decreaseQty = (id: string) => {
        const item = cart.products.find((p) => p._id === id);
        if (item) dispatch(decrement(item));
    };

    const proceedToCheckout = async () => {
        try {
            router.push("/checkout");
        } catch (error) {
            console.error(error);
        }
    };

    if (cart.products.length === 0) {
        return (
            <div className="flex min-h-[80vh] items-center justify-center px-6">
                <div className="text-center">
                    <ShoppingCart
                        size={120}
                        className="mx-auto text-slate-500"
                    />

                    <h1 className="mt-6 text-4xl font-bold text-white">
                        Your Cart is Empty
                    </h1>

                    <p className="mt-3 text-gray-400">
                        Looks like you haven't added anything yet.
                    </p>

                    <button
                        onClick={() => router.push("/")}
                        className="mt-8 rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <main className="mx-auto max-w-7xl px-6 py-12">
            <h1 className="mb-10 text-4xl font-bold text-white">
                Shopping Cart
            </h1>

            <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
                {/* Products */}

                <div className="space-y-6">
                    {cart.products.map((item: any) => (
                        <div
                            key={item._id}
                            className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl md:flex-row"
                        >
                            <div className="relative h-40 w-full overflow-hidden rounded-2xl bg-white md:w-40">

                                <Image
                                    src={item.images[0].image}
                                    alt={"Hello"}
                                    fill
                                    className="object-contain p-3"
                                />
                            </div>

                            <div className="flex flex-1 flex-col justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">
                                        {item.name}
                                    </h2>

                                    <p className="mt-2 text-gray-400">
                                        {item.description}
                                    </p>

                                    <p className="mt-4 text-3xl font-bold text-green-400">
                                        ₹{item.price.toLocaleString()}
                                    </p>
                                </div>

                                <div className="mt-6 flex flex-wrap items-center justify-between gap-6">
                                    <div className="flex items-center rounded-xl bg-slate-800">
                                        <button
                                            onClick={() =>
                                                decreaseQty(item._id)
                                            }
                                            className="px-5 py-3 text-xl text-white hover:bg-slate-700"
                                        >
                                            −
                                        </button>

                                        <span className="px-6 text-lg font-semibold text-white">
                                            {item.quantity}
                                        </span>

                                        <button
                                            onClick={() =>
                                                increaseQty(item._id)
                                            }
                                            disabled={
                                                item.quantity >= item.stock
                                            }
                                            className="px-5 py-3 text-xl text-white hover:bg-slate-700 disabled:opacity-40"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div className="text-2xl font-bold text-blue-400">
                                        ₹
                                        {(
                                            item.price * item.quantity
                                        ).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}

                <div className="h-fit rounded-3xl border border-white/10 bg-slate-900/70 p-8 backdrop-blur-xl">
                    <h2 className="mb-8 text-3xl font-bold text-white">
                        Order Summary
                    </h2>

                    <div className="space-y-5">
                        <div className="flex justify-between text-gray-300">
                            <span>Items</span>

                            <span>{cart.products.length}</span>
                        </div>

                        <div className="flex justify-between text-gray-300">
                            <span>Subtotal</span>

                            <span>₹{total.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between text-gray-300">
                            <span>Shipping</span>

                            <span className="text-green-400">
                                FREE
                            </span>
                        </div>

                        <div className="flex justify-between text-gray-300">
                            <span>Tax</span>

                            <span>Included</span>
                        </div>

                        <hr className="border-slate-700" />

                        <div className="flex justify-between text-2xl font-bold text-white">
                            <span>Total</span>

                            <span>₹{total.toLocaleString()}</span>
                        </div>

                        <button
                            onClick={proceedToCheckout}
                            className="mt-8 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-4 text-lg font-semibold text-white transition hover:from-indigo-600 hover:to-purple-600"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}