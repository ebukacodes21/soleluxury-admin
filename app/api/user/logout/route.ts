import { COOKIE_NAME } from "@/constants";
import ApiConfig from "@/services/apiconfig";
import axios from "axios";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { method, cookies } = request;
  const token = cookies.get(COOKIE_NAME)?.value || ""

  try {
    const res = await axios({
      method: method,
      url: ApiConfig.logout,
      headers: {
        Authorization: `Bearer ${token}`
    }
    });

    const response = NextResponse.json(res.data);
    response.cookies.set(COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
      path: "/",
      sameSite: "strict",
    });

    return response;
  } catch (error: any) {
    if (error.code === "ECONNREFUSED") {
      return NextResponse.json({ error: error.errors }, { status: 500 });
    }
    return NextResponse.json(
      { error: error.response?.data || error.message },
      { status: error.response?.status || 500 }
    );
  }
}
