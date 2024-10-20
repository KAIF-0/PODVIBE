"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Camera, Phone, PhoneCall, Plus, Rss, Video } from "lucide-react";
// import { client, databases } from "@/config/client/appwrite.js";
// import { ID } from "appwrite";
// import peer from "../../peer";
// import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../../../auth/store/authStore";
import env from "@/env";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { v4 as uuidv4 } from "uuid";

export default function Component({ params }) {
  const { roomID } = params;
  console.log(roomID)
  const { userId, username } = useAuthStore();
  const myMeeting = async (element) => {
    // generate Kit Token
    const appID = parseInt(env.ZEGOCLOUD_APP_ID);
    const serverSecret = env.ZEGOCLOUD_SERVER_SECRET;
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      userId,
      username,
      720
    );

    // console.log(kitToken);
    // Create instance object from Kit Token.
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    // start the call
    zp.joinRoom({
      container: element,
      sharedLinks: [
        {
          name: "One-on-One Pod Link",
          url:
            window.location.protocol +
            "//" +
            window.location.host +
            window.location.pathname +
            "?roomID=" +
            roomID,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
      },
    });
  };
  return (
    <>
      <motion.div
        className="absolute inset-0 z-0"
        initial={{
          background:
            "radial-gradient(circle at 50% 50%, #ffffff 0%, #000000 100%)",
        }}
        animate={{
          background: [
            "radial-gradient(circle at 0% 0%, #ffffff 0%, #000000 100%)",
            "radial-gradient(circle at 100% 0%, #ffffff 0%, #000000 100%)",
            "radial-gradient(circle at 100% 100%, #ffffff 0%, #000000 100%)",
            "radial-gradient(circle at 0% 100%, #ffffff 0%, #000000 100%)",
            "radial-gradient(circle at 50% 50%, #ffffff 0%, #000000 100%)",
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear",
        }}
      />
      <div
        className="myCallContainer"
        ref={myMeeting}
        style={{ width: "100vw", height: "100vh" }}
      ></div>
    </>
  );
}
