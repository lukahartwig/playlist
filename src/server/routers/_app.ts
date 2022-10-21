import { router } from "@/server/trpc";
import { trackRouter } from "@/server/routers/track";
import { albumRouter } from "./album";
import { artistRouter } from "./artist";

export const appRouter = router({
  album: albumRouter,
  artist: artistRouter,
  track: trackRouter,
});

export type AppRouter = typeof appRouter;
