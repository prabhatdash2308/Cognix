import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // output: "standalone", // Disabled temporarily due to Windows EPERM symlink errors
  poweredByHeader: false,
  transpilePackages: ["@cognix/ui", "@cognix/types", "@cognix/sdk", "@cognix/app-shell"],
  typedRoutes: true,
};

export default nextConfig;
