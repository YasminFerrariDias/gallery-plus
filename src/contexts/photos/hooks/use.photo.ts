import { useQuery } from "@tanstack/react-query";
import type { Photo } from "../models/foto";
import { fetcher } from "../../../helpers/api";

interface PhotoDetailsResponse extends Photo {
  nextPhotoId?: string
  previousPhotoId?: string
}

export default function usePhoto(id?: string) {
  const {data,isLoading} = useQuery<PhotoDetailsResponse>({
    queryKey: ["photo", id],
    queryFn: () => fetcher(`/photos/${id}`),
    enabled: !!id,
  });

  return {
    photo: data,
    nextPhotoId: data?.nextPhotoId,
    previousPhotoId: data?.previousPhotoId,
    isLoadingPhoto: isLoading,
  }
}