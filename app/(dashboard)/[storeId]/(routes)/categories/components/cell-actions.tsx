"use client";

import React, { FC, useState } from "react";
import { CategoryColumn } from "./column";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal } from "lucide-react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { apiCall } from "@/utils/helper";
import AlertModal from "@/components/modals/alert-modal";

type CellActionsProps = {
  data: CategoryColumn;
};

export const CellActions: FC<CellActionsProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Category ID copied!");
  };

  const onDelete = async () => {
    setLoading(true);
    const result = await apiCall("/api/category/delete", "GET", {
      id: data?.id,
    });

    if (result.name === "AxiosError") {
      setLoading(false);
      toast.error(
        "remove all products and categories using this category first"
      );
      return;
    }

    toast.success(result.message);
    router.refresh();
    setLoading(false);
    setOpen(false);
  };

  return (
    <div>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} className="h-8 w-8 p-0">
            <span className="sr-only">Open Menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Edit className="mr-2 h-4 w-4" />
            Copy Id
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() =>
              router.push(`/${params.storeId}/categories/${data.id}`)
            }
          >
            <Edit className="mr-2 h-4 w-4" />
            Update
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
