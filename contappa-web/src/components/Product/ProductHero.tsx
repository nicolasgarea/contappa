import { useState } from 'react'
import styled from 'styled-components'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import { money } from '@lib/money'

type ProductHeroProps = {
  name: string
  price: number
  category?: string
  imageUrl?: string | null
  ratio?: string
}

const Frame = styled.figure<{ $ratio: string }>`
  position: relative;
  margin: 0;
  width: 100%;
  aspect-ratio: ${({ $ratio }) => $ratio};
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radius.lg};
  background-color: #14181f;
  color: rgba(255, 255, 255, 0.28);
  display: grid;
  place-items: center;
  isolation: isolate;

  > svg {
    font-size: 4rem;
  }

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    background: linear-gradient(
      180deg,
      rgba(10, 12, 16, 0) 28%,
      rgba(10, 12, 16, 0.55) 62%,
      rgba(10, 12, 16, 0.92) 100%
    );
  }
`

const Caption = styled.figcaption`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  padding: clamp(1rem, 3vw, 1.75rem);
  color: #fff;
`

const Heading = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  min-width: 0;
`

const Tag = styled.span`
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: 600;
  opacity: 0.85;
`

const Name = styled.h1`
  font-size: clamp(1.375rem, 3.2vw, 2.25rem);
  font-weight: 800;
  letter-spacing: -0.035em;
  line-height: 1.05;
  overflow-wrap: anywhere;
`

const Price = styled.span`
  font-family: ${({ theme }) => theme.font.heading};
  flex-shrink: 0;
  font-size: clamp(1.25rem, 2.6vw, 1.875rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
`

export default function ProductHero({
  name,
  price,
  category,
  imageUrl,
  ratio = '16 / 10',
}: ProductHeroProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null)
  const showImage = !!imageUrl && failedUrl !== imageUrl

  return (
    <Frame $ratio={ratio}>
      {showImage ? (
        <img
          src={imageUrl}
          alt=""
          onError={() => setFailedUrl(imageUrl)}
        />
      ) : (
        <RestaurantMenuIcon />
      )}
      <Caption>
        <Heading>
          {category && <Tag>{category}</Tag>}
          <Name>{name || 'Untitled product'}</Name>
        </Heading>
        <Price>{money(price)}</Price>
      </Caption>
    </Frame>
  )
}
