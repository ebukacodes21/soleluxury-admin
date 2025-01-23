import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import React from "react";
import NairaSign from "@/components/ui/naira";
import { formatter } from "@/utils/helper";
import { CreditCard, Package } from "lucide-react";
import axios from "axios";
import apiConfig from "@/services/apiconfig";
import { cookies } from "next/headers";
import { COOKIE_NAME, GraphData, routes } from "@/constants";
import { redirect } from "next/navigation";
import Overview from "@/components/ui/overview";

const page = async ({ params }: { params: any }) => {
  const { storeId } = await params;
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

  let products = null;
  try {
    const res = await axios({
      method: "GET",
      url: apiConfig.getProducts,
      params: { store_id: storeId },
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    products = res.data;
  } catch (error: any) {
    if (error.code === "ECONNREFUSED") {
      products = { error: "Failed to connect to the server." };
    } else if (error.response) {
      products = { error: error.response.data };
    } else {
      products = { error: "Unknown error occurred." };
    }
  }

  // Calculate the total revenue and items sold
  const { totalRevenue, totalItemsSold } = orders.orders.reduce(
    (accum: any, order: any) => {
      if (order.is_paid) {
        order.items.forEach((item: any) => {
          if (item.store_id === storeId) {
            accum.totalRevenue += item.price;
            accum.totalItemsSold += 1;
          }
        });
      }
      return accum;
    },
    { totalRevenue: 0, totalItemsSold: 0 }
  );

  // Initialize the graph data with 0 for each month
  const graphData: GraphData = [
    { name: "Jan", total: 0 },
    { name: "Feb", total: 0 },
    { name: "Mar", total: 0 },
    { name: "Apr", total: 0 },
    { name: "May", total: 0 },
    { name: "Jun", total: 0 },
    { name: "Jul", total: 0 },
    { name: "Aug", total: 0 },
    { name: "Sep", total: 0 },
    { name: "Oct", total: 0 },
    { name: "Nov", total: 0 },
    { name: "Dec", total: 0 },
  ];

  // Process the orders and accumulate total revenue per month
  orders.orders.forEach((order: any) => {
    if (order.is_paid) {
      const month = new Date(order.created_at).getMonth(); // Get the month (0-11)
      order.items.forEach((item: any) => {
        if (item.store_id === storeId) {
          graphData[month].total += item.price; // Accumulate total revenue for the month
        }
      });
    }
  });

  // Count total products in stock
  const totalProducts = products.productRes.filter(
    (prod: any) => prod.is_featured === true
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading title="Dashboard" description="Overview of your store" />
        <Separator />

        <div className="grid gap-4 grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <NairaSign />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">
                {formatter.format(totalRevenue)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sales</CardTitle>
              <CreditCard className="text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">+{totalItemsSold}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products in stock</CardTitle>
              <Package className="text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">{totalProducts.length}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={graphData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default page;
