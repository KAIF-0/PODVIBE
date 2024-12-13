import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { broadcastId, access_token: tokenA } = await request.json();

    const cookieStore = cookies();
    const tokenB = cookieStore.get("access_token").value;

    const access_token = tokenA || tokenB;
    console.log(broadcastId, access_token);
    
    if (!access_token) {
      return NextResponse.json(
        { error: "Access token is required" },
        { status: 400 }
      );
    }

    

    const response = await axios.post(
      `https://www.googleapis.com/youtube/v3/liveBroadcasts/transition?broadcastStatus=complete&id=${broadcastId}&part=status`,
      {},
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json({ message: "Broadcast ended" }, { status: 200 });
  } catch (error) {
    if (error.response) {
      console.error("Error ending stream:", error.response.data);
    }
    console.error("Error ending broadcast:", error);
    return NextResponse.json(
      { error: "Failed to end broadcast" },
      { status: 500 }
    );
  }
}
