import { useForm } from "react-hook-form";
import Button from "../../../components/button";
import { Dialog, DialogBody, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "../../../components/dialog";
import ImagePreview from "../../../components/image-preview";
import InputText from "../../../components/input-text";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import usePhoto from "../hooks/use-photo";
import { useParams } from "react-router";
import { photoEditFormSchema, type PhotoEditFormSchema } from "../schemas-edit";
import { toast } from "sonner";

interface PhotoNewDialogProps {
  trigger: React.ReactNode;
}

export default function PhotoEditDialog({ trigger }: PhotoNewDialogProps) {
  const { id } = useParams();
  const [modalOpen, setModalOpen] = React.useState(false)
  const form = useForm<PhotoEditFormSchema>({
    resolver: zodResolver(photoEditFormSchema)
  });

  const { editPhoto, photo } = usePhoto(id)
  const [isEditingPhoto, setIsEditingPhoto] = React.useTransition()

  React.useEffect(() => {
    if (modalOpen && photo) {
      form.reset({
        title: photo.title,
      })
    }
  }, [modalOpen, photo, form])

  function handleSubmit(payload: PhotoEditFormSchema) {
    const changedData: Partial<PhotoEditFormSchema> = {}

    if (!id) {
      toast.error("ID da foto não encontrado");
      return
    }

    if (payload.title !== photo?.title) {
      changedData.title = payload.title
    }

    if (Object.keys(changedData).length === 0) {
      setModalOpen(false)
      return
    }

    setIsEditingPhoto(async () => {
      await editPhoto(id, changedData);
      setModalOpen(false)
    })
  }

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        {trigger && typeof trigger === 'object' && 'props' in trigger
          ? trigger
          : <span>{trigger}</span>}
      </DialogTrigger>

      <DialogContent>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <DialogHeader>Editar foto</DialogHeader>

          <DialogBody className="flex flex-col gap-5">
            <InputText
              maxLength={255}
              error={form.formState.errors.title?.message}
              {...form.register("title")}
            />

            <ImagePreview
              src={`${import.meta.env.VITE_IMAGES_URL}/${photo?.imageId}`}
              className='w-full h-56'
            />
          </DialogBody>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary" disabled={isEditingPhoto}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isEditingPhoto} handling={isEditingPhoto}>
              {isEditingPhoto ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}