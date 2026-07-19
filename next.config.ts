import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS === "true";
const repo = process.env.GITHUB_REPOSITORY ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}` : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isGithubActions ? repo : "",
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: process.cwd(),
  },
  env: {
    NEXT_PUBLIC_GITHUB_REPOSITORY: process.env.GITHUB_REPOSITORY || 'Amanmeena0/tiny-island',
  },
};

export default nextConfig;
