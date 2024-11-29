"use client"; // Mark the hook for client-side use

import { useState, useTransition } from "react";
import { createPaid, updatePaid, deletePaid } from "@/actions/paid";
import { Paid } from "@prisma/client";

export function usePaid(initialPaids: Paid[] = []) {
  const [paids, setPaids] = useState(initialPaids);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);

  const addPaid = async (paidData: any) => {
    startTransition(async () => {
      try {
        const newPaid = await createPaid(paidData);
        setPaids((prev) => [...prev, newPaid]);
      } catch (err) {
        setError(err as any);
      }
    });
  };
  
  const editPaid = async (id: string, updates: any) => {
    startTransition(async () => {
      try {
        const updatedPaid = await updatePaid(id, updates);
        setPaids((prev) =>
          prev.map((paid) =>
            paid.id === id ? { ...paid, ...updatedPaid } : paid
          )
        );
      } catch (err) {
        setError((err as any).message);
      }
    });
  };

  const removePaid = async (id: string) => {
    startTransition(async () => {
      try {
        await deletePaid(id);
        setPaids((prev) => prev.filter((paid) => paid.id !== id));
      } catch (err) {
        setError(err as any);
      }
    });
  };

  return { paids, isPending, error, addPaid, editPaid, removePaid };
}
