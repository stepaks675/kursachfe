import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['i.pinimg.com', 'i.ytimg.com', 'gamemag.ru', 'm.media-amazon.com', 'static.life.ru', 'via.placeholder.com', 'image.tmdb.org'],
    unoptimized: true,
  },
};

export default nextConfig;
