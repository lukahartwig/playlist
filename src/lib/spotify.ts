import SpotifyWebApi from "spotify-web-api-node";
import { env } from "./env";
import { prisma } from "./prisma";

const client = new SpotifyWebApi({
  clientId: env.SPOTIFY_CLIENT_ID,
  clientSecret: env.SPOTIFY_CLIENT_SECRET,
});

let expiresAt: Date;

function isStillValid(expiration: Date) {
  return expiration > new Date(Date.now() + 1000 * 60);
}

async function refreshClient() {
  if (client.getAccessToken() && expiresAt && isStillValid(expiresAt)) {
    console.log("Spotify token is still valid, skipping refresh");
    return;
  }

  const credentials = await prisma.spotifyCredentials.findFirst();

  if (!credentials) {
    throw new Error("No Spotify credentials found");
  }

  client.setAccessToken(credentials.accessToken);
  client.setRefreshToken(credentials.refreshToken);

  if (!expiresAt) {
    expiresAt = credentials.expiresAt;
  }

  let accessToken: string;
  if (isStillValid(expiresAt)) {
    console.log("Spotify token is still valid, skipping refresh");
    accessToken = credentials.accessToken;
  } else {
    console.log("Spotify token is expired, refreshing");

    const {
      body: { access_token, refresh_token, expires_in },
    } = await client.refreshAccessToken();

    expiresAt = new Date(Date.now() + expires_in * 1000);

    console.log(`Spotify token refreshed, expires at ${expiresAt}`);

    await prisma.spotifyCredentials.update({
      where: { id: credentials.id },
      data: {
        accessToken: access_token,
        refreshToken: refresh_token ?? credentials.refreshToken,
        expiresAt,
      },
    });

    accessToken = access_token;
  }

  client.setAccessToken(accessToken);
}

function getSpotifyCursor() {
  return prisma.spotifyCursor.findFirst();
}

export async function updateRecentlyPlayedTracks() {
  const [cursor] = await Promise.all([getSpotifyCursor(), refreshClient()]);

  console.log(
    `Fetching recently played tracks from Spotify, after ${new Date(
      Number(cursor?.cursor)
    )}`
  );

  const { body } = await client.getMyRecentlyPlayedTracks({
    limit: 50,
    after: Number(cursor?.cursor),
  });

  if (body.items.length === 0) {
    console.log("No more tracks to fetch");
    return;
  }

  for (const item of body.items) {
    console.log(
      `Processing track ${item.track.name} by ${item.track.artists[0].name} at ${item.played_at}`
    );

    const track = item.track;
    const trackArtists = track.artists;
    const album = track.album;
    const albumArtists = album.artists;
    const allArtists = [...trackArtists, ...albumArtists].filter(
      (artist, i, list) => list.findIndex((a) => a.id === artist.id) === i
    );

    await prisma.spotifyArtist.createMany({
      data: allArtists.map((artist) => ({
        id: artist.id,
        name: artist.name,
        uri: artist.uri,
      })),
      skipDuplicates: true,
    });

    await prisma.spotifyAlbum.upsert({
      where: { id: item.track.album.id },
      create: {
        id: item.track.album.id,
        name: item.track.album.name,
        uri: item.track.album.uri,
        releaseDate: new Date(item.track.album.release_date),
        releaseDatePrecision: item.track.album.release_date_precision,
        totalTracks: item.track.album.total_tracks,
        type: item.track.album.album_type,
      },
      update: {
        name: item.track.album.name,
        uri: item.track.album.uri,
        releaseDate: new Date(item.track.album.release_date),
        releaseDatePrecision: item.track.album.release_date_precision,
        totalTracks: item.track.album.total_tracks,
        type: item.track.album.album_type,
      },
    });

    await prisma.spotifyArtistsOnAlbums.createMany({
      data: albumArtists.map((artist) => ({
        albumId: album.id,
        artistId: artist.id,
        position: album.artists.findIndex((a) => a.id === artist.id),
      })),
      skipDuplicates: true,
    });

    await prisma.spotifyAlbumImage.createMany({
      data: item.track.album.images.map((image) => ({
        id: image.url,
        height: image.height,
        width: image.width,
        url: image.url,
        albumId: item.track.album.id,
      })),
      skipDuplicates: true,
    });

    await prisma.spotifyTrack.upsert({
      where: { id: item.track.id },
      create: {
        id: item.track.id,
        name: item.track.name,
        uri: item.track.uri,
        durationMs: item.track.duration_ms,
        explicit: item.track.explicit,
        albumId: item.track.album.id,
      },
      update: {
        name: item.track.name,
        uri: item.track.uri,
        durationMs: item.track.duration_ms,
        explicit: item.track.explicit,
        albumId: item.track.album.id,
      },
    });

    await prisma.spotifyArtistsOnTracks.createMany({
      data: albumArtists.map((artist) => ({
        artistId: artist.id,
        trackId: track.id,
        position: track.artists.findIndex((a) => a.id === artist.id),
      })),
      skipDuplicates: true,
    });

    await prisma.spotifyPlayedTracks.create({
      data: {
        playedAt: item.played_at,
        popularity: item.track.popularity,
        track: {
          connect: { id: item.track.id },
        },
      },
    });
  }

  const nextCursor = Number(body.cursors?.after) + 1 ?? Date.now();
  console.log(`Next cursor: ${new Date(nextCursor)}`);

  await prisma.spotifyCursor.update({
    where: { id: cursor?.id },
    data: { cursor: nextCursor.toString() },
  });
}
