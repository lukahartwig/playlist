// @ts-check

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  experimental: {
    appDir: true,
    runtime: "experimental-edge",
  },
  images: {
    domains: ["i.scdn.co"],
  },
  swcMinify: true,
};

module.exports = withBundleAnalyzer(nextConfig);
