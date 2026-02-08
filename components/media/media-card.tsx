"use client";

import { Media } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Image from "next/image";
import { Copy, MoreHorizontal, Trash } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { deleteMedia, saveActivityLogsNotification } from "@/lib/queries";
import clsx from "clsx";

type Props = {
  file: Media;
};

const MediaCard = ({ file }: Props) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <AlertDialog>
      <DropdownMenu>
        <article
          className="
            group relative
            w-full rounded-2xl
            border border-neutral-200 dark:border-neutral-800
            bg-white dark:bg-[#101010]
            overflow-hidden
            transition-all
            hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.8)]
          "
        >
          {/* IMAGE */}
          <div className="relative w-full h-40 bg-neutral-100 dark:bg-neutral-900">
            <Image
              src={file.link}
              alt={file.name}
              fill
              className="
                object-cover
                transition-transform duration-300
                group-hover:scale-[1.03]
              "
            />

            {/* TOP ACTION */}
            <div
              className="
                absolute top-3 right-3
                opacity-0 group-hover:opacity-100
                transition-opacity
              "
            >
              <DropdownMenuTrigger asChild>
                <button
                  className="
                    h-9 w-9 rounded-full
                    bg-black/60 text-white
                    flex items-center justify-center
                    hover:bg-black
                  "
                >
                  <MoreHorizontal size={16} />
                </button>
              </DropdownMenuTrigger>
            </div>
          </div>

          {/* CONTENT */}
          <div className="p-4 space-y-1">
            <p className="text-xs text-neutral-500">
              {file.createdAt.toDateString()}
            </p>

            <p
              className="
                text-sm font-medium
                text-black dark:text-white
                truncate
              "
              title={file.name}
            >
              {file.name}
            </p>
          </div>

          {/* MENU */}
          <DropdownMenuContent
            align="end"
            className="
              bg-white dark:bg-[#101010]
              border border-neutral-200 dark:border-neutral-800
            "
          >
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="flex gap-2"
              onClick={() => {
                navigator.clipboard.writeText(file.link);
                toast({ title: "Copied link to clipboard" });
              }}
            >
              <Copy size={14} /> Copy Link
            </DropdownMenuItem>

            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="flex gap-2 text-red-600">
                <Trash size={14} /> Delete
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </article>
      </DropdownMenu>

      {/* DELETE CONFIRM */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-left">
            Delete Media File?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            This action cannot be undone. Any funnel or page using this file
            will lose access.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
            onClick={async () => {
              setLoading(true);
              const response = await deleteMedia(file.id);

              await saveActivityLogsNotification({
                agencyId: undefined,
                description: `Deleted media | ${file.name}`,
                subAccountId: response.subAccountId,
              });

              toast({
                title: "Media deleted",
                description: "The file has been removed successfully",
              });

              setLoading(false);
              router.refresh();
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MediaCard;
