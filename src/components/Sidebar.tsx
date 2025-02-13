"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, FileText, Shield, Activity } from "lucide-react";

export default function Sidebar() {
    const pathname = usePathname();

    const menuItems = [
        { name: "User Management", icon: <User size={20} />, path: "/dashboard/user" },
        { name: "Post Management", icon: <FileText size={20} />, path: "/dashboard/post" },
        { name: "Moderation and Rules", icon: <Shield size={20} />, path: "/dashboard/moderation" },
        { name: "Metrics", icon: <Activity size={20} />, path: "/dashboard/metrics" }
    ];

    return (
        <div className="h-screen w-64 bg-gray-800 text-white flex flex-col p-4">
            <h2 className="text-2xl font-bold text-center mb-6">Control Panel</h2>
            <nav className="space-y-2">
                {menuItems.map((item) => (
                    <Link key={item.name} href={item.path}>
                        <div
                            className={`flex items-center gap-3 p-3 rounded-lg transition cursor-pointer ${pathname === item.path ? "bg-blue-500" : "hover:bg-gray-700"
                                }`}
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </div>
                    </Link>
                ))}
            </nav>
        </div>
    );
}
