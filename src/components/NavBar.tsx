"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { Bell, MessageCircle, User, Home, LayoutDashboard } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
    const pathname = usePathname();
    const { isAuthenticated, logout, user } = useAuth();
    const router = useRouter();

    const linkMap = [
        { name: "User Management", icon: Home, path: "/newfeed" },
        { name: "Post Management", icon: User, path: "/friend" },
        { name: "Moderation and Rules", icon: MessageCircle, path: "/message" },
        { name: "Metrics", icon: Bell, path: "/notification" }
    ];

    return (
        <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
            <div className="container mx-auto flex justify-between items-center p-4">
                {/* Left - Logo */}
                <Link href="/newfeed" className="text-2xl font-bold text-blue-600">
                    <div className="h-10 w-32 flex items-center">
                        <Image
                            src="/app_icon.png"
                            alt="MyApp Logo"
                            width={60}
                            height={30}
                            className="object-contain"
                            style={{ width: "auto", height: "auto" }}
                            priority
                        />
                    </div>

                </Link>

                {/* Middle - Navigation */}
                <div className="md:flex space-x-8">
                    {linkMap.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link key={item.name} href={item.path}>
                                <div
                                    className={`flex flex-col items-center gap-1 p-3 rounded-lg transition cursor-pointer ${isActive ? "bg-blue-500 text-white border-b-4 border-blue-700" : "hover:bg-gray-200"
                                        }`}
                                >
                                    <item.icon size={20} className={`${isActive ? "text-white" : "text-gray-700"}`} />
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Right - Profile & Auth */}
                <div className="hidden md:flex space-x-4 items-center">
                    {isAuthenticated ? (
                        <>
                            <Link href="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
                                <User size={20} />
                                <span>Profile</span>
                            </Link>
                            {user!.roleID === 2 && (
                                <Link href="/dashboard/user" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
                                    <LayoutDashboard size={20} />
                                    <span>Dashboard</span>
                                </Link>
                            )}
                            <button
                                onClick={() => {
                                    logout()
                                    router.push("/login")
                                }}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => router.push("/login")}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            Login
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}
