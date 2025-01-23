import React from "react";
import ColorClient from "./components/client";
import axios from "axios";
import apiConfig from "@/services/apiconfig";
import { redirect } from "next/navigation";
import { COOKIE_NAME, routes } from "@/constants";
import { cookies } from "next/headers";
import { ColorColumn } from "./components/column";
import { format } from "date-fns";

const page = async ({ params }: { params: any }) => {
  const { storeId } = await params;
  const cookieStore = cookies();
  const userToken = (await cookieStore).get(COOKIE_NAME)?.value;

  if (!userToken) {
    redirect(routes.SIGNIN);
  }

  let colors = null;
  try {
    const res = await axios({
      method: "GET",
      url: apiConfig.getColors,
      params: { store_id: storeId },
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    colors = res.data;
  } catch (error: any) {
    if (error.code === "ECONNREFUSED") {
      colors = { error: "Failed to connect to the server." };
    } else if (error.response) {
      colors = { error: error.response.data };
    } else {
      colors = { error: "Unknown error occurred." };
    }
  }

  const formattedColors: ColorColumn[] = colors?.colors?.map(
    (item: any) => ({
      id: item.id,
      name: item.name,
      value: item.value,
      created_at: format(item.created_at, "MMM do, yyyy"),
    })
  );
  const data = formattedColors ? formattedColors : []

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorClient data={data} />
      </div>
    </div>
  );
};

export default page;
