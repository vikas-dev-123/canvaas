import { GetMediaFiles } from "@/lib/types";
import React from "react";
import UploadButton from "./upload-button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import MediaCard from "./media-card";
import { FolderSearch, Search } from "lucide-react";

type Props = {
  data: GetMediaFiles;
  subaccountId: string;
};

const MediaComponent = ({ data, subaccountId }: Props) => {
  return (
    <div className="flex flex-col gap-6 h-full w-full">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-black dark:text-white">
            Media_Bucket
          </h1>
          <p className="text-sm text-neutral-500">
            Manage & reuse your uploaded assets
          </p>
        </div>

        <UploadButton subaccountId={subaccountId} />
      </div>

      {/* SEARCH + GRID */}
      <Command
        className="
          bg-transparent
          border border-neutral-200 dark:border-neutral-800
          rounded-2xl
          overflow-hidden
        "
      >
        {/* SEARCH BAR */}
        <div
          className="
            flex items-center gap-2 px-4 py-3
            border-b border-neutral-200 dark:border-neutral-800
            bg-neutral-50 dark:bg-neutral-900
          "
        >
          <Search className="h-4 w-4 text-neutral-400" />
          <CommandInput
            placeholder="Search media files..."
            className="h-10"
          />
        </div>

        <CommandList className="p-4">
          <CommandEmpty className="py-12">
            <div className="flex flex-col items-center gap-4">
              <FolderSearch
                size={120}
                className="text-neutral-300 dark:text-neutral-700"
              />
              <p className="text-sm text-neutral-500">
                No media files found
              </p>
            </div>
          </CommandEmpty>

          {/* MEDIA GRID */}
          {data?.Media?.length ? (
            <div
              className="
                grid gap-4
                grid-cols-1
                sm:grid-cols-2
                md:grid-cols-3
                lg:grid-cols-4
              "
            >
              {data.Media.map((file) => (
                <CommandItem
                  key={file.id}
                  className="
                    p-0
                    bg-transparent
                    focus:bg-transparent
                    cursor-default
                  "
                >
                  <MediaCard file={file} />
                </CommandItem>
              ))}
            </div>
          ) : null}
        </CommandList>
      </Command>
    </div>
  );
};

export default MediaComponent;
