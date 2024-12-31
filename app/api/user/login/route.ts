import { COOKIE_NAME } from "@/constants";
import ApiConfig from "@/services/apiconfig";
import axios from "axios";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { method } = request;
  const body = await request.json();

  try {
    const res = await axios({
      method: method,
      url: ApiConfig.login,
      data: body,
    });
    const { access_token } = res.data;

    const response = NextResponse.json(res.data);
    response.cookies.set(COOKIE_NAME, access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
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