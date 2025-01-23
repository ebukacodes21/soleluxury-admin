import { COOKIE_NAME, routes } from "@/constants";
import apiConfig from "@/services/apiconfig";
import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import SizeForm from "../components/size-form";

const page = async ({ params }: { params: any }) => {
  const { sizeId } = await params;
  const cookieStore = cookies();
  const userToken = (await cookieStore).get(COOKIE_NAME)?.value;

  if (!userToken) {
    redirect(routes.SIGNIN);
  }

  if (!sizeId || sizeId === typeof undefined) {
    console.error("size ID is missing!");
    return null;
  }

  let sizeData = null;
  try {
    const res = await axios({
      method: "GET",
      url: apiConfig.getSize,
      params: { id: sizeId },
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    sizeData = res.data;
  } catch (error: any) {
    if (error.code === "ECONNREFUSED") {
      sizeData = { error: "Failed to connect to the server." };
    } else if (error.response) {
      sizeData = { error: error.response.data };
    } else {
      sizeData = { error: "Unknown error occurred." };
    }
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm initialData={sizeData.size} />
      </div>
    </div>
  );
};

export default page;
