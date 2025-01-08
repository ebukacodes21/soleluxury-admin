import Navbar from "@/components/navbar";
import { COOKIE_NAME, routes } from "@/constants";
import apiConfig from "@/services/apiconfig";
import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) {
  const { storeId } = await params; 
  const cookieStore = cookies();
  const userToken = (await cookieStore).get(COOKIE_NAME)?.value;

  if (!userToken) {
    redirect(routes.SIGNIN);
  }

  if (!storeId || storeId === typeof undefined) {
    console.error("Store ID is missing!");
    return null; 
  }

  let storeData = null;

  try {
    const res = await axios({
      method: "GET",
      url: apiConfig.getStore,
      params: { id: storeId },
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

  if (!storeData || storeData.error){
    redirect(routes.HOME)
  }

  return (
    <>
    <Navbar />
    {children}
    </>
  );
}
