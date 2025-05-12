import React, { useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

interface DragDropProps {
  form: UseFormReturn<any>;
}

export default function DragDrop({ form }: DragDropProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const imageUrls = form.watch("image_urls") || [];

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const validFiles = Array.from(files).filter((file) => {
      return (
        file.size <= 5 * 1024 * 1024 &&
        /image\/(jpeg|png|jpg)/.test(file.type)
      );
    });

    if (imageUrls.length + validFiles.length > 3) {
      toast.error("You can only upload up to 3 images.");
      return;
    }

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        form.setValue("image_urls", [...form.getValues("image_urls") || [], reader.result as string]);
      };
      reader.readAsDataURL(file);
      console.log("THIS IS FILE: ", reader.result);
    });

    if (validFiles.length < files.length) {
      toast.error("Some files were invalid. Only JPG, JPEG, PNG under 5MB are allowed.");
    }
  };

  return (
    <div>
      <div
        className="border border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer"
        onClick={() => inputRef.current?.click()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        onDragOver={(e) => e.preventDefault()}
      >
        Drag and drop up to 3 images here, or click to select
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg, image/png, image/jpg"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {imageUrls.length > 0 && (
        <div className="mt-2 grid grid-cols-3 gap-2">
          {imageUrls.map((url: string, index: number) => (
            <img
              key={index}
              src={url}
              alt={`Uploaded ${index + 1}`}
              className="max-h-32 mx-auto object-contain"
            />
          ))}
        </div>
      )}
    </div>
  );
}
