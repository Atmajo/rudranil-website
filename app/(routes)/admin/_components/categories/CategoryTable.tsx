"use client";

import React, { useState, useEffect } from "react";
import { useCategories } from "@/hooks/use-categories";
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
import { deleteUploadthingFiles } from "@/lib/server/uploadthing";

interface Props {
  setOpen: (open: boolean) => void;
  setMode: (mode: "create" | "edit") => void;
  setInitialData: (data: any) => void;
}

const CategoryTable = ({ setOpen, setMode, setInitialData }: Props) => {
  const pathname = usePathname();
  const {
    categories,
    deleteCategory,
    isLoading,
    isUpdating,
    isDeleting,
    refetch,
  } = useCategories();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategories, setFilteredCategories] = useState(categories);

  useEffect(() => {
    setFilteredCategories(
      categories.filter((category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, categories]);

  if (isLoading || isUpdating || isDeleting) {
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
              <TableHead>Link</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.map((category) => (
              <TableRow key={category.id}>
                <TableHead>{category.id}</TableHead>
                <TableHead>{category.name}</TableHead>
                <TableHead>{category.link}</TableHead>
                <TableHead className="flex items-center gap-2">
                  <Button
                    size={"icon"}
                    onClick={() => {
                      setMode("edit");
                      setInitialData(category);
                      setOpen(true);
                    }}
                  >
                    <Pen />
                  </Button>
                  <Button
                    variant={"destructive"}
                    size={"icon"}
                    onClick={async () => {
                      deleteCategory(category.id);
                      await deleteUploadthingFiles([category.key as string]);
                    }}
                    disabled={isDeleting}
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
          <h1 className="text-gray-400 mt-5 text-center">
            No categories found.
          </h1>
        </TableBody>
      )}
    </div>
  );
};

export default CategoryTable;
