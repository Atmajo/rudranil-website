"use server";

import { prisma } from "@/lib/prisma";

// Fetch all Paid records
export async function getPaids() {
  return await prisma.paid.findMany({
    include: { category: true },
  });
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
