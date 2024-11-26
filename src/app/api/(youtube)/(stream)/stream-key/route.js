// app/api/get-stream-details/route.js
import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const { access_token:tokenA, boundStreamId } = await request.json();

    const cookieStore = cookies();
    const tokenB = cookieStore.get("refresh_token").value;

    const access_token = tokenA || tokenB;

    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/liveStreams",
      {
        params: {
          part: "cdn",
          id: boundStreamId,
        },
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const stream = response.data.items[0];
    if (stream) {
      const ingestionInfo = stream.cdn.ingestionInfo;
      const rtmpUrl = ingestionInfo.ingestionAddress;
      const streamKey = ingestionInfo.streamName;

      return NextResponse.json(
        {
          success: true,
          rtmpUrl,
          streamKey,
        },
        {
          status: 200,
        }
      );
    } else {
      return NextResponse.json(
        { error: "No stream found for the given stream ID." },
        { status: 404 }
      );
    }
  } catch (error) {
    if (error.response) {
      console.error("Error response data:", error.response.data);
    }
    console.error("Error retrieving stream details:", error.message);
    return NextResponse.json(
      { error: "Failed to retrieve stream details" },
      { status: 500 }
    );
  }
}
