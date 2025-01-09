import React from "react";
import CategoryClient from "./components/client";
import axios from "axios";
import apiConfig from "@/services/apiconfig";
import { redirect } from "next/navigation";
import { COOKIE_NAME, routes } from "@/constants";
import { cookies } from "next/headers";
import { CategoryColumn } from "./components/column";
import { format } from "date-fns";

const page = async ({ params }: { params: { storeId: string } }) => {
  const { storeId } = await params;
  const cookieStore = cookies();
  const userToken = (await cookieStore).get(COOKIE_NAME)?.value;

  if (!userToken) {
    redirect(routes.SIGNIN);
  }

  let categories = null;
  try {
    const res = await axios({
      method: "GET",
      url: apiConfig.getCategories,
      params: { store_id: storeId },
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    categories = res.data;
  } catch (error: any) {
    if (error.code === "ECONNREFUSED") {
      categories = { error: "Failed to connect to the server." };
    } else if (error.response) {
      categories = { error: error.response.data };
    } else {
      categories = { error: "Unknown error occurred." };
    }
  }

  const formattedcategories: CategoryColumn[] = categories?.categories?.map(
    (item: any) => ({
      id: item.id,
      name: item.name,
      billboard_id: item.billboard.id,
      billboard_label: item.billboard.label,
      created_at: format(item.created_at, "MMM do, yyyy"),
    })
  );

  const data = formattedcategories ? formattedcategories : []

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={data} />
      </div>
    </div>
  );
};

export default page;
