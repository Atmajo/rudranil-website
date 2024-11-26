"use client";

import { todayDate } from "@/lib/utils";
import { UserButton, useUser } from "@clerk/nextjs";
import React from "react";

const Header = () => {
  const { user } = useUser();
  const date = todayDate();

  if (!user) return null;

  return (
    <div className="flex px-5 py-3">
    </div>
  );
};

export default Header;
