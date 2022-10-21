import type { NextRequest } from "next/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/routers/_app";

export const config = {
  runtime: "experimental-edge",
  unstable_allowDynamic: [
    "/node_modules/.pnpm/is-what@4.1.7/node_modules/is-what/dist/index.es.js",
  ],
};

export default async function handler(req: NextRequest) {
  return fetchRequestHandler({
    router: appRouter,
    createContext: () => ({}),
    req,
    endpoint: "/api/trpc",
  });
}
