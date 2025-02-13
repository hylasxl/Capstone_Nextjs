"use client";

import { useAuth } from "@/hooks/useAuth";
import LogoutButton from "@/components/LogoutButton";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">
        {isAuthenticated ? "Welcome, User!" : "Please Log In"}
      </h1>
      {isAuthenticated && <LogoutButton />}
    </div>
  );
}
