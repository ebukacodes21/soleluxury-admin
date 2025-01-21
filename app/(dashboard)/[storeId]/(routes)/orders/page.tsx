import React from "react";
import OrderClient from "./components/client";
import axios from "axios";
import apiConfig from "@/services/apiconfig";
import { redirect } from "next/navigation";
import { COOKIE_NAME, routes } from "@/constants";
import { cookies } from "next/headers";
import { OrderColumn } from "./components/column";
import { format } from "date-fns";
import { formatter } from "@/utils/helper";

const page = async () => {
  const cookieStore = cookies();
  const userToken = (await cookieStore).get(COOKIE_NAME)?.value;

  if (!userToken) {
    redirect(routes.SIGNIN);
  }

  let orders = null;
  try {
    const res = await axios({
      method: "GET",
      url: apiConfig.getOrders,
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    orders = res.data;
  } catch (error: any) {
    if (error.code === "ECONNREFUSED") {
      orders = { error: "Failed to connect to the server." };
    } else if (error.response) {
      orders = { error: error.response.data };
    } else {
      orders = { error: "Unknown error occurred." };
    }
  }

  const formattedorders: OrderColumn[] = orders?.orders?.map(
    (item: any) => ({
      id: item.id,
      phone: item.phone,
      address: item.address,
      products: item.items.map((prod: any) => prod.name),
      totalPrice: formatter.format(item.items.reduce((total: number, prod: any) => total + prod.price, 0)),
      isPaid: item.is_paid ? item.is_paid : false,
      createdAt: format(item.created_at, "MMM do, yyyy"),
    })
  );
  const data = formattedorders ? formattedorders : []

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={data} />
      </div>
    </div>
  );
};

export default page;
