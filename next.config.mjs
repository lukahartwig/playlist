import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["i.scdn.co"],
  },
  reactStrictMode: true,
  swcMinify: false,
};

export default withBundleAnalyzer(nextConfig);
