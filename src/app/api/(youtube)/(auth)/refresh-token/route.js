import SetYtAuthToken from "@/app/auth/helper/setToken";
import env from "@/env";
import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  // const { refresh_token } = await request.json();
  const cookieStore = cookies();
  const refresh_token = cookieStore.get("refresh_token").value;

  console.log(refresh_token);
  const tokenEndpoint = "https://oauth2.googleapis.com/token";

  try {
    const result = await axios.post(tokenEndpoint, {
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      refresh_token,
      grant_type: "refresh_token",
    });
    const { access_token } = result.data;
    console.log("New Access Token:", access_token);
    // SetYtAuthToken(access_token);



    //update in cookies
    if (cookieStore.get("access_token")) {
      cookieStore.delete("access_token");
      console.log("Existing access token deleted from cookies!");
    }
    cookieStore.set("access_token", access_token, {
      expires: new Date(Date.now() + 60 * 60 * 1000 * 24 * 30),
    });
    console.log("New access token set in cookies!");


    
    return NextResponse.json({
      success: true,
      access_token: access_token,
    });
  } catch (err) {
    if (err.response) {
      console.error("Error response data:", err.response.data);
    } else {
      console.error("Error message:", err.message);
    }
    return NextResponse.json(
      {
        success: false,
        message: "Failed to obtain access token",
      },
      { status: 500 }
    );
  }
}
