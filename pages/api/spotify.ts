import { NextApiRequest, NextApiResponse } from "next";
import { verifySignature } from "@upstash/qstash/nextjs";
import { updateRecentlyPlayedTracks } from "../../lib/spotify";

export const config = {
  api: {
    bodyParser: false,
  },
  runtime: "nodejs",
};

export default verifySignature(
  async (req: NextApiRequest, res: NextApiResponse) => {
    await updateRecentlyPlayedTracks();
    res.status(200).json({ status: "OK" });
  }
);
