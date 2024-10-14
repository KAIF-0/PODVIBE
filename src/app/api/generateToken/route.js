import { NextResponse } from 'next/server';
import crypto from 'crypto';
import env from '@/env';

export async function POST(request) {
  const { userId, roomId } = await request.json();
  console.log(userId, roomId);

  const appID = parseInt(env.ZEGOCLOUD_APP_ID);  // Replace with your ZEGOCLOUD AppID
  const serverSecret = env.ZEGOCLOUD_SERVER_SECRET;  // Replace with your ZEGOCLOUD Server Secret
  const expiration = Math.floor(Date.now() / 1000) + 7200; // Token valid for 2 hours

  const payload = {
    app_id: appID,
    room_id: roomId,
    user_id: userId,
    exp: expiration,
  };

  const token = crypto
    .createHmac('sha256', serverSecret)
    .update(JSON.stringify(payload))
    .digest('base64');

  return NextResponse.json({ token });
}
