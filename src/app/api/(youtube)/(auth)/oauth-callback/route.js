import env from "@/env";
import axios from "axios";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request) {
  const cookieStore = cookies();
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Authorization code not found" },
      { status: 400 }
    );
  }


  //check if token exist
  if (cookieStore.get("access_token") && cookieStore.get("refresh_token")) {
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");
    console.log("Existing tokens deleted from cookies!");
  } else {
    console.log("No existing tokens found in cookies!");
  }

  const tokenEndpoint = "https://oauth2.googleapis.com/token";
  const redirect_uri = `${env.BASE_URL}/api/oauth-callback`;

  await axios
    .post(tokenEndpoint, {
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri,
      grant_type: "authorization_code",
    })
    .then((result) => {
      const { access_token, refresh_token } = result.data;
      cookieStore.set("access_token", `${access_token}`, {
        expires: new Date(Date.now() + 60 * 60 * 1000 * 24 * 30),
      });
      cookieStore.set("refresh_token", `${refresh_token}`, {
        expires: new Date(Date.now() + 60 * 60 * 1000 * 24 * 30),
      });
      console.log("Token Saved in Cookies!");
      console.log("Access Token:", access_token);
      console.log("Refresh Token:", refresh_token);
    })
    .catch((err) => {
      if (err.response) {
        console.error("Error response data:", err.response.data);
      } else {
        console.error("Error message:", err.message);
      }
    });

  return NextResponse.redirect(`${env.BASE_URL}?youtubeAuth=true`);
}
