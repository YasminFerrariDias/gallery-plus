import React from "react";
import { useParams } from "react-router";
import Container from "../components/container";
import Text from "../components/text";
import Skeleton from "../components/skeleton";
import PhotosNavigator from "../contexts/photos/components/photos-navigator";
import ImagePreview from "../components/image-preview";
import Button from "../components/button";
import AlbumsListSelectable from "../contexts/albums/components/albums-list-selectable";
import useAlbums from "../contexts/albums/hooks/use-albums";
import usePhoto from "../contexts/photos/hooks/use-photo";
import type { Photo } from "../contexts/photos/models/photo";
import PhotoEditDialog from "../contexts/photos/components/photo-edit-dialog";

export default function PagePhotoDetails() {
  const { id } = useParams();
  const { photo, previousPhotoId, nextPhotoId, isLoadingPhoto, deletePhoto, /*editPhoto*/ } = usePhoto(id)
  const { albums, isLoadingAlbums } = useAlbums();
  const [isDeletingPhoto, setIsDeletingPhoto] = React.useTransition()
  const [isEditingPhoto, /*setIsEditingPhoto*/] = React.useTransition()

  function handleDeletePhoto() {
    setIsDeletingPhoto(async () => {
      await deletePhoto(photo!.id);
    })
  }

  /*function handleEditPhoto() {
    setIsEditingPhoto(async () => {
      await editPhoto(photo!.id, {
        title: "Novo título da foto",
      });
    })
  }*/

  if (!isLoadingAlbums && !photo) {
    return <div>Foto não encontra!</div>
  }

  return (
    <Container>
      <header className="flex items-center justify-between gap-8 mb-8">
        {!isLoadingPhoto ? (
          <Text as="h2" variant="heading-large">{photo?.title}</Text>
        ) : (
          <Skeleton className="w-48 h-8" />
        )}

        <PhotosNavigator
          previousPhotoId={previousPhotoId}
          nextPhotoId={nextPhotoId}
          loading={isLoadingPhoto}
        />
      </header>

      <div className="grid grid-cols-[21rem_1fr] gap-24">
        <div className="space-y-3">

          {!isLoadingPhoto ? (
            <ImagePreview
              src={`${import.meta.env.VITE_IMAGES_URL}/${photo?.imageId}`}
              title={photo?.title}
              imageClassName="h-[21rem]"
            />
          ) : (
            <Skeleton
              className="h-84"
            />
          )}

          {!isLoadingPhoto ? (
            <div className="flex gap-3">
              <Button
                variant="destructive"
                onClick={handleDeletePhoto}
                disabled={isDeletingPhoto}>
                {isDeletingPhoto ? "Excluindo..." : "Excluir"}
              </Button>

              <PhotoEditDialog
                trigger={
                  <Button
                    variant="edit"
                    disabled={isEditingPhoto}>
                    {isEditingPhoto ? <></> : "Editar"}
                  </Button>
                }
              />
            </div>
          ) : (
            <>
              <Skeleton className="w-20 h-10" />
              <Skeleton className="w-20 h-10" />
            </>
          )}
        </div>

        <div className="py-3">
          <Text as="h3" variant="heading-medium" className="mb-6">
            Álbuns
          </Text>

          <AlbumsListSelectable
            photo={photo as Photo}
            albums={albums}
            loading={isLoadingAlbums}
          />
        </div>
      </div>
    </Container>
  )
}