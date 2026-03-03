import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  // Tell Next.js not to bundle Prisma — keeps Lambda size small → faster cold starts
  serverExternalPackages: ["@prisma/client", "prisma"],
};

export default nextConfig;
