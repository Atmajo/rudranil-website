"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { useFetchUser } from "@/hooks/use-user";

const layout = ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) => {
  const router = useRouter();
  const { user, loading } = useFetchUser();

  useEffect(() => {
    if (!loading && user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [loading, user]);

  return (
    <AdminPanelLayout>
      {children}
      <Toaster />
    </AdminPanelLayout>
  );
};

export default layout;
