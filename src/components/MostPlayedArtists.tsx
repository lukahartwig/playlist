import { trpc } from "@/utils/trpc";
import Link from "next/link";

interface Props {
  page: number;
  size?: number;
  nextHref?: string;
  prevHref?: string;
}

export function MostPlayedArtists({
  page,
  size = 10,
  nextHref,
  prevHref,
}: Props) {
  const query = trpc.artist.mostPlayed.useQuery(
    { page, size },
    {
      keepPreviousData: true,
    }
  );

  if (!query.data) {
    return null;
  }

  const total = query.data.total;
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
              Artist
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Plays
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {query.data?.items.map((artist) => (
            <tr key={artist.id}>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                {artist.name}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {artist.playcount}
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
          {prevHref && (
            <Link
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              href={prevHref}
            >
              Previous
            </Link>
          )}
          {nextHref && (
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
