import {
    ShoppingBag,
    Package,
    Truck,
    Clock3,
    CheckCircle2,
    XCircle,
} from "lucide-react";
import React from "react";
import { Order } from "./types";

export const getStatusColor = (status: string) => {
    switch (status) {
        case "pending":
            return "bg-yellow-100 text-yellow-700";

        case "processing":
            return "bg-blue-100 text-blue-700";

        case "shipped":
            return "bg-indigo-100 text-indigo-700";

        case "delivered":
            return "bg-green-100 text-green-700";

        case "cancelled":
            return "bg-red-100 text-red-700";

        default:
            return "bg-slate-100 text-slate-700";
    }
};

export const getPaymentColor = (status: string) => {
    switch (status) {
        case "paid":
            return "bg-green-100 text-green-700";

        case "pending":
            return "bg-yellow-100 text-yellow-700";

        case "failed":
            return "bg-red-100 text-red-700";

        default:
            return "bg-slate-100 text-slate-700";
    }
};

export const getStatusIcon = (status: string) => {
    switch (status) {
        case "pending":
            return React.createElement(Clock3, { size: 18 });

        case "processing":
            return React.createElement(Package, { size: 18 });

        case "shipped":
            return React.createElement(Truck, { size: 18 });

        case "delivered":
            return React.createElement(CheckCircle2, { size: 18 });

        case "cancelled":
            return React.createElement(XCircle, { size: 18 });

        default:
            return React.createElement(ShoppingBag, { size: 18 });
    }
};

export const calculateStats = (orders: Order[]) => ({
    totalOrders: orders.length,

    delivered: orders.filter(
        (o) => o.status === "delivered"
    ).length,

    pending: orders.filter(
        (o) =>
            o.status === "pending" ||
            o.status === "processing"
    ).length,

    cancelled: orders.filter(
        (o) => o.status === "cancelled"
    ).length,

    totalSpent: orders.reduce(
        (sum, order) => sum + order.totalAmount,
        0
    ),
});