import Image from "next/image";
import Link from "next/link";
import { queryCountAlbums, queryAlbumsByPlaytime } from "@/lib/db";
import { formatPlaytime } from "@/lib/format";
import { PageProps } from "@/types/next";

const size = 10;

export default async function TopAlbumsPage({ searchParams }: PageProps) {
  const page = searchParams?.page ? parseInt(searchParams.page as string) : 1;

  const [albumCount, albums] = await Promise.all([
    queryCountAlbums(),
    queryAlbumsByPlaytime(page, size),
  ]);

  const nextHref = `/albums/top?page=${page + 1}`;
  const prevHref = `/albums/top?page=${page > 1 ? page - 1 : 1}`;
  const total = albumCount.count;
  const totalPages = Math.ceil(total / size);
  const start = (page - 1) * size + 1;
  const end = Math.min(start + size - 1, total);

  return (
    <div>
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
            >
              Album
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
          {albums.map((album) => (
            <tr key={album.id}>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0">
                    <Image
                      className="h-10 w-10 rounded-full"
                      height={album.album_cover_height}
                      width={album.album_cover_width}
                      src={album.album_cover_url}
                      alt={album.title}
                    />
                  </div>
                  <div className="ml-4">
                    <div className="font-medium text-gray-900">
                      <Link href={`/album/${album.id}`}>{album.title}</Link>
                    </div>
                    <div className="text-gray-500">
                      <Link href={`/artist/${album.artist_id}`}>
                        {album.artist}
                      </Link>
                    </div>
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {formatPlaytime(Number(album.total_playtime_ms))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <nav
        className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
        aria-label="Pagination"
      >
        <div className="hidden sm:block">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{start}</span> to{" "}
            <span className="font-medium">{end}</span> of{" "}
            <span className="font-medium">{total}</span> results
          </p>
        </div>
        <div className="flex flex-1 justify-between sm:justify-end">
          {page !== 1 && (
            <Link
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              href={prevHref}
            >
              Previous
            </Link>
          )}
          {page !== totalPages && (
            <Link
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              href={nextHref}
            >
              Next
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
