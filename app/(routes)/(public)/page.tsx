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
      <header className="px-10 py-3 w-full">
        <nav className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Rudranil's Website</h1>
          <UserButton />
        </nav>
      </header>

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
          <div className="relative w-32 object-cover rounded-md group py-10">
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
    </section>
  );
};

export default Page;
