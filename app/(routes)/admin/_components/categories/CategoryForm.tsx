import React, { useState } from "react";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/lib/utils";
import { ClientUploadedFileData } from "uploadthing/types";
import { toast } from "sonner";
import { LucideLoader, X } from "lucide-react";
import { deleteUploadthingFiles } from "@/lib/server/uploadthing";
import { useCategories } from "@/hooks/use-categories";
import { usePathname } from "next/navigation";

export const CategorySchema = z.object({
  name: z.string(),
  url: z.string(),
  key: z.string(),
  link: z.string(),
});

interface Props {
  mode?: "create" | "edit";
  initialData?: any;
  setOpen: (open: boolean) => void;
}

const CategoryForm = ({ mode = "create", initialData, setOpen }: Props) => {
  const [uploadedImage, setUploadedImage] = useState<{
    url: string;
    key: string;
  } | null>(
    initialData ? { url: initialData.url, key: initialData.key } : null
  );
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const { createCategory, updateCategory, refetch } = useCategories();

  const form = useForm<z.infer<typeof CategorySchema>>({
    resolver: zodResolver(CategorySchema),
    defaultValues: initialData || {
      name: "",
      url: "",
      key: "",
      link: "",
    },
  });

  const isEdit = mode === "edit";
  
  const handleImageUpload = async (res: ClientUploadedFileData<any>[]) => {
    console.log("Files: ", res);
    const image = res[0];
    
    setUploadedImage({
      url: image.appUrl,
      key: image.key,
    });
    form.setValue("url", image.appUrl);
    form.setValue("key", image.key);
    
    toast.success("Upload Completed");
  };
  
  const handleImageDelete = async () => {
    setLoading(true);
    try {
      await deleteUploadthingFiles([uploadedImage?.key as string]);
      setUploadedImage(null);
      form.setValue("url", "");
      form.setValue("key", "");
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (body: z.infer<typeof CategorySchema>) => {
    setLoading(true);
    try {
      if (isEdit) {
        updateCategory(initialData.id, body);
      } else {
        createCategory(body);
      }
      toast.success("Category created successfully");
      refetch();
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Failed to create category");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col w-full gap-2">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <UploadDropzone
                    endpoint="imageUploader"
                    onClientUploadComplete={handleImageUpload}
                    onUploadError={(error: Error) => {
                      console.log("Error: ", error);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {uploadedImage && (
            <div className="relative w-32 object-cover rounded-md group">
              <img
                src={uploadedImage.url}
                alt={uploadedImage.url}
                className="rounded-md"
              />
              {!loading ? (
                <button
                  onClick={handleImageDelete}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                >
                  <X size={16} />
                </button>
              ) : (
                <div className="absolute top-1 right-1 bg-primary p-1 text-white rounded-full">
                  <LucideLoader size={16} className="animate-spin" />
                </div>
              )}
            </div>
          )}
        </div>
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="link"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Drive Link</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">{mode === "create" ? "Create" : "Edit"}</Button>
      </form>
    </Form>
  );
};

export default CategoryForm;
