"use client";

import axios from "axios";

const fetchStreams = async () => {
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
};

export default fetchStreams;
