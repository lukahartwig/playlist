import { cleanEnv, str } from "envalid";

export const env = cleanEnv(process.env, {
  DATABASE_URL: str(),
  NODE_ENV: str(),
  SPOTIFY_CLIENT_ID: str(),
  SPOTIFY_CLIENT_SECRET: str(),
});
