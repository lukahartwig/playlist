import { queryAlbumDetails, queryTracksByAlbumId } from "@/lib/db";
import { formatPlaytime } from "@/lib/format";
import { PageProps } from "@/types/next";

export const runtime = "edge";

export default async function AlbumDetailPage({ params }: PageProps) {
  const albumId = params?.id as string;

  const [album, tracks] = await Promise.all([
    queryAlbumDetails(albumId),
    queryTracksByAlbumId(albumId),
  ]);

  return (
    <table className="min-w-full divide-y divide-gray-300">
      <thead className="bg-gray-50">
        <tr>
          <th
            scope="col"
            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
          >
            Track
          </th>
          <th
            scope="col"
            className="w-60 px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
          >
            Playtime
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {tracks.map((track) => (
          <tr key={track.id}>
            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
              {track.title}
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {formatPlaytime(Number(track.total_playtime_ms))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
