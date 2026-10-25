/** @type {import('next').NextConfig} */
// Static export so the site can be hosted on GitHub Pages. The Pages workflow
// sets NEXT_PUBLIC_BASE_PATH to the repo sub-path (e.g. /AboutDhruvpatil).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  output: "export",
  basePath,
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
