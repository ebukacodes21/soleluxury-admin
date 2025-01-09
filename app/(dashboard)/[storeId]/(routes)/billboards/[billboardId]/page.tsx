import { COOKIE_NAME, routes } from "@/constants";
import apiConfig from "@/services/apiconfig";
import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import BillboardForm from "../components/billboard-form";

const page = async ({ params }: { params: { billboardId: string } }) => {
  const { billboardId } = await params;
  const cookieStore = cookies();
  const userToken = (await cookieStore).get(COOKIE_NAME)?.value;

  if (!userToken) {
    redirect(routes.SIGNIN);
  }

  if (!billboardId || billboardId === typeof undefined) {
    console.error("billboard ID is missing!");
    return null;
  }

  let billboardData = null;
  try {
    const res = await axios({
      method: "GET",
      url: apiConfig.getBillboard,
      params: { id: billboardId },
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    billboardData = res.data;
  } catch (error: any) {
    if (error.code === "ECONNREFUSED") {
      billboardData = { error: "Failed to connect to the server." };
    } else if (error.response) {
      billboardData = { error: error.response.data };
    } else {
      billboardData = { error: "Unknown error occurred." };
    }
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={billboardData.billboard} />
      </div>
    </div>
  );
};

export default page;
