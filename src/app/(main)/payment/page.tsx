"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PaymentGateway from "@/components/user/payment/PaymentGateway";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { emptyTheCart } from "@/redux/cart/cartSlice";
import { postRequest } from "@/services/apiMethods";
import toast from "react-hot-toast";

export default function PaymentPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const cart: any = useAppSelector((state) => state.cart);
    const auth: any = useAppSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    const [couponCode, setCouponCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState("");
    const [couponLoading, setCouponLoading] = useState(false);

    const total = cart.products.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    const finalAmountAfterDiscount = total - discount;

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            toast.error("Please enter a coupon code");
            return;
        }

        try {
            setCouponLoading(true);

            // Replace this with your API call later
            // const res = await postRequest("/coupon/apply", {
            //     code: couponCode,
            //     amount: total,
            // });

            // Demo coupon
            if (couponCode.toUpperCase() === "SAVE10") {
                const discountAmount = total * 0.1;

                setDiscount(discountAmount);
                setAppliedCoupon(couponCode.toUpperCase());

                toast.success("Coupon Applied Successfully");
            } else {
                toast.error("Invalid Coupon");
            }
        } finally {
            setCouponLoading(false);
        }
    };

    // ---------------------------
    // SUCCESS
    // ---------------------------

    const handleSuccess = async (paymentMethod: string, transactionId: string) => {
        try {
            setLoading(true);

            const order = {
                products: cart.products,
                userDetails: auth.user,
                paymentStatus: "Paid",
                transactionId,
                paymentMethod,
                gateway: "mock",
                currency: "INR",
                status: "pending",
                amount: finalAmountAfterDiscount,
                couponCode: appliedCoupon,
                discount
            };

            const data: any = await postRequest("/orders/createOrder", order);

            dispatch(emptyTheCart());

            router.push(`/payment/success?transactionId=${transactionId}`);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    // ---------------------------
    // FAILURE
    // ---------------------------

    const handleFailure = async (paymentMethod: string) => {
        try {
            setLoading(true);

            const paymentObj = {
                orderId: cart.orderId,
                paymentMethod,
                gateway: "mock",
                amount: total,
                status: "failed",
            };

            console.log(paymentObj, "handleFailure");

            router.push("/payment/failed");
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    if (!cart.products.length) {
        return (
            <section className="mx-auto max-w-5xl px-6 py-20">

                <div className="rounded-3xl bg-slate-900 p-12 text-center">

                    <h1 className="text-3xl font-bold text-white">
                        Your cart is empty
                    </h1>

                    <p className="mt-4 text-slate-400">
                        Add products before making a payment.
                    </p>

                    <button
                        onClick={() => router.push("/")}
                        className="mt-8 rounded-xl bg-blue-600 px-8 py-3 text-white hover:bg-blue-700"
                    >
                        Continue Shopping
                    </button>

                </div>

            </section>
        );
    }

    return (
        <section className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8 lg:py-10">

            {/* Header */}

            <div className="mb-6 sm:mb-10">

                <h1 className="text-3xl font-bold text-white sm:text-4xl">
                    Payment
                </h1>

                <p className="mt-2 text-sm text-slate-400 sm:text-base">
                    Complete your payment securely.
                </p>

            </div>

            <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:gap-8">

                {/* PAYMENT */}

                <div className="order-2 lg:order-1">

                    <PaymentGateway amount={finalAmountAfterDiscount} orderId={cart.orderId} onSuccess={handleSuccess} onFailure={handleFailure} />

                </div>

                {/* ORDER SUMMARY */}

                <div className="order-1 h-fit rounded-3xl bg-slate-900 p-5 sm:p-8 lg:order-2">

                    <h2 className="mb-6 text-xl font-bold text-white sm:text-2xl">
                        Order Summary
                    </h2>

                    <div className="space-y-4">

                        {cart.products.map((item: any) => (

                            <div
                                key={item._id}
                                className="flex items-start justify-between gap-4 border-b border-slate-700 pb-4"
                            >

                                <div className="min-w-0 flex-1">

                                    <h3 className="truncate font-medium text-white">
                                        {item.name}
                                    </h3>

                                    <p className="mt-1 text-sm text-slate-400">
                                        Qty : {item.quantity}
                                    </p>

                                </div>

                                <span className="whitespace-nowrap font-semibold text-white">
                                    ₹{(
                                        item.price *
                                        item.quantity
                                    ).toLocaleString()}
                                </span>

                            </div>

                        ))}

                    </div>

                    {/* Coupon */}

                    <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-800 p-4 sm:p-5">

                        <h3 className="mb-4 text-lg font-semibold text-white">
                            Apply Coupon
                        </h3>

                        <div className="flex flex-col gap-3 sm:flex-row">

                            <input
                                type="text"
                                placeholder="Enter coupon code"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                className="w-full rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
                            />

                            <button
                                onClick={handleApplyCoupon}
                                disabled={couponLoading}
                                className="w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
                            >
                                {couponLoading ? "Applying..." : "Apply"}
                            </button>

                        </div>

                        {appliedCoupon && (

                            <div className="mt-4 flex flex-col gap-3 rounded-xl bg-green-900/30 p-4 sm:flex-row sm:items-center sm:justify-between">

                                <span className="text-sm text-green-400">
                                    Coupon <strong>{appliedCoupon}</strong> applied successfully
                                </span>

                                <button
                                    onClick={() => {
                                        setCouponCode("");
                                        setAppliedCoupon("");
                                        setDiscount(0);
                                    }}
                                    className="font-medium text-red-400 transition hover:text-red-300"
                                >
                                    Remove
                                </button>

                            </div>

                        )}

                    </div>

                    {/* Price Details */}

                    <div className="mt-6 space-y-4">

                        <div className="flex justify-between text-slate-300">

                            <span>Subtotal</span>

                            <span>
                                ₹{total.toLocaleString()}
                            </span>

                        </div>

                        {discount > 0 && (

                            <div className="flex justify-between font-medium text-green-400">

                                <span>Discount</span>

                                <span>
                                    - ₹{discount.toLocaleString()}
                                </span>

                            </div>

                        )}

                        <hr className="border-slate-700" />

                        <div className="flex items-center justify-between">

                            <span className="text-lg font-bold text-white sm:text-xl">
                                Total
                            </span>

                            <span className="text-2xl font-bold text-blue-400 sm:text-3xl">
                                ₹{finalAmountAfterDiscount.toLocaleString()}
                            </span>

                        </div>

                    </div>

                    {/* Customer */}

                    <div className="mt-8 rounded-2xl bg-slate-800 p-5">

                        <h3 className="mb-3 text-lg font-semibold text-white">
                            Customer
                        </h3>

                        <div className="space-y-2">

                            <p className="font-medium text-slate-200">
                                {auth.userDetails?.name}
                            </p>

                            <p className="break-all text-sm text-slate-400">
                                {auth.userDetails?.email}
                            </p>

                        </div>

                    </div>

                    {loading && (

                        <div className="mt-6 rounded-xl bg-blue-600 py-4 text-center font-medium text-white">

                            Processing payment...

                        </div>

                    )}

                </div>

            </div>

        </section>
    );
}







