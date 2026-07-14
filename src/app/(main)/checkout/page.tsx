"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { CreditCard, ShoppingBag } from "lucide-react";

import { useAppSelector } from "@/hooks/redux";
import { postRequest } from "@/services/apiMethods";

export default function CheckoutPage() {
    const router = useRouter();

    const cart = useAppSelector((state) => state.cart);

    const user = useAppSelector((state: any) => state.auth.user);

    const total = cart.products.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    const makePayment = async () => {
        try {
            const paymentObj = {
                userId: user?._id,
                orderId: cart.orderId,
                transactionId: `TXN_${Date.now()}`,
                paymentMethod: "upi",
                gateway: "stripe",
                gatewayOrderId: "order_QWERTY123",
                gatewayPaymentId: "pay_XYZ456",
                amount: total,
                currency: "INR",
                status: "pending",
                description: `Payment for Order ${cart.orderId}`,
                paidAt: new Date(),
            };

            console.log(paymentObj, "paymentObj");

            // await postRequest("/payment/paymentInit", paymentObj);

            router.push("/payment");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">

            {/* Heading */}

            <div className="mb-8">

                <h1 className="text-3xl font-bold text-white sm:text-4xl">
                    Checkout
                </h1>

                <p className="mt-2 text-sm text-slate-400 sm:text-base">
                    Review your order before proceeding to payment.
                </p>

            </div>

            <div className="grid gap-6 lg:grid-cols-[2fr_1fr] lg:gap-8">

                {/* LEFT */}

                <div className="space-y-5">

                    {cart.products.map((item: any) => (

                        <div
                            key={item._id}
                            className="rounded-3xl border border-slate-800 bg-slate-900 p-5 transition hover:border-blue-500"
                        >

                            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                                {/* Product Image */}

                                <div className="relative mx-auto h-36 w-36 overflow-hidden rounded-2xl bg-white sm:mx-0 sm:h-28 sm:w-28">

                                    <Image
                                        src={item.images[0].image}
                                        alt={item.name}
                                        fill
                                        className="object-contain p-3"
                                    />

                                </div>

                                {/* Product Info */}

                                <div className="flex-1 text-center sm:text-left">

                                    <h2 className="text-xl font-semibold text-white">
                                        {item.name}
                                    </h2>

                                    <p className="mt-2 text-sm text-blue-400">
                                        category : {item.category}
                                    </p>

                                    <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                                        {item.description}
                                    </p>

                                    <p className="mt-3 text-sm text-slate-300">
                                        Quantity :
                                        <span className="ml-2 font-semibold text-white">
                                            {item.quantity}
                                        </span>
                                    </p>

                                </div>

                                {/* Price */}

                                <div className="text-center sm:text-right">

                                    <h2 className="text-2xl font-bold text-green-400">
                                        ₹
                                        {(item.price * item.quantity).toLocaleString()}
                                    </h2>

                                    <p className="mt-2 text-sm text-slate-400">
                                        ₹{item.price.toLocaleString()} each
                                    </p>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

                {/* RIGHT */}

                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 lg:sticky lg:top-24 lg:h-fit lg:p-8">

                    <div className="mb-6 flex items-center gap-3">

                        <div className="rounded-xl bg-blue-600/20 p-2">
                            <ShoppingBag className="text-blue-400" size={22} />
                        </div>

                        <h2 className="text-xl font-bold text-white sm:text-2xl">
                            Order Summary
                        </h2>

                    </div>

                    <div className="space-y-5">

                        <div className="flex items-center justify-between">

                            <span className="text-slate-400">
                                Items
                            </span>

                            <span className="font-semibold text-white">
                                {cart.products.length}
                            </span>

                        </div>

                        <div className="flex items-center justify-between">

                            <span className="text-slate-400">
                                Shipping
                            </span>

                            <span className="font-semibold text-green-400">
                                FREE
                            </span>

                        </div>

                        <div className="flex items-center justify-between">

                            <span className="text-slate-400">
                                Tax
                            </span>

                            <span className="font-semibold text-white">
                                ₹0
                            </span>

                        </div>

                        <hr className="border-slate-700" />

                        <div className="flex items-center justify-between text-lg font-bold sm:text-xl">

                            <span className="text-white">
                                Total
                            </span>

                            <span className="text-3xl font-extrabold text-blue-400">
                                ₹{total.toLocaleString()}
                            </span>

                        </div>

                    </div>

                    {/* Secure Checkout */}

                    <div className="mt-6 rounded-2xl border border-blue-500/20 bg-slate-800 p-4">

                        <h3 className="font-semibold text-white">
                            Secure Checkout
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-400">
                            Your payment is protected with secure encryption.
                            We never store your card details.
                        </p>

                    </div>

                    {/* Customer */}

                    <div className="mt-6 rounded-2xl bg-slate-800 p-4">

                        <h3 className="mb-3 font-semibold text-white">
                            Customer
                        </h3>

                        <div className="space-y-2">

                            <p className="text-white">
                                {user?.name}
                            </p>

                            <p className="break-all text-sm text-slate-400">
                                {user?.email}
                            </p>

                        </div>

                    </div>

                    {/* Payment Button */}

                    <button
                        onClick={makePayment}
                        className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-blue-600 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-blue-700 active:scale-95"
                    >

                        <CreditCard size={22} />

                        Proceed to Payment

                    </button>

                </div>

            </div>

        </section>
    );
}