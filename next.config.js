// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  experimental: {
    appDir: true,
    // runtime: "experimental-edge",
  },
  images: {
    domains: ["i.scdn.co"],
  },
};

module.exports = nextConfig;
