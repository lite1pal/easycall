"use server";

import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";

const streamApiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const streamApiSecret = process.env.STREAM_API_SECRET;

export const tokenProvider = async () => {
  const user = await currentUser();

  if (!user) throw new Error("User is not logged in");

  if (!streamApiKey) throw new Error("Stream API key missing");
  if (!streamApiSecret) throw new Error("Stream API secret missing");

  const client = new StreamClient(streamApiKey, streamApiSecret);

  const exp = Math.round(new Date().getTime() / 1000) + 60 * 60;

  const issued = Math.floor(Date.now() / 1000) - 60;

  const token = client.generateUserToken({
    user_id: user.id,
    validity_in_seconds: issued,
    exp,
  });

  return token;
};
