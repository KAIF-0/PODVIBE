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
import AnimatedGridPattern from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";

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
            	turnOnMicrophoneWhenJoining: true,
           	turnOnCameraWhenJoining: true,
           	showMyCameraToggleButton: true,
           	showMyMicrophoneToggleButton: true,
           	showAudioVideoSettingsButton: false,
           	showScreenSharingButton: false,
           	showTextChat: false,
           	showUserList: false,
           	maxUsers: 2,
           	layout: "Auto",
           	showLayoutButton: false,
           	scenario: {
           		mode: "OneONoneCall",
           		config: {
           			role: "Host",
         		},
         	},
    });
  };
  return (
    <>
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gray-900">
     <AnimatedGridPattern
             numSquares={30}
             maxOpacity={0.3}
             duration={5}
             repeatDelay={0.5}
             className={cn(
               "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]",
               "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
             )}
           />
      <div
        className="myCallContainer"
        ref={myMeeting}
        style={{ width: "100vw", height: "100vh" }}
      ></div>
      </div>
    </>
  );
}
