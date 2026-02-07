"use client";
import React from "react";

import CustomModal from "@/components/global/custom-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useModal } from "@/providers/modal-provider";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Search } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterValue: string;
  actionButtonText?: React.ReactNode;
  modalChildren?: React.ReactNode;
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  filterValue,
  actionButtonText,
  modalChildren,
}: DataTableProps<TData, TValue>) {
  const { setOpen } = useModal();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="space-y-4">
      {/* TOP BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* SEARCH */}
        <div
          className="
            flex items-center gap-3
            rounded-xl border px-4 py-2
            bg-white dark:bg-[#101010]
            border-neutral-200 dark:border-neutral-800
          "
        >
          <Search className="w-4 h-4 text-neutral-500" />
          <Input
            placeholder="Search_Name..."
            value={
              (table.getColumn(filterValue)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table
                .getColumn(filterValue)
                ?.setFilterValue(event.target.value)
            }
            className="
              h-10 border-none bg-transparent p-0
              text-black dark:text-white
              focus-visible:ring-0 focus-visible:ring-offset-0
            "
          />
        </div>

        {/* ACTION */}
        {actionButtonText && (
          <Button
            className="
              flex items-center gap-2
              bg-black text-white
              dark:bg-white dark:text-black
              hover:opacity-90
            "
            onClick={() => {
              if (modalChildren) {
                setOpen(
                  <CustomModal
                    title="Add_Team_Member"
                    subheading="Send an invitation"
                  >
                    {modalChildren}
                  </CustomModal>
                );
              }
            }}
          >
            {actionButtonText}
          </Button>
        )}
      </div>

      {/* TABLE */}
      <div
        className="
          rounded-2xl border overflow-hidden
          bg-white dark:bg-[#101010]
          border-neutral-200 dark:border-neutral-800
        "
      >
        <Table>
          <TableHeader className="bg-neutral-50 dark:bg-neutral-900">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-xs font-semibold uppercase tracking-wide text-neutral-600 dark:text-neutral-400"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="
                    transition-colors
                    hover:bg-neutral-50 dark:hover:bg-neutral-900
                  "
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="text-sm text-neutral-800 dark:text-neutral-200"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-40 text-center text-neutral-500"
                >
                  No_Results_Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
