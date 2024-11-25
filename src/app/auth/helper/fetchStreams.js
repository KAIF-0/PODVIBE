"use client";

import axios from "axios";

const fetchStreams = async () => {
  try {
    const results = await axios.get(`/api/live-streams`);
    const mockStreams = results.data.items.map((e) => ({
      id: `${e.id}`,
      title: ` ${e.snippet.title}`,
      thumbnail: `${e.snippet.thumbnails.standard.url}`,
      viewerCount: Math.floor(Math.random() * 10000),
      description: `${e.snippet.description}`,
      publishedAt: `${e.snippet.publishedAt}`,
    }));

    console.log(mockStreams);

    return {
      success: true,
      streams: mockStreams,
    };
  } catch (err) {
    if (err.response) {
      console.error("Error response data:", err.response);
    } else {
      console.error("Error message:", err.message);
    }
    return {
      success: false,
      streams: [],
    };
  }
};

export default fetchStreams;
