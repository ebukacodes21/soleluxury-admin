"use client";
import React, { FC } from "react";
import Heading from "@/components/ui/heading";
import { OrderColumn, columns } from "./column";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";

type OrderClientProp = {
  data: OrderColumn[];
};

const OrderClient: FC<OrderClientProp> = ({ data }) => {
  return (
    <>
      <Heading
        title={`Orders (${data?.length})`}
        description="Manage all orders"
      />
      <Separator />
      <DataTable columns={columns} data={data} searchKey="products" />
    </>
  );
};

export default OrderClient;
