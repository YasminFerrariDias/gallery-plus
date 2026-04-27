import type React from "react";
import { tv } from 'tailwind-variants'

export const imageFilePreviewVariants = tv({
  base: `
    rounded-lg overflow-hidden
  `
})

export const imageFilePreviewImageVariant = tv({
  base: `
    w-full h-full object-cover
  `
})

interface ImageFilePreviewProps extends React.ComponentProps<"img"> {
  imageClassName?: string;
}

export default function ImageFilePreview({
  className,
  imageClassName,
  ...props
}: ImageFilePreviewProps) {
  return (
    <div className={imageFilePreviewVariants({ className })}>
      <img
        className={imageFilePreviewImageVariant({className: imageClassName})}
        {...props} 
      />
    </div>
  )
}