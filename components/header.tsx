import { useFetchUser } from "@/hooks/use-user";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

const Header = () => {
  const { user, loading } = useFetchUser();

  return (
    <header className="px-10 py-3 w-full">
      <nav className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Rudranil's Website</h1>
        <div className="flex gap-2">
          {user?.role === "ADMIN" && (
            <Link href="/admin/dashboard">Admin Panel</Link>
          )}
          <UserButton />
        </div>
      </nav>
    </header>
  );
};

export default Header;
