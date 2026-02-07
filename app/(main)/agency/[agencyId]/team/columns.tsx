"use client";
import UserDetails from "@/components/forms/user-details";
import CustomModal from "@/components/global/custom-modal";
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
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { deleteUser, getUser } from "@/lib/queries";
import { UsersWithAgencySubAccountPermissionsSidebarOptions } from "@/lib/types";
import { useModal } from "@/providers/modal-provider";
import { Role } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export const columns: ColumnDef<UsersWithAgencySubAccountPermissionsSidebarOptions>[] =
  [
    {
      accessorKey: "id",
      header: "",
      cell: () => null,
    },

    /* NAME + AVATAR */
    {
      accessorKey: "name",
      header: "User",
      cell: ({ row }) => {
        const avatarUrl = row.getValue("avatarUrl") as string;
        return (
          <div className="flex items-center gap-4">
            <div className="relative h-10 w-10 rounded-full overflow-hidden border border-neutral-800">
              <Image
                src={avatarUrl}
                fill
                className="object-cover"
                alt="avatar"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-black dark:text-white">
                {row.getValue("name")}
              </span>
              <span className="text-xs text-neutral-500">
                {row.getValue("email")}
              </span>
            </div>
          </div>
        );
      },
    },

    { accessorKey: "avatarUrl", header: "", cell: () => null },
    { accessorKey: "email", header: "Email" },

    /* OWNED ACCOUNTS */
    {
      accessorKey: "SubAccount",
      header: "Access",
      cell: ({ row }) => {
        const isOwner = row.getValue("role") === "AGENCY_OWNER";
        const owned = row.original?.Permissions.filter((p) => p.access);

        if (isOwner) {
          return (
            <Badge className="bg-black text-white dark:bg-white dark:text-black">
              Agency Owner
            </Badge>
          );
        }

        return (
          <div className="flex flex-wrap gap-2">
            {owned?.length ? (
              owned.map((acc) => (
                <Badge
                  key={acc.id}
                  className="bg-neutral-800 text-neutral-200"
                >
                  {acc.SubAccount.name}
                </Badge>
              ))
            ) : (
              <span className="text-xs text-neutral-500">No Access</span>
            )}
          </div>
        );
      },
    },

    /* ROLE */
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role: Role = row.getValue("role");

        return (
          <Badge
            className={clsx(
              "rounded-md px-2 py-1 text-xs font-semibold",
              {
                "bg-emerald-500 text-black": role === "AGENCY_OWNER",
                "bg-orange-400 text-black": role === "AGENCY_ADMIN",
                "bg-blue-500 text-white": role === "SUBACCOUNT_USER",
                "bg-neutral-700 text-neutral-200":
                  role === "SUBACCOUNT_GUEST",
              }
            )}
          >
            {role}
          </Badge>
        );
      },
    },

    /* ACTIONS */
    {
      id: "actions",
      cell: ({ row }) => <CellActions rowData={row.original} />,
    },
  ];

interface CellActionsProps {
  rowData: UsersWithAgencySubAccountPermissionsSidebarOptions;
}

const CellActions: React.FC<CellActionsProps> = ({ rowData }) => {
  const { setOpen } = useModal();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!rowData || !rowData.Agency) return null;

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 hover:bg-neutral-200 dark:hover:bg-neutral-800"
          >
            <MoreHorizontal className="h-4 w-4 text-neutral-500" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="bg-white dark:bg-[#101010] border-neutral-200 dark:border-neutral-800"
        >
          <DropdownMenuLabel className="text-neutral-500">
            User Actions
          </DropdownMenuLabel>

          <DropdownMenuItem
            className="flex gap-2"
            onClick={() =>
              navigator.clipboard.writeText(rowData.email)
            }
          >
            <Copy size={14} /> Copy Email
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="flex gap-2"
            onClick={() =>
              setOpen(
                <CustomModal
                  title="Edit_User"
                  subheading="Manage role & permissions"
                >
                  <UserDetails
                    type="agency"
                    id={rowData.Agency?.id || null}
                    subAccounts={rowData.Agency.SubAccount}
                  />
                </CustomModal>,
                async () => ({ user: await getUser(rowData.id) })
              )
            }
          >
            <Edit size={14} /> Edit Details
          </DropdownMenuItem>

          {rowData.role !== "AGENCY_OWNER" && (
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="flex gap-2 text-red-500">
                <Trash size={14} /> Remove User
              </DropdownMenuItem>
            </AlertDialogTrigger>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialogContent className="bg-white dark:bg-[#101010] border-neutral-800">
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove the user and revoke all access.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
            onClick={async () => {
              setLoading(true);
              await deleteUser(rowData.id);
              toast({
                title: "User Removed",
                description: "Access revoked successfully",
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
