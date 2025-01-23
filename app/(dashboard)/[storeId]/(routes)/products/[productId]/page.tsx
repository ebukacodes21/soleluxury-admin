import { COOKIE_NAME, routes } from "@/constants";
import apiConfig from "@/services/apiconfig";
import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import ProductForm from "../components/product-form";

const page = async ({
  params,
}: {
  params: any;
}) => {
  const { storeId, productId } = await params;
  const cookieStore = cookies();
  const userToken = (await cookieStore).get(COOKIE_NAME)?.value;

  if (!userToken) {
    redirect(routes.SIGNIN);
  }

  if (!productId || productId === typeof undefined) {
    console.error("product ID is missing!");
    return null;
  }

  let productData = null;
  try {
    const res = await axios({
      method: "GET",
      url: apiConfig.getProduct,
      params: { product_id: productId },
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    productData = res.data;
  } catch (error: any) {
    if (error.code === "ECONNREFUSED") {
      productData = { error: "Failed to connect to the server." };
    } else if (error.response) {
      productData = { error: error.response.data };
    } else {
      productData = { error: "Unknown error occurred." };
    }
  }

  let categoryData = null;
  try {
    const res = await axios({
      method: "GET",
      url: apiConfig.getCategories,
      params: { store_id: storeId },
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

  let sizeData = null;
  try {
    const res = await axios({
      method: "GET",
      url: apiConfig.getSizes,
      params: { store_id: storeId },
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

  let colorData = null;
  try {
    const res = await axios({
      method: "GET",
      url: apiConfig.getColors,
      params: { store_id: storeId },
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
        <ProductForm
          initialData={productData.productRes}
          categories={categoryData.categories}
          colors={colorData.colors}
          sizes={sizeData.sizes}
        />
      </div>
    </div>
  );
};

export default page;
