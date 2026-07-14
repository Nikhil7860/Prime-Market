"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { useAppSelector } from "@/hooks/redux";
import { getRequest, postRequest } from "@/services/apiMethods";
import DashboardHeader from "../dashboard/DashboardHeader";
import DashboardStats from "../dashboard/DashboardStats";
import OrdersToolbar from "./OrdersToolbar";
import OrderList from "./OrderList";
import OrderDetailsModal from "./OrderDetailsModal";
import { getOrdersById, updateOrderStatus } from "@/services/order.service";


export interface OrderItem {
    _id: string;
    productName: string;
    product: string;
    quantity: number;
    price: number;
}

export interface Order {
    _id: string;
    user: string;

    products: OrderItem[];

    amount: number;

    discount: number;

    paymentStatus: string;

    status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
}

export default function OrderSection() {
    const user = useAppSelector((state: any) => state.auth.user);

    const [orders, setOrders] = useState<Order[]>([]);

    const [loading, setLoading] = useState(true);

    const [selectedOrder, setSelectedOrder] =
        useState<Order | null>(null);

    const [showModal, setShowModal] = useState(false);

    //------------------------------------------------
    // Fetch Orders
    //------------------------------------------------

    const fetchOrders = async () => {
        try {
            setLoading(true);

            const res: any = await getOrdersById(user?._id);

            const data =
                Array.isArray(res) ? res : res?.data || [];

            setOrders(data);
        } catch (err) {
            console.log(err);

            toast.error("Unable to load orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?._id) {
            fetchOrders();
        }
    }, [user]);

    //------------------------------------------------
    // Dashboard Stats
    //------------------------------------------------

    const stats = useMemo(() => {
        return {
            totalOrders: orders.length,

            delivered: orders.filter(
                (o) => o.status === "delivered"
            ).length,

            pending: orders.filter(
                (o) =>
                    o.status === "pending" ||
                    o.status === "processing"
            ).length,

            totalSpent: orders.reduce(
                (sum, order) => sum + order.amount,
                0
            ),
        };
    }, [orders]);

    //------------------------------------------------
    // View
    //------------------------------------------------

    const handleView = (order: Order) => {
        setSelectedOrder(order);

        setShowModal(true);
    };

    //------------------------------------------------
    // Cancel
    //------------------------------------------------

    const cancelOrder = async (id: string) => {
        try {

            await updateOrderStatus({ id: id, status: "cancelled" })

            toast.success("Order Cancelled");

            fetchOrders();

            setShowModal(false);
        } catch (err) {
            toast.error("Unable to cancel order");
        }
    };

    //------------------------------------------------
    // Download Receipt
    //------------------------------------------------

    const downloadReceipt = (order: Order) => {
        const doc = new jsPDF();

        doc.setFontSize(22);

        doc.text("Invoice", 14, 20);

        autoTable(doc, {
            startY: 35,

            head: [["Product", "Qty", "Price", "Subtotal"]],

            body: order.products.map((item) => [
                item.productName,

                item.quantity,

                `₹${item.price}`,

                `₹${item.quantity * item.price}`,
            ]),
        });

        const finalY =
            (doc as any).lastAutoTable.finalY + 20;

        doc.text(
            `Discount : ₹${order.discount}`,
            14,
            finalY
        );

        doc.text(
            `Grand Total : ₹${order.amount}`,
            14,
            finalY + 12
        );

        doc.save(`Order-${order._id}.pdf`);
    };

    //------------------------------------------------

    return (
        <>
            <DashboardHeader
                title="My Orders"
                description="Track and manage all your orders."
            />

            <DashboardStats
                totalOrders={stats.totalOrders}
                delivered={stats.delivered}
                pending={stats.pending}
                totalSpent={stats.totalSpent}
            />

            <OrdersToolbar />

            <OrderList
                orders={orders}
                loading={loading}
                onView={handleView}
                onReceipt={downloadReceipt}
            />

            {selectedOrder && (
                <OrderDetailsModal
                    open={showModal}
                    order={selectedOrder}
                    onClose={() => setShowModal(false)}
                    onCancel={cancelOrder}
                    onReceipt={downloadReceipt}
                />
            )}
        </>
    );
}