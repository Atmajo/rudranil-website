"use client";

import React, { useEffect } from "react";
import { useStores } from "@/hooks/use-store";
import { useRouter } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";

const layout = ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) => {
  const { isLoading, stores } = useStores();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && stores.length === 0) {
      router.push("/");
    }
  }, [stores]);

  return (
    <AdminPanelLayout>
      {children}
      <Toaster />
    </AdminPanelLayout>
  );
};

export default layout;
