import { FileIcon, X } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { UploadDropzone } from "@/lib/uploadthing";

type Props = {
  apiEndpoint: "agencyLogo" | "avatar" | "subaccountLogo";
  onChange: (url?: string) => void;
  value?: string;
};

const FileUpload = ({ apiEndpoint, onChange, value }: Props) => {
  const type = value?.split(".").pop();

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
      className="
        w-full
        rounded-2xl
        border border-dashed
        border-neutral-300 dark:border-neutral-700
        bg-neutral-50 dark:bg-neutral-900/40
        p-4
      "
    >
      <UploadDropzone
        endpoint={apiEndpoint}
        onClientUploadComplete={(res) => {
          onChange(res?.[0].url);
        }}
        onUploadError={(error) => {
          console.log(error);
        }}
        className="
          ut-button:bg-black ut-button:text-white
          dark:ut-button:bg-white dark:ut-button:text-black
          ut-label:text-neutral-600 dark:ut-label:text-neutral-400
          ut-upload-icon:text-neutral-500
        "
      />
    </div>
  );
};

export default FileUpload;
