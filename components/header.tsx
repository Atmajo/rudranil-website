import { useFetchUser } from "@/hooks/use-user";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

const Header = () => {
  const { user, loading } = useFetchUser();

  return (
    <header className="px-10 py-3 w-full">
      <nav className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Rudranil's Website</h1>
        <div className="flex gap-2">
          {user?.role === "ADMIN" && (
            <Link href="/admin/dashboard">
              <Button>Admin Panel</Button>
            </Link>
          )}
          <UserButton />
        </div>
      </nav>
    </header>
  );
};

export default Header;
