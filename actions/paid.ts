"use server";

import { prisma } from "@/lib/prisma";
import { Paid } from "@prisma/client";

// Fetch all Paid records
export async function getPaids(): Promise<Paid[]> {
  const data = await prisma.paid.findMany({
    include: { category: true },
  });

  if (data.length === 0) {
    return [];
  }
  
  return data;
}

// Create a new Paid record
export async function createPaid(data: any) {
  return await prisma.paid.create({
    data,
  });
}

// Update an existing Paid record
export async function updatePaid(id: string, updates: any) {
  return await prisma.paid.update({
    where: { id },
    data: updates,
  });
}

// Delete a Paid record
export async function deletePaid(id: string) {
  return await prisma.paid.delete({
    where: { id },
  });
}
