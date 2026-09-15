"use client";

import { FileIcon, Loader2, UploadCloud, X } from "lucide-react";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { Button } from "../ui/button";
import { uploadToCloudinary, type UploadEndpoint } from "@/lib/cloudinary-upload";

type Props = {
  apiEndpoint: UploadEndpoint;
  onChange: (url?: string) => void;
  value?: string;
};

const FileUpload = ({ apiEndpoint, onChange, value }: Props) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const type = value?.split(".").pop();

  const handleFile = async (file?: File) => {
    if (!file) return;
    setError("");
    setUploading(true);
    setProgress(0);

    try {
      const result = await uploadToCloudinary(file, apiEndpoint, setProgress);
      onChange(result.secure_url);
    } catch (err) {
      console.log(err);
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (value) {
    return (
      <div
        className="
          flex flex-col items-center gap-4
          rounded-2xl p-4
          border border-neutral-200 dark:border-neutral-800
          bg-white dark:bg-[#101010]
        "
      >
        {type !== "pdf" ? (
          <div className="relative w-40 h-40 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-900">
            <Image
              src={value}
              alt="uploaded-image"
              fill
              className="object-contain p-3"
            />
          </div>
        ) : (
          <div
            className="
              flex items-center gap-3
              rounded-xl p-3
              bg-neutral-100 dark:bg-neutral-900
              border border-neutral-200 dark:border-neutral-800
            "
          >
            <FileIcon className="h-5 w-5 text-neutral-500" />
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="
                text-sm font-medium
                text-black dark:text-white
                hover:underline
              "
            >
              View_PDF
            </a>
          </div>
        )}

        <Button
          type="button"
          onClick={() => onChange("")}
          className="
            h-9 px-4
            rounded-lg
            bg-neutral-100 text-black
            dark:bg-neutral-900 dark:text-white
            border border-neutral-200 dark:border-neutral-800
            hover:bg-neutral-200 dark:hover:bg-neutral-800
          "
        >
          <X className="h-4 w-4 mr-2" />
          Remove_File
        </Button>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragActive(false);
        handleFile(e.dataTransfer.files?.[0]);
      }}
      onClick={() => inputRef.current?.click()}
      className={`
        w-full cursor-pointer
        rounded-2xl
        border border-dashed
        ${dragActive ? "border-black dark:border-white" : "border-neutral-300 dark:border-neutral-700"}
        bg-neutral-50 dark:bg-neutral-900/40
        p-8
        flex flex-col items-center justify-center gap-3
        text-center
        transition-colors
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {uploading ? (
        <>
          <Loader2 className="h-8 w-8 animate-spin text-neutral-500" />
          <p className="text-sm text-neutral-500">Uploading... {progress}%</p>
        </>
      ) : (
        <>
          <UploadCloud className="h-8 w-8 text-neutral-500" />
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-neutral-400">Images or PDF, up to 10MB</p>
        </>
      )}

      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
};

export default FileUpload;
