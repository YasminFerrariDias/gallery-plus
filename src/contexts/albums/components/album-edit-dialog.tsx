import React from "react";
import { Dialog, DialogBody, DialogHeader, DialogContent, DialogTrigger, DialogFooter, DialogClose } from "../../../components/dialog";
import Button from "../../../components/button";
import InputText from "../../../components/input-text";
import Text from "../../../components/text";
import SelectCheckboxIllustration from "../../../assets/images/select-checkbox.svg?react"
import Skeleton from "../../../components/skeleton";
import usePhotos from "../../photos/hooks/use-photos";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useAlbum from "../hooks/use-album";
import { albumEditFormSchema, type AlbumEditFormSchema } from "../schemas-edit";
import ImagePreview from "../../../components/image-preview";
import { toast } from "sonner";

interface AlbumEditDialogProps {
  trigger: React.ReactNode;
  albumId: string
}

export default function AlbumEditDialog({ trigger, albumId }: AlbumEditDialogProps) {

  const [modalOpen, setModalOpen] = React.useState(false)

  const { photos, isLoadingPhotos } = usePhotos()

  const { album, deleteAlbum, albumPhotosIds, editAlbum } = useAlbum(albumId)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableAlbumPhotosIds = React.useMemo(() => albumPhotosIds, [album?.id, album?.photos])

  const [isEditingAlbum, setIsEditingAlbum] = React.useTransition()
  const [idDeletingAlbum, setIsDeletingAlbum] = React.useTransition()

  const form = useForm<AlbumEditFormSchema>({
    resolver: zodResolver(albumEditFormSchema)
  });

  React.useEffect(() => {
    if (modalOpen && album) {
      form.reset({
        title: album.title,
        photosIds: stableAlbumPhotosIds
      })
    }
  }, [modalOpen, album, stableAlbumPhotosIds, form])

  function handleDeleteAlbum() {
    if (!album) {
      console.error("Álbum não encontrado");
      return;
    }
    setIsDeletingAlbum(async () => {
      await deleteAlbum(album.id)
      setModalOpen(false)
    })
  }

  React.useEffect(() => {
    if (!modalOpen) {
      form.reset()
    }
  }, [modalOpen, form])

  function handleSubmit(payload: AlbumEditFormSchema) {
    const changedData: Partial<AlbumEditFormSchema> = {}

    if (!albumId) {
      toast.error("ID da álbum não encontrado");
      return
    }

    if (payload.title !== album?.title) {
      changedData.title = payload.title
    }

    if (Object.keys(changedData).length === 0) {
      setModalOpen(false)
      return
    }

    setIsEditingAlbum(async () => {
      await editAlbum(albumId, changedData);
      setModalOpen(false)
    })
  }

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <DialogHeader>Editar álbum</DialogHeader>

          <DialogBody className="flex flex-col gap-5">
            <InputText
              error={form.formState.errors.title?.message}
              {...form.register("title")}
            />

            <div className="space-y-3">
              <Text as="div" variant="label-small">
                Fotos cadastradas
              </Text>

              {!isLoadingPhotos && photos.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {photos.map(photo => (
                    <ImagePreview
                      key={photo.id}
                      src={`${import.meta.env.VITE_IMAGES_URL}/${photo.imageId}`}
                      title={photo.title}
                      imageClassName="w-20 h-20"
                    />))}
                </div>
              )}

              {isLoadingPhotos && (
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 4 }).map((_, index) =>
                    <Skeleton
                      key={`photo-loading-${index}`}
                      className="w-20 h-20 rounded-lg"
                    />
                  )}
                </div>
              )}

              {!isLoadingPhotos && photos.length === 0 && (
                <div className="w-full flex flex-col justify-center items-center gap-3">
                  <SelectCheckboxIllustration />
                  <Text variant="paragraph-medium" className="text-center">
                    Nenhuma foto disponível para seleção
                  </Text>
                </div>
              )}
            </div>
          </DialogBody>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary" disabled={isEditingAlbum}>Cancelar</Button>
            </DialogClose>

            <Button
              className="bg-accent-red text-shadow-black hover:bg-accent-red-light"
              onClick={handleDeleteAlbum}
              disabled={idDeletingAlbum}>
              {idDeletingAlbum ? "Excluindo..." : "Excluir"}
            </Button>
            <Button
              type="submit"
              disabled={isEditingAlbum}
              handling={isEditingAlbum}>
              {isEditingAlbum ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
