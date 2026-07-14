"use client";

import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { postRequest } from "@/services/apiMethods";
import { X } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getAllOrders, updateOrderStatus } from "@/services/order.service";

interface OrderItem {
    _id: string;
    productName: string;
    quantity: number;
    price: number;
}

interface Order {
    _id: string;
    user: string;
    items: OrderItem[];
    totalAmount: number;
    status: string;
}

const statusOptions = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export default function OrdersSection() {
    const [orders, setOrders] = useState<any[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editOrder, setEditOrder] = useState<any | null>(null);
    const [editStatus, setEditStatus] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");


    const ITEMS_PER_PAGE = 10;

    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);

    const paginatedOrders = useMemo(() => {
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

    // ---------------- FETCH ORDERS ----------------
    const fetchOrders = async () => {
        try {
            setLoading(true);

            const res: any = await getAllOrders();
            setOrders(Array.isArray(res) ? res : res?.data || []);
        } catch (err) {
            console.log(err);
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    const handleEditOrder = (order: any) => {
        setEditOrder(order);
        setEditStatus(order.status);
        setPaymentStatus(order.paymentStatus)
        setIsEditMode(true);
    };

    const handleUpdateOrder = async () => {
        if (!editOrder) return;

        try {
            await postRequest("orders/updateOrderStatus", { id: editOrder._id, status: editStatus });
            toast.success("Order updated successfully");
            setIsEditMode(false);
            setEditOrder(null);
            fetchOrders();
        } catch (err) {
            console.log(err);
            toast.error("Failed to update order");
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // ---------------- VIEW ORDER ----------------
    const handleViewOrder = (order: Order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    // ---------------- UPDATE STATUS ----------------
    const updateStatus = async (id: string, status: string) => {
        try {

            let response = await updateOrderStatus({ id, status })
            toast.success("Status updated");
            fetchOrders();

            if (selectedOrder) {
                setSelectedOrder({ ...selectedOrder, status });
            }
        } catch (err) {
            console.log(err);
            toast.error("Failed to update status");
        }
    };

    // ---------------- STATS ----------------
    const totalRevenue = orders.reduce(
        (sum, order) => sum + order.amount,
        0
    );

    return (
        <div className="flex flex-col gap-6">

            {/* HEADER */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">
                    Orders
                </h1>
                <p className="mt-2 text-slate-600">
                    Manage customer orders.
                </p>
            </div>

            {/* STATS */}
            <div className="grid gap-4 md:grid-cols-3">

                <div className="rounded-xl bg-white p-5 shadow-sm">
                    <h2 className="text-2xl font-bold text-slate-900">
                        {orders.length}
                    </h2>
                    <p className="text-slate-500">Total Orders</p>
                </div>

                <div className="rounded-xl bg-white p-5 shadow-sm">
                    <h2 className="text-2xl font-bold text-slate-900">
                        ₹{totalRevenue.toLocaleString()}
                    </h2>
                    <p className="text-slate-500">Total Revenue</p>
                </div>

                <div className="rounded-xl bg-white p-5 shadow-sm">
                    <h2 className="text-2xl font-bold text-slate-900">
                        {orders.filter(o => o.status === "pending").length}
                    </h2>
                    <p className="text-slate-500">Pending Orders</p>
                </div>

            </div>

            {/* TABLE */}
            <div className="w-full overflow-x-auto rounded-xl bg-white shadow-sm">

                <table className="w-full min-w-[900px]">

                    <thead className="bg-slate-50 text-slate-700">
                        <tr>
                            <th className="p-4 text-left">Order ID</th>
                            <th className="p-4 text-left">User</th>
                            <th className="p-4 text-left">Items</th>
                            <th className="p-4 text-left">Amount</th>
                            <th className="p-4 text-left">Status</th>
                            <th className="p-4 text-left">Action</th>
                        </tr>
                    </thead>

                    <tbody>

                        {paginatedOrders.map((order: any) => (
                            <tr key={order._id} className="border-t">

                                <td className="p-4 text-slate-800">
                                    #{order._id.slice(-6)}
                                </td>

                                <td className="p-4 text-slate-800">
                                    {order.user.slice(-8)}
                                </td>

                                <td className="p-4 text-slate-800">
                                    {order.products.length}
                                </td>

                                <td className="p-4 font-semibold text-slate-900">
                                    ₹{order.amount.toLocaleString()}
                                </td>

                                <td className="p-4">

                                    <span className={`rounded-full px-3 py-1 text-xs font-medium
                                        ${order.status === "pending"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : order.status === "processing"
                                                ? "bg-blue-100 text-blue-700"
                                                : order.status === "shipped"
                                                    ? "bg-indigo-100 text-indigo-700"
                                                    : order.status === "delivered"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {order.status}
                                    </span>

                                </td>


                                <td className="p-4">
                                    <div className="flex items-center gap-2 whitespace-nowrap">

                                        <button
                                            onClick={() => handleViewOrder(order)}
                                            className="rounded bg-slate-900 px-3 py-1 text-white"
                                        >
                                            View
                                        </button>

                                        <button
                                            onClick={() => handleEditOrder(order)}
                                            className="rounded bg-blue-600 px-3 py-1 text-white"
                                        >
                                            Edit
                                        </button>

                                        <select
                                            value={order.status}
                                            onChange={(e) => updateStatus(order._id, e.target.value)}
                                            className="rounded border border-slate-300 p-1 text-sm bg-white text-slate-900"
                                        >
                                            {statusOptions.map((s) => (<option key={s} value={s}>{s}</option>))}
                                        </select>
                                    </div>
                                </td>

                            </tr>
                        ))}

                    </tbody>

                </table>

                {totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-between rounded-2xl border border-violet-500/30 bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 p-5 shadow-xl">
                        {/* Left */}
                        <p className="text-sm text-slate-300">
                            Showing{" "}
                            <span className="font-semibold text-white">
                                {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                            </span>{" "}
                            -
                            <span className="font-semibold text-white">
                                {Math.min(currentPage * ITEMS_PER_PAGE, orders.length)}
                            </span>{" "}
                            of{" "}
                            <span className="font-semibold text-white">
                                {orders.length}
                            </span>{" "}
                            orders
                        </p>

                        {/* Right */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white backdrop-blur transition-all duration-300 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronLeft size={20} />
                            </button>

                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white backdrop-blur transition-all duration-300 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                )}

            </div>

            {/* MODAL */}
            {showModal && selectedOrder && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onClick={() => setShowModal(false)}
                >

                    <div
                        className="w-full max-w-2xl rounded-xl bg-black p-6"
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* HEADER */}
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold">
                                Order Details
                            </h2>

                            <button onClick={() => setShowModal(false)}>
                                <X />
                            </button>
                        </div>

                        {/* INFO */}
                        <div className="mt-4 space-y-2 text-slate-700">

                            <p><b>Order ID:</b> {selectedOrder._id}</p>
                            <p><b>User:</b> {selectedOrder.user}</p>
                            <p><b>Status:</b> {selectedOrder.status}</p>

                        </div>

                        <hr className="my-4" />

                        {/* ITEMS */}
                        <h3 className="mb-2 font-semibold">
                            Products
                        </h3>

                        {selectedOrder.products.map((item: any) => (
                            <div
                                key={item._id}
                                className="flex justify-between border-b py-2"
                            >

                                <div>
                                    <p className="font-medium">
                                        {item.productName}
                                    </p>

                                    <p className="text-sm text-slate-500">
                                        Qty: {item.quantity}
                                    </p>
                                </div>

                                <p>
                                    ₹{(item.price * item.quantity).toLocaleString()}
                                </p>

                            </div>
                        ))}

                        <div className="mt-4 text-right text-lg font-bold">
                            Total: ₹{selectedOrder.amount.toLocaleString()}
                        </div>

                    </div>

                </div>
            )}

            {isEditMode && editOrder && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onClick={() => setIsEditMode(false)}
                >
                    <div
                        className="w-full max-w-md rounded-xl bg-white p-6"
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* HEADER */}
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900">
                                Edit Order
                            </h2>

                            <button onClick={() => setIsEditMode(false)}>
                                <X />
                            </button>
                        </div>

                        {/* FORM */}
                        <div className="mt-4 space-y-4">

                            <div>
                                <label className="text-sm text-slate-600">
                                    Order ID
                                </label>
                                <p className="font-medium text-slate-900">
                                    #{editOrder._id.slice(-6)}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm text-slate-600">
                                    Status
                                </label>

                                <select
                                    value={editStatus}
                                    onChange={(e) => setEditStatus(e.target.value)}
                                    className="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                                >
                                    {statusOptions.map((s) => (
                                        <option key={s} value={s}>
                                            {s}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* BUTTONS */}
                            <div className="flex justify-end gap-2 pt-4">

                                <button
                                    onClick={() => setIsEditMode(false)}
                                    className="rounded bg-red-600 px-4 py-2 text-white"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleUpdateOrder}
                                    className="rounded bg-blue-600 px-4 py-2 text-white"
                                >
                                    Save Changes
                                </button>

                            </div>

                        </div>

                    </div>


                </div>
            )}

        </div>
    );
}