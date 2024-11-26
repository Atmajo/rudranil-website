"use server";

import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export interface UserDataType {
  email: string;
  name: string;
  clerkId: string;
  role: UserRole;
}

export async function createUser(userData: UserDataType) {
  try {
    const user = await prisma.user.create({
      data: userData,
    });

    return user;
  } catch (err) {
    console.error(err);
  }
}

export async function fetchUser(clerkId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (err: any) {
    console.error("Error fetching user:", err);
    throw new Error(err.message || "Failed to fetch user");
  }
}
