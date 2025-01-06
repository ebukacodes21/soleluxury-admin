import React from "react";
import MainNav from "./main-nav";
import Switcher from "./switcher";
import { cookies } from "next/headers";
import { COOKIE_NAME, routes } from "@/constants";
import { redirect } from "next/navigation";
import axios from "axios";
import apiConfig from "@/services/apiconfig";

const Navbar = async () => {
  const cookieStore = cookies();
  const userToken = (await cookieStore).get(COOKIE_NAME)?.value;
  if (!userToken) {
    redirect(routes.SIGNIN);
  }

  let storeData = null;

  try {
    const res = await axios({
      method: "GET",
      url: apiConfig.getStores,
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

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <div>
          <Switcher items={storeData.stores}/>
        </div>
        {/* <div>
          <MainNav className="mx-6" />
        </div> */}
      </div>
      <div>
          <MainNav className="mx-6" />
        </div>
    </div>
  );
};

export default Navbar;
