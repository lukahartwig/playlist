import { useArtistAlbums } from "@/lib/hooks/useArtistAlbums";
import Image from "next/future/image";
import Link from "next/link";
import { Playtime } from "./Playtime";

interface Props {
  artistId: string;
}

export function ArtistAlbumGrid({ artistId }: Props) {
  const query = useArtistAlbums(artistId);

  if (query.data) {
    return (
      <div className="mx-auto max-w-7xl overflow-hidden py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="grid grid-cols-[minmax(min-content,_300px)] gap-y-10 gap-x-6 sm:grid-cols-[repeat(2,_minmax(min-content,_300px))] lg:grid-cols-[repeat(3,_minmax(min-content,_300px))] lg:gap-x-8">
          {query.data.map((album) => (
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
                <Playtime durationMs={album.total_playtime_ms} />
              </p>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl overflow-hidden px-4 sm:px-6 lg:px-8">
      <div className="grid animate-pulse grid-cols-[minmax(min-content,_300px)] gap-y-10 gap-x-6 sm:grid-cols-[repeat(2,_minmax(min-content,_300px))] lg:grid-cols-[repeat(3,_minmax(min-content,_300px))] lg:gap-x-8">
        {Array.from({ length: 9 }, (_, i) => (
          <div key={i} className="group text-sm">
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
              <div className="h-[300px] w-[300px] bg-gray-200" />
            </div>
            <div className="mt-4 h-3 w-80 rounded bg-gray-200" />
            <div className="mt-1 h-3 w-10 rounded bg-gray-200" />
            <div className="mt-2 h-3 w-6 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
