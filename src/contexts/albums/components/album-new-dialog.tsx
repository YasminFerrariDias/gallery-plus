import React from "react";
import { Dialog, DialogBody, DialogHeader, DialogContent, DialogTrigger, DialogFooter, DialogClose } from "../../../components/dialog";
import Button from "../../../components/button";
import InputText from "../../../components/input-text";
import Text from "../../../components/text";
import SelectCheckboxIllustration from "../../../assets/images/select-checkbox.svg?react"
import { DialogDescription } from "@radix-ui/react-dialog";
import Skeleton from "../../../components/skeleton";
import PhotoImageSelectable from "../../photos/components/photo-image-selectable";
import usePhotos from "../../photos/hooks/use-photos";
import { useForm } from "react-hook-form";
import { albumNewFormSchema, type AlbumNewFormSchema } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";

interface AlbumNewDialogProps {
  trigger: React.ReactNode;
}

export default function AlbumNewDialog({ trigger }: AlbumNewDialogProps) {
  const [modalOpen, setModalOpen] = React.useState(false)
  const form = useForm<AlbumNewFormSchema>({
    resolver: zodResolver(albumNewFormSchema)
  });
  const { photos, isLoadingPhotos } = usePhotos()



  function handleTogglePhoto(selected: boolean, photoId: string) {
    console.log(selected, photoId)
  }

  function handleSubmit(payload: AlbumNewFormSchema) {
    console.log(payload);
  }

  React.useEffect(() => {
    if (!modalOpen) {
      form.reset()
    }
  }, [modalOpen, form])

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <DialogHeader>Criar álbum</DialogHeader>

          <DialogDescription>
            Preencha os dados para criar um novo álbum.
          </DialogDescription>

          <DialogBody className="flex flex-col gap-5">
            <InputText
              placeholder="Adicionar um título"
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
                    <PhotoImageSelectable
                      key={photo.id}
                      src={`${import.meta.env.VITE_IMAGES_URL}/${photo.imageId}`}
                      title={photo.title}
                      imageClassName="w-20 h-20"
                      onSelectImage={(selected) => handleTogglePhoto(selected, photo.id)}
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
              <Button variant="secondary">Cancelar</Button>
            </DialogClose>

            <Button type="submit">Criar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}