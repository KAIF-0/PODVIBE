import env from "@/env";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client_id = env.GOOGLE_CLIENT_ID;
    const redirect_uri = `${env.BASE_URL}/api/oauth-callback`;
    const scope =
      "https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.force-ssl";
    const response_type = "code";

    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&response_type=${response_type}&access_type=offline&prompt=consent`;

    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "An error occurred during the OAuth process." },
      { status: 500 }
    );
  }
}
