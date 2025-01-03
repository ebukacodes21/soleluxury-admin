import { COOKIE_NAME, routes } from "@/constants";
import apiConfig from "@/services/apiconfig";
import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import ColorForm from "../components/color-form";

const page = async ({ params }: { params: { colorId: string } }) => {
  const { colorId } = await params;
  const cookieStore = cookies();
  const userToken = (await cookieStore).get(COOKIE_NAME)?.value;

  if (!userToken) {
    redirect(routes.SIGNIN);
  }

  if (!colorId || colorId === typeof undefined) {
    console.error("size ID is missing!");
    return null;
  }

  let colorData = null;
  try {
    const res = await axios({
      method: "GET",
      url: apiConfig.getColor,
      params: { id: Number(colorId) },
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    colorData = res.data;
  } catch (error: any) {
    if (error.code === "ECONNREFUSED") {
      colorData = { error: "Failed to connect to the server." };
    } else if (error.response) {
      colorData = { error: error.response.data };
    } else {
      colorData = { error: "Unknown error occurred." };
    }
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorForm initialData={colorData.color} />
      </div>
    </div>
  );
};

export default page;
