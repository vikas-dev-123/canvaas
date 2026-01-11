import { FileIcon, X } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import { UploadDropzone } from "@/lib/uploadthing";

type Props = {
  apiEndpoint: "agencyLogo" | "avatar" | "subaccountLogo";
  onChange: (url?: string) => void;
  value?: string;
  id?: string;
};

const FileUpload = ({ apiEndpoint, onChange, value, id }: Props) => {
  const type = value?.split(".").pop();

  if (value) {
    return (
      <div className="flex flex-col items-center justify-center">
        {/* Hidden input to satisfy label htmlFor association for accessibility/linting */}
        {id && <input type="hidden" id={id} value={value ?? ""} />}
        {type !== "pdf" ? (
          <div className="relative w-40 h-40">
            <Image
              src={value}
              alt="uploaded-image"
              fill
              className="object-contain"
            />
          </div>
        ) : (
          <div className="flex items-center gap-2 mt-2 p-2 rounded-md bg-muted">
            <FileIcon />
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-indigo-500 hover:underline"
            >
              View PDF
            </a>
          </div>
        )}

        <Button
          type="button"
          variant="ghost"
          onClick={() => onChange(undefined)}
        >
          <X className="h-4 w-4 mr-1" />
          Remove Logo
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full bg-muted/30">
      {/* Hidden input to satisfy label htmlFor association for accessibility/linting */}
      {id && <input type="hidden" id={id} value={value || ""} />}
      <UploadDropzone   
        endpoint={apiEndpoint}
        onClientUploadComplete={(res) => {
          onChange(res?.[0]?.url);
        }}
        onUploadError={(error) => {
          console.error(error.message);
        }}
      />
    </div>
  );
};

export default FileUpload;
