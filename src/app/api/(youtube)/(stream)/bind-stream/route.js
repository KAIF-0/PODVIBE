import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { broadcastId, streamId, access_token: tokenA } = await request.json();

    //in case ki access_token is null from frontend
    const cookieStore = cookies();
    const tokenB = cookieStore.get("refresh_token").value;

    const access_token = tokenA || tokenB;

    const response = await axios.post(
      `https://www.googleapis.com/youtube/v3/liveBroadcasts/bind?id=${broadcastId}&part=id,contentDetails&streamId=${streamId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response.data.contentDetails.boundStreamId);

    return NextResponse.json(
      {
        success: true,
        message: "Broadcast bound successfully",
        boundStreamId: response.data.contentDetails.boundStreamId,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error.response) {
      console.error("Error binding stream:", error.response.data);
    }
    console.error("Error binding broadcast to stream:", error);
    return NextResponse.json(
      { error: "Failed to bind broadcast to stream" },
      { status: 500 }
    );
  }
}
