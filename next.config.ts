import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",

  ...(isProd && {
    basePath: "/xiaoxiao",
    assetPrefix: "/xiaoxiao/",
  }),
};

export default nextConfig;