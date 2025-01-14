import React from "react";
import ProductClient from "./components/client";
import axios from "axios";
import apiConfig from "@/services/apiconfig";
import { redirect } from "next/navigation";
import { COOKIE_NAME, routes } from "@/constants";
import { cookies } from "next/headers";
import { ProductColumn } from "./components/column";
import { format } from "date-fns";
import { formatter } from "@/utils/helper";

const page = async ({ params }: { params: { storeId: string } }) => {
  const { storeId } = await params;
  const cookieStore = cookies();
  const userToken = (await cookieStore).get(COOKIE_NAME)?.value;

  if (!userToken) {
    redirect(routes.SIGNIN);
  }

  let products = null;
  try {
    const res = await axios({
      method: "GET",
      url: apiConfig.getProducts,
      params: { store_id: storeId },
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    products = res.data;
  } catch (error: any) {
    if (error.code === "ECONNREFUSED") {
      products = { error: "Failed to connect to the server." };
    } else if (error.response) {
      products = { error: error.response.data };
    } else {
      products = { error: "Unknown error occurred." };
    }
  }

  const formattedProducts: ProductColumn[] = products?.productRes?.map(
    (item: any) => ({
      id: item.id,
      name: item.name,
      is_featured: item.is_featured ? item.is_featured : false,
      is_archived: item.is_archived ? item.is_archived : false,
      price: formatter.format(item.price),
      category: item.category.name,
      size: item.size.value,
      color: item.color.value,
      created_at: format(item.created_at, "MMM do, yyyy"),
    })
  );
  const data = formattedProducts ? formattedProducts : []

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={data} />
      </div>
    </div>
  );
};

export default page;
