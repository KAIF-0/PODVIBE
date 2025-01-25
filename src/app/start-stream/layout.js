import { MediaRecorderProvider } from "@/config/media-recorder-config/mediaRecorder";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PODVIBE",
  description: "Your own Podcast Streaming Application",
};

export default function RootLayout({ children }) {
  return (
    <MediaRecorderProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </MediaRecorderProvider>
  );
}
