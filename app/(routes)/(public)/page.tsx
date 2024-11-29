"use client";

import React, { useState } from "react";
import { useFetchUser } from "@/hooks/use-user";
import { LucideLoader, X } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { useCategories } from "@/hooks/use-categories";
import { UploadDropzone } from "@/lib/utils";
import { ClientUploadedFileData } from "uploadthing/types";
import { toast } from "sonner";
import { deleteUploadthingFiles } from "@/lib/server/uploadthing";
import Link from "next/link";
import Header from "@/components/header";

const Page = () => {
  const [uploadedImage, setUploadedImage] = useState<{
    url: string;
    key: string;
  } | null>(null);

  const { user, loading } = useFetchUser();
  const { categories, isLoading } = useCategories();

  if (loading || !user || isLoading) {
    return (
      <div className="flex items-center justify-center mt-10">
        <LucideLoader className="animate-spin w-6 h-6" />
      </div>
    );
  }

  const handleImageUpload = async (res: ClientUploadedFileData<any>[]) => {
    console.log("Files: ", res);
    const image = res[0];

    setUploadedImage({
      url: image.appUrl,
      key: image.key,
    });

    toast.success("Upload Completed");
  };

  const handleImageDelete = async () => {
    try {
      await deleteUploadthingFiles([uploadedImage?.key as string]);
      setUploadedImage(null);
    } catch (error) {
      console.error("Error: ", error);
    } finally {
    }
  };

  return (
    <section className="flex flex-col justify-center items-center">
      <Header />

      <div className="mt-10 text-center">
        <h1 className="text-3xl font-bold text-center">
          Welcome to my website
        </h1>
        <p>
          For the pictures please pay to the QR Below and get the link to the
          drive !
        </p>
      </div>

      <div className="flex flex-col items-center mt-10">
        <h2>Pay here </h2>
        {categories.map((qr) => (
          <div key={qr.id} className="">
            <img src={qr.url} alt={qr.name} className="w-72 h-72" />
            <p className="text-center">{qr.name}</p>
          </div>
        ))}

        <UploadDropzone
          endpoint="imageUploader"
          onClientUploadComplete={handleImageUpload}
          onUploadError={(error: Error) => {
            console.log("Error: ", error);
          }}
        />
        {uploadedImage && (
          <Link href={categories[0].link} target="_blank" className="mt-5 bg-gray-400 hover:bg-gray-300 rounded-full px-5 py-2">
            Drive Link
          </Link>
        )}
      </div>
    </section>
  );
};

export default Page;
