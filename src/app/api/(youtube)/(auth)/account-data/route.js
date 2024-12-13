import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tokenA = searchParams.get("access_token");

  const cookieStore = cookies();
  const tokenB = cookieStore.get("access_token").value;

  const access_token = tokenA || tokenB;

  if (!access_token) {
    return NextResponse.json(
      { error: "Access token is required" },
      { status: 400 }
    );
  }

  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/channels",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        params: {
          part: "snippet,contentDetails,statistics",
          mine: true,
        },
      }
    );

    console.log("DATA: ", response.data);

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error("Error: ", error.response?.data || error.message);
    return NextResponse.json(
      {
        error: "Failed to fetch YouTube account details",
      },
      { status: 500 }
    );
  }
}
