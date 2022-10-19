// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  experimental: {
    newNextLinkBehavior: true,
  },
  images: {
    domains: ["i.scdn.co"],
  },
};

module.exports = nextConfig;
