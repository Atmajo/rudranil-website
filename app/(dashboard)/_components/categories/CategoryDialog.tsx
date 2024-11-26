import React from "react";
import { Dialog, DialogTitle, DialogContent } from "@/components/ui/dialog";
import CategoryForm, { CategorySchema } from "./CategoryForm";
import { z } from "zod";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  mode?: "create" | "edit";
  initialData?: z.infer<typeof CategorySchema>;
}

const CategoryDialog = ({
  open,
  setOpen,
  mode = "create",
  initialData,
}: Props) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>
          {mode === "create" ? "Create" : "Update"} Category
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "create" ? "Add" : "Edit"} category for your products
          </p>
        </DialogTitle>
        <div>
          <CategoryForm
            mode={mode}
            setOpen={setOpen}
            initialData={initialData}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDialog;
