"use server";

import { prisma } from "@/lib/prisma";

export interface UserDataType {
  email: string;
  name: string;
  clerkId: string;
  role: string;
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
