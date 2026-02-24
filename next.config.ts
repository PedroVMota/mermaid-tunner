import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use 'standalone' for Docker, 'export' for static hosting
  output: process.env.NEXT_OUTPUT_MODE === "export" ? "export" : "standalone",
  reactCompiler: true,

  // Disable image optimization for static export
  ...(process.env.NEXT_OUTPUT_MODE === "export" && {
    images: { unoptimized: true },
  }),
};

export default nextConfig;
