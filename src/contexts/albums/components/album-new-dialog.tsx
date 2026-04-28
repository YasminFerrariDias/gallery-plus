import type React from "react";
import { Dialog, DialogBody, DialogHeader, DialogContent, DialogTrigger, DialogFooter, DialogClose } from "../../../components/dialog";
import Button from "../../../components/button";
import InputText from "../../../components/input-text";
import Text from "../../../components/text";
import type { Photo } from "../../photos/models/foto";
import SelectCheckboxIllustration from "../../../assets/images/select-checkbox.svg?react"
import { DialogDescription } from "@radix-ui/react-dialog";
import Skeleton from "../../../components/skeleton";
import ImagePreview from "../../../components/image-preview";

interface AlbumNewDialogProps {
  trigger: React.ReactNode;
}

export default function AlbumNewDialog({ trigger }: AlbumNewDialogProps) {
  const isLoadingPhotos = false
  const photos: Photo[] = [
    {
      id: '123',
      title: "Olá mundo!",
      imageId: "portrait-tower.png",
      albums: [
        { id: " 3421", title: "Album 1" },
        { id: " 3426", title: "Album 2" },
        { id: " 3341", title: "Album 3" }
      ]
    },
    {
      id: '123',
      title: "Olá mundo!",
      imageId: "portrait-tower.png",
      albums: [
        { id: " 3421", title: "Album 1" },
        { id: " 3426", title: "Album 2" },
        { id: " 3341", title: "Album 3" }
      ]
    }
  ]

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>Criar álbum</DialogHeader>

        <DialogDescription>
          Preencha os dados para criar um novo álbum.
        </DialogDescription>

        <DialogBody className="flex flex-col gap-5">
          <InputText placeholder="Adicionar um título" />

          <div className="space-y-3">
            <Text as="div" variant="label-small">
              Fotos cadastradas
            </Text>

            {!isLoadingPhotos && photos.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {photos.map(photo => <ImagePreview 
                  key={photo.id}
                  src={`/images/${photo.imageId}`}
                  title={photo.title}
                  className="w-20 h-20 rounded"
                />)}
              </div>
            )}

            {isLoadingPhotos && (
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 4 }).map((_, index) =>
                  <Skeleton
                    key={`photo-loading-${index}`}
                    className="w-20 h-20 rounded"
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

          <Button>Criar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}