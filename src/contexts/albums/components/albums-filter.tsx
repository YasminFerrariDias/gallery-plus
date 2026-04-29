import Button from "../../../components/button";
import Skeleton from "../../../components/skeleton";
import Text from "../../../components/text";
import usePhotos from "../../photos/hooks/use-photos";
import type { Album } from "../models/album";
import SpinnerIcon from "../../../assets/icons/spinner.svg?react";
import cx from "classnames"
import Icon from "../../../components/icon";

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
              className="cursor-pointer"
              onClick={() => filters.setAlbumId(null)}
            >
              Todos
            </Button>
            {albums.map((album) => (
              <Button
                key={album.id}
                variant={filters.albumId === album.id ? 'primary' : 'ghost'}
                size="sm"
                className="cursor-pointer"
                onClick={() => filters.setAlbumId(album.id)}
              >
                <div>
                  <span>{album.title}</span>
                  
                    <div>
                      <Icon svg={SpinnerIcon} className="w-4 h-4" />
                    </div>
                 
                </div>
              </Button>
            ))}</>
        ) : (
          Array.from({ length: 5 }).map((_, index) => (
            <Skeleton className="w-28 h-7" key={`album-button-loading-${index}`} />))
        )}
      </div>
    </div>
  )
}