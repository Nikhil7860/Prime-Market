"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { LayoutDashboard, Package, ShoppingCart, Users, Shield, Boxes, TicketPercent } from "lucide-react";
import { useAppSelector } from "@/hooks/redux";

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}


// const menus = [
//     {
//         title: "Dashboard",
//         href: "/admin/dashboard",
//         icon: LayoutDashboard,
//     },
//     {
//         title: "Products",
//         href: "/admin/products",
//         icon: Package,
//     },
//     {
//         title: "Orders",
//         href: "/admin/orders",
//         icon: ShoppingCart,
//     },
//     {
//         title: "Users",
//         href: "/admin/users",
//         icon: Users,
//     },
//     {
//         title: "Roles",
//         href: "/admin/roles",
//         icon: Shield,
//     },
//     {
//         title: "Modules",
//         href: "/admin/modules",
//         icon: Boxes,
//     },
//     {
//         title: "Coupons",
//         href: "/admin/coupons",
//         icon: TicketPercent,
//     },
//       {
//         title: "RolePermissionManager",
//         href: "/admin/RolePermissionManager",
//         icon: TicketPercent,
//     },
// ];


export default function AdminSidebar({ isOpen, setIsOpen }: SidebarProps) {

    const pathname = usePathname();

    const auth: any = useAppSelector((state) => state.auth);

    return (
        <>
            <aside
                className={`
        fixed top-0 left-0 z-50
        h-screen w-72
        bg-slate-900 text-white
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
    `}
            >
                {/* Header */}
                <div className="flex h-16 items-center justify-between border-b border-slate-800 px-6">

                    <h1 className="text-3xl font-bold text-blue-500">
                        Admin Panel
                    </h1>

                    <button
                        className="lg:hidden"
                        onClick={() => setIsOpen(false)}
                    >
                        <X size={24} />
                    </button>

                </div>

                {/* Navigation */}

                <nav className="space-y-2 p-4">

                    {auth.permissions.map((menu: any) => {
                        const Icon = menu.module.icon;

                        const active = pathname === menu.module.route;

                        return (
                            <Link
                                key={menu.module.route}
                                href={menu.module.route}
                                onClick={() => setIsOpen(false)}
                                className={`
                                    flex items-center
                                    gap-4
                                    rounded-xl
                                    px-5
                                    py-4
                                    transition
                                    ${active ? "bg-blue-600 text-white" : "hover:bg-slate-800"}`}>

                                {/* <Icon size={22} /> */}

                                <span>{menu.module.moduleName}</span>
                            </Link>
                        );
                    })}

                </nav>

            </aside>
        </>
    );
}