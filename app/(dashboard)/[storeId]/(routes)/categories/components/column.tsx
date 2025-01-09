"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellActions } from "./cell-actions";

export type CategoryColumn = {
  id: string;
  name: string;
  billboard_id: string;
  billboard_label: string;
  created_at: string;
};

export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "billboard",
    header: "Billboard",
    cell: ({ row }) => row.original.billboard_label
  },
  {
    accessorKey: "created_at",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellActions data={row.original} />,
  },
];
