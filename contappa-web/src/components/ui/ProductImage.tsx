import { useState } from 'react'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'

type ProductImageProps = {
  src?: string | null
  alt: string
}

export default function ProductImage({ src, alt }: ProductImageProps) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) return <RestaurantMenuIcon />

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}
