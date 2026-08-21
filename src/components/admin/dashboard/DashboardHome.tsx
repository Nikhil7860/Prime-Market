"use client";

import { useEffect, useState } from "react";

import DashboardStats from "./DashboardStats";
import RevenueChart from "./RevenueChart";
import RecentOrders from "./RecentOrders";
import LatestUsers from "./LatestUsers";
import { getRequest } from "@/services/apiMethods";



export default function DashboardHome() {
    const [loading, setLoading] = useState(true);

    const [dashboard, setDashboard] = useState({
        stats: {
            revenue: 0,
            orders: 0,
            users: 0,
            products: 0,
        },
        recentOrders: [],
        latestUsers: [],
        monthlyRevenue: [],
    });

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            const response: any = await getRequest("admin/dashboard");
            console.log(response.data, "response.data in the Dashboard")
            setDashboard(response.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                Loading Dashboard...
            </div>
        );
    }

    return (
        <div className="w-full space-y-6 lg:space-y-8">

            <div>
                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl">
                    Admin Dashboard
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Welcome back 👋 Here's what's happening with your store today.
                </p>
            </div>

            <DashboardStats stats={dashboard.stats} />

            <RevenueChart data={dashboard.monthlyRevenue} />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <RecentOrders recentorders={dashboard.recentOrders} />
                <LatestUsers users={dashboard.latestUsers} />
            </div>

        </div>
    );
}