import React from "react";
import SizeClient from "./components/client";
import axios from "axios";
import apiConfig from "@/services/apiconfig";
import { redirect } from "next/navigation";
import { COOKIE_NAME, routes } from "@/constants";
import { cookies } from "next/headers";
import { SizeColumn } from "./components/column";
import { format } from "date-fns";

const page = async ({ params }: { params: { storeId: string } }) => {
  const { storeId } = await params;
  const cookieStore = cookies();
  const userToken = (await cookieStore).get(COOKIE_NAME)?.value;

  if (!userToken) {
    redirect(routes.SIGNIN);
  }

  let sizes = null;
  try {
    const res = await axios({
      method: "GET",
      url: apiConfig.getSizes,
      params: { store_id: storeId },
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    sizes = res.data;
  } catch (error: any) {
    if (error.code === "ECONNREFUSED") {
      sizes = { error: "Failed to connect to the server." };
    } else if (error.response) {
      sizes = { error: error.response.data };
    } else {
      sizes = { error: "Unknown error occurred." };
    }
  }

  const formattedSizes: SizeColumn[] = sizes?.sizes?.map(
    (item: any) => ({
      id: item.id,
      name: item.name,
      value: item.value,
      created_at: format(item.created_at, "MMM do, yyyy"),
    })
  );
  const data = formattedSizes ? formattedSizes : []

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeClient data={data} />
      </div>
    </div>
  );
};

export default page;
