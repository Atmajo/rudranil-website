"use client"; // Mark the hook for client-side use

import { useState, useTransition } from "react";
import { getPaids, createPaid, updatePaid, deletePaid } from "@/actions/paid";
import { Paid } from "@prisma/client";
import { useEffect } from "react";

interface PaidDataProps {
  name: string;
  clerkId: string;
  categoryid: string;
}

export function usePaid() {
  const [paids, setPaids] = useState<Paid[]>();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);

  const fetchPaids = async () => {
    try {
      const data = await getPaids();
      setPaids(data);
    } catch (err) {
      setError(err as any);
    }
  };

  useEffect(() => {
    fetchPaids();
  }, []);

  const addPaid = async (paidData: PaidDataProps) => {
    startTransition(async () => {
      try {
        console.log("Creating Paid record with data:", paidData); // Log input data
        const newPaid = await createPaid(paidData);
        console.log("Created Paid record:", newPaid); // Log created record
        setPaids((prev) => (prev ? [...prev, newPaid] : [newPaid]));
      } catch (err) {
        console.error("Error creating Paid record:", err); // Detailed error logging
        setError(err as any);
      }
    });
  };

  const editPaid = async (id: string, updates: any) => {
    startTransition(async () => {
      try {
        const updatedPaid = await updatePaid(id, updates);
        setPaids((prev) =>
          (prev ?? []).map((paid) =>
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
        setPaids((prev) => (prev ? prev.filter((paid) => paid.id !== id) : []));
      } catch (err) {
        setError(err as any);
      }
    });
  };

  return { paids, isPending, error, addPaid, editPaid, removePaid };
}
