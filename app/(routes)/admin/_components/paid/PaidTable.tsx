"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LucideLoader, Pen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePaid } from "@/hooks/use-paid";
import { deleteUploadthingFiles } from "@/lib/server/uploadthing";

const PaidTable = () => {
  const pathname = usePathname();
  const { paids, isPending, error, addPaid, editPaid, removePaid } = usePaid(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategories, setFilteredCategories] = useState(paids);

  useEffect(() => {
    setFilteredCategories(
      paids.filter((category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, paids]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center mt-10">
        <LucideLoader className="animate-spin w-6 h-6" />
      </div>
    );
  }

  return (
    <div className="flex flex-col mt-5">
      <Input
        placeholder="Search"
        className="w-1/2 md:w-1/6"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {filteredCategories.length !== 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.map((paid) => (
              <TableRow key={paid.id}>
                <TableHead>{paid.id}</TableHead>
                <TableHead>{paid.name}</TableHead>
                <TableHead>{paid.categoryid}</TableHead>
                <TableHead className="flex items-center gap-2">
                  <Button
                    variant={"destructive"}
                    size={"icon"}
                    onClick={() => {
                      removePaid(paid.id);
                    }}
                    disabled={isPending}
                  >
                    <Trash2 />
                  </Button>
                </TableHead>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <TableBody className="flex items-center justify-center w-full">
          <h1 className="text-gray-400 mt-5 text-center">No User Paid.</h1>
        </TableBody>
      )}
    </div>
  );
};

export default PaidTable;
