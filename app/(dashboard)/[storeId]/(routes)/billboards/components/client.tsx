"use client";
import React, { FC } from "react";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

type BillboardClientProp = {
  data: {
    image_url: string;
    label: string;
    id: number;
    store_id: number;
  }[]
}

const BillboardClient:FC<BillboardClientProp> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Billboards (${data.length})`}
          description="Manage billboards for your store"
        />

        <Button
          onClick={() => router.push(`/${params.storeId}/billboards/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
    </>
  );
};

export default BillboardClient;
