import axios from "axios";
import env from "@/env";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request) {
  //from cookies
  const cookieStore = cookies();
  const access_token = cookieStore.get("access_token")?.value;
  // console.log(access_token);
  
  if (!access_token) {
    return NextResponse.json(
      { error: "Access token is required" },
      { status: 400 }
    );
  }

  try {
    const url = "https://www.googleapis.com/youtube/v3/liveBroadcasts";

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      params: {
        part: "snippet,contentDetails",
        mine: true,
        maxResults: 6,
      },
    });

    return NextResponse.json(response.data, {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching streams:", error);
    return NextResponse.json(
      { error: "Failed to fetch streams" },
      {
        status: 500,
      }
    );
  }
}
