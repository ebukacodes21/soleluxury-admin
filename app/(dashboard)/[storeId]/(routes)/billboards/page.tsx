import React from "react";
import BillboardClient from "./components/client";
import axios from "axios";
import apiConfig from "@/services/apiconfig";
import { redirect } from "next/navigation";
import { COOKIE_NAME, routes } from "@/constants";
import { cookies } from "next/headers";
import { BillboardColumn } from "./components/column";
import { format } from "date-fns";

const page = async ({ params }: { params: any }) => {
  const { storeId } = await params;
  const cookieStore = cookies();
  const userToken = (await cookieStore).get(COOKIE_NAME)?.value;

  if (!userToken) {
    redirect(routes.SIGNIN);
  }

  let billboards = null;
  try {
    const res = await axios({
      method: "GET",
      url: apiConfig.getBillboards,
      params: { store_id: storeId },
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    billboards = res.data;
  } catch (error: any) {
    if (error.code === "ECONNREFUSED") {
      billboards = { error: "Failed to connect to the server." };
    } else if (error.response) {
      billboards = { error: error.response.data };
    } else {
      billboards = { error: "Unknown error occurred." };
    }
  }

  const formattedBillboards: BillboardColumn[] = billboards?.billboards?.map(
    (item: any) => ({
      id: item.id,
      label: item.label,
      created_at: format(item.created_at, "MMM do, yyyy"),
    })
  );
  const data = formattedBillboards ? formattedBillboards : []

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={data} />
      </div>
    </div>
  );
};

export default page;
