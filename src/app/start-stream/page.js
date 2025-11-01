"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader, Youtube } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuthStore } from "../auth/store/authStore";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { io } from "socket.io-client";
import env from "@/env";
import { useStreamStore } from "../auth/store/streamStore";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useSocket } from "@/config/sockets-config/socket";
import AnimatedGridPattern from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";

export default function Component() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { isLoggedIn, logout, userId } = useAuthStore();
  const {
    storeYtToken,
    refreshYtToken,
    ytCredential,
    isCredentialStored,
    startStream: setStreamStarted,
    isStreaming,
  } = useStreamStore();
  const socket = useSocket();
  const ytAuthCookie = Cookies.get("isYtAuthenticated");
  const isYtAuthenticated = ytAuthCookie ? JSON.parse(ytAuthCookie) : false;

  useEffect(() => {
    if (!socket) {
      console.log("Sockets not connected!");
      return;
    }

    console.log(socket);
  }, [socket]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.trim().length === 0 || description.trim().length === 0) {
      toast.error("Title and description cannot be empty!");
      return;
    }
    if (!isLoggedIn) {
      toast.error("You must be Logged-In to stream your Podcast!");
      return;
    }

    if (!isYtAuthenticated) {
      toast.custom(
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between bg-white text-black p-4 rounded-xl shadow-lg border"
          style={{ minWidth: "320px" }}
        >
          <div>
            <h4 className="text-md font-bold text-black">
              You are not authenticated with YouTube!
            </h4>
          </div>
          <button
            onClick={() => router.push("/api/oauth")}
            className="ml-4 bg-red-600 text-white text-sm font-medium px-3 py-1 rounded-md hover:bg-white hover:text-red-600 border hover:border-red-600"
          >
            Authenticate
          </button>
        </motion.div>,
        {
          duration: 5000,
        }
      );
      return;
    }
    setIsLoading(true);
    console.log(title, description);

    try {
      if (!isCredentialStored) {
        const storeToken = await storeYtToken();
        const refreshToken = await refreshYtToken();
        if (
          (storeToken && storeToken.message === "userSession expired!") ||
          (refreshToken && refreshToken.message === "userSession expired!")
        ) {
          await logout();
          router.push("/join-in");
          return;
        }
      }

      const { access_token } = ytCredential;
      await axios
        .post("/api/create-broadcast", {
          access_token: access_token,
          title: title.trim(),
          description: description.trim(),
        })
        .then(async (e) => {
          const { broadcastId } = e.data;
          console.log(broadcastId);

          await axios
            .post("/api/create-stream", {
              access_token: access_token,
              title: title.trim(),
            })
            .then(async (e) => {
              const { streamId } = e.data;
              console.log(streamId);

              await axios
                .post("/api/bind-stream", {
                  access_token: access_token,
                  broadcastId: broadcastId,
                  streamId: streamId,
                })
                .then(async (e) => {
                  const { boundStreamId } = e.data;
                  console.log(boundStreamId);

                  await axios
                    .post("/api/stream-key", {
                      access_token: access_token,
                      boundStreamId: boundStreamId,
                    })
                    .then(async (e) => {
                      console.log("STREAM DETAILS:", e.data);
                      socket.emit("streamKey", {
                        streamKey: e.data.streamKey,
                        userId: userId,
                      });
                      await new Promise((resolve) => setTimeout(resolve, 2000));
                      await startRecording();
                      toast.custom(
                        <motion.div
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          className="flex items-center justify-between bg-white text-black p-4 rounded-xl shadow-lg border"
                          style={{ minWidth: "320px" }}
                        >
                          <div className="flex gap-1">
                            <Loader className="animate-spin" />
                            <h4 className="text-md font-bold text-black">
                              Broadcast started! Please wait to go live.
                            </h4>
                          </div>
                          <button
                            onClick={() =>
                              window.open(
                                `https://studio.youtube.com/video/${broadcastId}/livestreaming`,
                                "_blank"
                              )
                            }
                            className="ml-2 bg-gray-500 text-white text-sm font-medium px-3 py-1 rounded-md hover:bg-white hover:text-gray-500 border hover:border-gray-500"
                          >
                            Preview
                          </button>
                        </motion.div>,
                        {
                          duration: 50000,
                        }
                      );
                      await new Promise((resolve) =>
                        setTimeout(resolve, 60000)
                      );
                      await axios
                        .post("/api/start-stream", {
                          access_token: access_token,
                          broadcastId: broadcastId,
                        })
                        .then(async (e) => {
                          console.log("STREAM STARTED");
                          setStreamStarted(access_token, broadcastId); //isStreaming = true set kardega;
                          toast.success("You are Live Now!");
                        })
                        .catch((er) => {
                          console.log("ERROR", er);
                        });
                    });
                });
            });
        });
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      if (
        err.response &&
        err.response.data.message === "You are not enabled for live streaming"
      ) {
        toast.custom(
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between bg-white text-black p-4 rounded-xl shadow-lg border"
            style={{ minWidth: "320px" }}
          >
            <div>
              <h4 className="text-md font-bold text-black">
                Please enable live streaming on Youtube!
              </h4>
            </div>

            <button
              onClick={() =>
                window.open("https://studio.youtube.com/channel/", "_blank")
              }
              className="ml-4 bg-red-600 text-white text-sm font-medium px-3 py-1 rounded-md hover:bg-white hover:text-red-600 border hover:border-red-600"
            >
              Youtube Studio
            </button>
          </motion.div>,
          {
            duration: 10000,
          }
        );
        return;
      }
      toast.error("Stream Failed! Try again...");
      if (err.response && err.response.status === 500) {
        //trying refreshing token
        const refreshToken = await refreshYtToken();
        if (refreshToken && refreshToken.message === "userSession expired!") {
          toast.error("Your session has been expired! Please Login again...");
          await logout();
          router.push("/join-in?session=expired");
        }
      }
    }
    setIsLoading(false);
  };


  const startRecording = async () => {
  try {
    const displayStream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 25 }
      },
      audio: false,
    });

    const audioStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100
      },
      video: false,
    });

    const combinedStream = new MediaStream([
      ...displayStream.getVideoTracks(),
      ...audioStream.getAudioTracks(),
    ]);

    console.log("Combined Stream:", combinedStream);

    const options = {
      mimeType: 'video/webm;codecs=vp8,opus',
      videoBitsPerSecond: 2500000,
      audioBitsPerSecond: 128000,
    };

    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      options.mimeType = 'video/webm;codecs=h264,opus';
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = 'video/webm';
      }
    }

    const mediaRecorder = new MediaRecorder(combinedStream, options);

    if (!mediaRecorder) {
      alert("Media Recorder is not supported in this browser!");
      return;
    }

    mediaRecorder.start(1000);

    mediaRecorder.ondataavailable = async (e) => {
      if (e.data && e.data.size > 0) {
        console.log("Binary data size: ", e.data.size);
        
        const arrayBuffer = await e.data.arrayBuffer();
        
        socket.emit("streamData", { 
          userId: userId, 
          streamData: arrayBuffer 
        });
      }
    };

    mediaRecorder.onerror = (error) => {
      console.error("MediaRecorder error:", error);
    };

    mediaRecorder.onstop = () => {
      console.log("MediaRecorder stopped");
      displayStream.getTracks().forEach(track => track.stop());
      audioStream.getTracks().forEach(track => track.stop());
    };

    return mediaRecorder;

  } catch (error) {
    console.log("ERROR: ", error);
    alert("Error starting recording: " + error.message);
  }
}

  // const setStreamKey = async (key) => {
  //   // socket.emit("streamKey", key);
  //   await axios.post(`${env.STREAM_SERVER_URL}/set-streamKey`,{
  //     streamKey: key
  //   }).then((e)=>{
  //     console.log("Stream Key Set");
  //   }).catch((err) => {
  //     if (err.response) {
  //       console.error("Error response data:", err.response.data);
  //     } else {
  //       console.error("Error message:", err.message);
  //     }
  //   });
  // };

  return (
      <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-gray-900 text-white">
        <Toaster />
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <motion.h1
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold text-white mb-2"
            >
              Start Streaming
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-300"
            >
              Set up your YouTube live stream
            </motion.p>
          </div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-6 bg-transparent border-2 rounded-3xl p-6 shadow-xl"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">
                Stream Title
              </label>
              <Input
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your stream title"
                className="bg-white/20 border-white/20 text-white placeholder:text-gray-400"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">
                Stream Description
              </label>
              <Textarea
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter your stream description"
                className="bg-white/20 border-white/20 text-white placeholder:text-gray-400 min-h-[100px]"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white transition-all duration-300 transform hover:scale-[1.02]"
              disabled={isLoading || isStreaming}
            >
              <Youtube className="w-5 h-5 mr-2" />
              {isLoading ? "Starting Stream..." : "Start YouTube Stream"}
            </Button>
          </motion.form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex flex-wrap justify-center gap-2"
        >
          {["Gaming", "IRL", "Music", "Education", "Technology"].map(
            (tag, index) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-200 hover:bg-white/20 transition-colors cursor-pointer"
              >
                {tag}
              </motion.span>
            )
          )}
        </motion.div>
      </div>
  );
}
