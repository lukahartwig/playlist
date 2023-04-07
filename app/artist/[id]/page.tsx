import Image from "next/image";
import Link from "next/link";
import { queryAlbumsByArtistId } from "@/lib/db";
import { formatPlaytime } from "@/lib/format";
import { PageProps } from "@/types/next";

export const runtime = "edge";

export default async function ArtistDetailPage({ params }: PageProps) {
  const albums = await queryAlbumsByArtistId(params?.id as string);

  return (
    <div className="mx-auto max-w-7xl overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="grid grid-cols-[minmax(min-content,_300px)] gap-x-6 gap-y-10 sm:grid-cols-[repeat(2,_minmax(min-content,_300px))] lg:grid-cols-[repeat(3,_minmax(min-content,_300px))] lg:gap-x-8">
        {albums.map((album) => (
          <Link
            key={album.id}
            href={`/album/${album.id}`}
            className="group text-sm"
          >
            <div className="overflow-hidden rounded-lg group-hover:opacity-75">
              <Image
                src={album.album_cover_url}
                alt={album.title}
                height={album.album_cover_height}
                width={album.album_cover_width}
              />
            </div>
            <h3 className="mt-4 font-medium text-gray-900">{album.title}</h3>
            <p className="italic text-gray-500">{album.type}</p>
            <p className="mt-2 font-medium text-gray-900">
              {formatPlaytime(Number(album.total_playtime_ms))}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
