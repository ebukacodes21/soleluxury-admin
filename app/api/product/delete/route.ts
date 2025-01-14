import { COOKIE_NAME } from "@/constants";
import ApiConfig from "@/services/apiconfig";
import axios from "axios";
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const { method, cookies } = request;
    const token = cookies.get(COOKIE_NAME)?.value || "";
    const params = Object.fromEntries(request.nextUrl.searchParams.entries());
    
    try {
        const res = await axios({
            method: method,
            url: ApiConfig.deleteProduct,
            params,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return NextResponse.json(res.data);
    } catch (error: any) {
        if (error.code === "ECONNREFUSED"){
            return NextResponse.json({ error: error.errors}, {status: 500})
        }
        return NextResponse.json({ error: error.response?.data }, { status: error.response?.status });
    }
}