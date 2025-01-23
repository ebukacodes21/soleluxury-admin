import { COOKIE_NAME, routes } from "@/constants";
import apiConfig from "@/services/apiconfig";
import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import CategoryForm from "../components/category-form";

const page = async ({ params }: { params: any }) => {
  const { categoryId, storeId } = await params;
  const cookieStore = cookies();
  const userToken = (await cookieStore).get(COOKIE_NAME)?.value;

  if (!userToken) {
    redirect(routes.SIGNIN);
  }

  if (!categoryId || categoryId === typeof undefined) {
    console.error("category ID is missing!");
    return null;
  }

  let categoryData = null;
  try {
    const res = await axios({
      method: "GET",
      url: apiConfig.getCategory,
      params: { id: categoryId },
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    categoryData = res.data;
  } catch (error: any) {
    if (error.code === "ECONNREFUSED") {
      categoryData = { error: "Failed to connect to the server." };
    } else if (error.response) {
      categoryData = { error: error.response.data };
    } else {
      categoryData = { error: "Unknown error occurred." };
    }
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

  const billboardData = Object.keys(billboards).length === 0 ? [] : billboards.billboards;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm billboards={billboardData} initialData={categoryData.category!} />
      </div>
    </div>
  );
};

export default page;
