// "use client";

// import DashboardStats from "./DashboardStats";
// import RevenueChart from "./RevenueChart";
// import RecentOrders from "./RecentOrders";
// import LatestUsers from "./LatestUsers";

// export default function DashboardHome() {
//     return (
//         <div className="w-full space-y-6 lg:space-y-8">

//             {/* Heading */}

//             <div>
//                 <h1 className="text-2xl font-bold text-slate-900 dark:text-black sm:text-3xl lg:text-4xl">
//                     Admin Dashboard
//                 </h1>

//                 <p className="mt-2 text-sm text-slate-500 sm:text-base">
//                     Welcome back 👋 Here's what's happening with your store today.
//                 </p>
//             </div>

//             {/* Stats */}

//             <DashboardStats
//                 stats={{
//                     revenue: 125000,
//                     orders: 248,
//                     users: 640,
//                     products: 87,
//                 }}
//             />

//             {/* Revenue */}

//             <div className="overflow-hidden rounded-2xl">
//                 <RevenueChart />
//             </div>

//             {/* Tables */}

//             <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

//                 <div className="overflow-hidden rounded-2xl">
//                     <RecentOrders />
//                 </div>

//                 <div className="overflow-hidden rounded-2xl">
//                     <LatestUsers />
//                 </div>

//             </div>

//         </div>
//     );
// }




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