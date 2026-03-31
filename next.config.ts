import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Treat Anthropic SDK as a server-only external package (uses Node.js APIs, must not be bundled for client)
  serverExternalPackages: ["@anthropic-ai/sdk"],
};

export default nextConfig;
