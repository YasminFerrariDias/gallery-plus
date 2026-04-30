import { toast } from "sonner";
import type { AlbumNewFormSchema } from "../schemas";
import { api, fetcher } from "../../../helpers/api";
import type { Album } from "../models/album";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import usePhotos from "../../photos/hooks/use-photos";
import usePhotoAlbums from "../../photos/hooks/use-photo-albums";
import { useNavigate } from "react-router";

interface AlbumDetailsResponse extends Album {}

export default function useAlbum(id?: string) {
  const navigate = useNavigate()
  const { data } = useQuery<AlbumDetailsResponse>({
    queryKey: ["album", id],
    queryFn: () => fetcher(`/albums/${id}`),
    enabled: !!id,
  })

  const queryClient = useQueryClient();
  const { photos } = usePhotos();
  const { managePhotoOnAlbum } = usePhotoAlbums()

  async function createAlbum(payload: AlbumNewFormSchema) {
    try {
      const { data: album } = await api.post<Album>("/albums", {
        title: payload.title
      });

      if (payload.photosIds && payload.photosIds.length > 0) {
        await Promise.all(
          payload.photosIds.map(photoId => {
            const photosAlbumsIds =
              photos
                .find(photo => photo.id === photoId)
                ?.albums?.map(album => album.id) || [];

            return managePhotoOnAlbum(photoId, [...photosAlbumsIds, album.id])
          })
        );
      }

      queryClient.invalidateQueries({ queryKey: ["albums"] })
      queryClient.invalidateQueries({ queryKey: ["photos"] })

      toast.success("Álbum criado com sucesso")
    } catch (error) {
      toast.error("Erro ao criar álbum")
      throw error;
    }
  }

  async function deleteAlbum(albumId: string) {
    try {
      await api.delete(`/albums/${albumId}`)

      queryClient.invalidateQueries({ queryKey: ["albums"]})

      toast.success("Álbum excluído com sucesso")
      navigate("/")
    } catch (error) {
      toast.error("Erro ao excluir álbum");
      throw error;
    }
  }

  return {
    album: data,
    createAlbum,
    deleteAlbum,
  }
}