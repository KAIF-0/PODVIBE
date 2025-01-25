"use client";

import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
} from "react";

const MediaRecorderContext = createContext(null);

export const MediaRecorderProvider = ({ children }) => {
  const mediaRecorderRef = useRef(null);
  const [combinedStream, setCombinedStream] = useState(null);

  const startRecording = useCallback(async (socket, userId) => {
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });

      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      const stream = new MediaStream([
        ...displayStream.getVideoTracks(),
        ...audioStream.getAudioTracks(),
      ]);

      setCombinedStream(stream);

      const mediaRecorder = new MediaRecorder(stream, {
        audioBitsPerSecond: 125000,
        videoBitsPerSecond: 2500000,
        framerate: 25,
      });

      mediaRecorder.ondataavailable = (e) => {
        console.log(e.data);
        socket.emit("streamData", { userId: userId, streamData: e.data });
      };

      mediaRecorder.start(10);
    } catch (error) {
      console.log("Failed to start recording:", error);
    }
  }, []);

  const stopRecording = useCallback(async () => {
    console.log("Recording Stopped!")
    mediaRecorderRef?.current?.stop();
    mediaRecorderRef.current = null;

    if (combinedStream) {
      combinedStream.getTracks().forEach((track) => track.stop());
    }
    setCombinedStream(null);
  }, [combinedStream]);

  return (
    <MediaRecorderContext.Provider value={{ startRecording, stopRecording }}>
      {children}
    </MediaRecorderContext.Provider>
  );
};

export const useMediaRecorder = () => {
  return useContext(MediaRecorderContext);
};
