import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Post photos uploaded in Sanity Studio.
    remotePatterns: [new URL("https://cdn.sanity.io/images/**")],
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
