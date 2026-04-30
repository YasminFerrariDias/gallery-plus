import Button, { buttonVariants } from "../../../components/button";
import Skeleton from "../../../components/skeleton";
import Text from "../../../components/text";
import usePhotos from "../../photos/hooks/use-photos";
import type { Album } from "../models/album";
import { BiCog } from "react-icons/bi";
import cx from "classnames";
import AlbumEditDialog from "./album-edit-dialog";

interface AlbumsFilterProps extends React.ComponentProps<"div"> {
  albums: Album[];
  loading?: boolean;
}

export default function AlbumsFilter({ albums, loading, className, ...props }: AlbumsFilterProps) {
  const { filters } = usePhotos();

  return (
    <div className={cx("flex items-center gap-3.5 overflow-x-auto", className)} {...props}>
      <Text variant="heading-small">Álbuns</Text>
      <div className="flex gap-3">
        {!loading ? (
          <>
            <Button
              variant={filters.albumId === null ? 'primary' : 'ghost'}
              size="sm"
              className="cursor-pointer flex between"
              onClick={() => filters.setAlbumId(null)}
            >
              Todos
            </Button>
            {albums.map((album) => (
              <div
                key={album.id}
                className={`${buttonVariants({
                  variant: filters.albumId === album.id ? 'primary' : 'ghost',
                  size: 'sm',
                  className: filters.albumId === album.id ? 'pr-0' : 'ghost'
                })} cursor-pointer`}
                onClick={() => filters.setAlbumId(album.id)}
              >
                <span>{album.title}</span>
                {filters.albumId === album.id && (
                  <AlbumEditDialog
                    albumId={album.id}
                    trigger={
                      <Button
                        key={album.id}
                        icon={BiCog}
                        size="sm"
                        className=
                        {filters.albumId === album.id
                          ? "bg-accent-brand-light hover:bg-accent-brand ml-0 pr-2 pl-1"
                          : "ml-0 pr-2 pl-1"
                        }
                      />
                    }
                  />
                )}
              </div>
            ))}
          </>
        ) : (
          Array.from({ length: 5 }).map((_, index) => (
            <Skeleton className="w-28 h-7" key={`album-button-loading-${index}`} />))
        )}
      </div>
    </div>
  )
}