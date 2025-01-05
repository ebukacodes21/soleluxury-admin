"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellActions } from "./cell-actions";

export type ProductColumn = {
  id: number;
  name: string;
  price: number;
  size: string;
  category: string;
  color: string;
  is_featured: boolean;
  is_archived: boolean;
  created_at: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "is_archived",
    header: "Archived"
  },
  {
    accessorKey: "is_featured",
    header: "Featured"
  },
  {
    accessorKey: "price",
    header: "Price"
  },
  {
    accessorKey: "category",
    header: "Category"
  },
  {
    accessorKey: "size",
    header: "Size"
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.color}
        <div className="h-6 w-6 rounded-full border" style={{ backgroundColor: row.original.color }}/>
      </div>
    )
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
