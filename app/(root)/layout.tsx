import { COOKIE_NAME, routes } from "@/constants";
import apiConfig from "@/services/apiconfig";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import axios from "axios";

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const userToken = (await cookieStore).get(COOKIE_NAME)?.value;
  if (!userToken) {
    redirect(routes.SIGNIN);
  }

  let storeData = null;

  try {
    const res = await axios({
      method: "GET",
      url: apiConfig.getFirstStore,
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    storeData = res.data;
  } catch (error: any) {
    if (error.code === "ECONNREFUSED") {
      storeData = { error: "Failed to connect to the server." };
    } else if (error.response) {
      storeData = { error: error.response.data };
    } else {
      storeData = { error: "Unknown error occurred." };
    }
  }

  if (storeData && !storeData.error) {
    redirect(`${storeData?.store?.store_id}`);
  }

  return (
    <div>
      {children}
    </div>
  );
}
