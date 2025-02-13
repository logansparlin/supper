import { urlFor } from "@/sanity/lib/image";
import { useMemo, type FC } from "react";

interface ImageProps {
  image: any
  alt?: string
  className?: string
  quality?: number
  sizes?: string
}

export const Image: FC<ImageProps> = ({ image, quality = 90, alt, className, sizes = 'auto' }) => {
  const deviceSizes = [320, 480, 768, 1024, 1280, 1536]

  const initialSrc = useMemo(() => {
    if (!image) return '';
    return urlFor(image).width(320).format('webp').quality(quality).url()
  }, [image, quality])

  const srcSet = useMemo(() => {
    if (!image) return '';
    return deviceSizes.map(size => `${urlFor(image).width(size).format('webp').quality(quality).url()} ${size}w`).join(', ')
  }, [image, quality])

  return (
    <img
      src={image?.lqip ?? initialSrc}
      srcSet={srcSet}
      alt={alt}
      className={className}
      sizes={sizes}
    />
  )
}