import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../../../helpers/api";

export default function useAlbums() {
  const {data: albuns, isLoading} = useQuery({
    queryKey: ["albums"],
    queryFn: () => fetcher("/albums")
  })

  return {
    albums: albuns || [],
    isLoadingAlbums: isLoading,
  }
}