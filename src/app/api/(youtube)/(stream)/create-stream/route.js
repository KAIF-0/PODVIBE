import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { access_token, title } = await request.json();
    const newTitle = title + " | PODVIBE";
    const response = await axios.post(
      "https://www.googleapis.com/youtube/v3/liveStreams?part=snippet,cdn",
      {
        snippet: { title: newTitle.toString() },
        cdn: {
          frameRate: "30fps",
          ingestionType: "rtmp",
          resolution: "720p",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(
      {
        success: true,
        streamId: response.data.id,
      },
      { status: 200 }
    );
  } catch (err) {
    if (err.response && err.response.data.error) {
      if (
        err.response.data.error.message ===
        "The user is not enabled for live streaming."
      ) {
        console.error("Error response data:", err.response.data);
        return NextResponse.json(
          {
            success: false,
            message: "You are not enabled for live streaming",
          },
          { status: 403 }
        );
      }
    }

    console.error("Error creating stream:", err);
    return NextResponse.json(
      { error: "Failed to create stream" },
      { status: 500 }
    );
  }
}
