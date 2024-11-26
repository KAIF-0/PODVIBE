import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { broadcastId, access_token: tokenA } = await request.json();

    const cookieStore = cookies();
    const tokenB = cookieStore.get("refresh_token").value;

    const access_token = tokenA || tokenB;

    const response = await axios
      .post(
        `https://www.googleapis.com/youtube/v3/liveBroadcasts/transition?broadcastStatus=live&id=${broadcastId}&part=status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((e) => {
        console.log(e.data);
      });

    return NextResponse.json({ message: "Broadcast started" }, { status: 200 });
  } catch (error) {
    if (error.response) {
      console.error("Error starting stream:", error.response.data);
    }
    console.error("Error starting broadcast:", error);
    return NextResponse.json(
      { error: "Failed to start broadcast" },
      { status: 500 }
    );
  }
}
