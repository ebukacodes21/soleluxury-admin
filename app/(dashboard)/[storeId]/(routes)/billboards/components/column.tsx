"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellActions } from "./cell-actions";

export type BillboardColumn = {
  id: string;
  label: string;
  created_at: string;
};

export const columns: ColumnDef<BillboardColumn>[] = [
  {
    accessorKey: "label",
    header: "Label",
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
