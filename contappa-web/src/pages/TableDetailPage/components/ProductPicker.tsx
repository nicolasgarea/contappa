import { useMemo, useState } from 'react'
import styled from 'styled-components'
import AddIcon from '@mui/icons-material/Add'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import type { Category, Product } from '@api/__generated__'
import SearchField from '@components/ui/SearchField'
import Chip, { ChipRow } from '@components/ui/Chip'
import { EmptyState } from '@components/ui/Feedback'
import ProductImage from '@components/ui/ProductImage'
import { money } from '@lib/money'

type ProductPickerProps = {
  categories: Category[]
  products: Product[]
  onAdd: (product: Product) => void
}

const Panel = styled.section`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
`

const Toolbar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(158px, 1fr));
  grid-auto-rows: max-content;
  gap: 0.875rem;
  padding: 1rem;
  height: calc(100vh - 21.5rem);
  min-height: 360px;
  overflow-y: auto;
  align-content: start;

  @media (max-width: 1100px) {
    height: auto;
    min-height: 0;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    padding: 0.75rem;
  }
`

const Tile = styled.button`
  position: relative;
  display: flex;
  flex-direction: column;
  text-align: left;
  padding: 0;
  background-color: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  transition: all ${({ theme }) => theme.transition.fast};

  &:hover {
    border-color: ${({ theme }) => theme.color.accent.line};
    box-shadow: ${({ theme }) => theme.shadow.md};
  }

  &:hover .add-pill {
    opacity: 1;
    transform: scale(1);
  }
`

const Thumb = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  flex-shrink: 0;
  overflow: hidden;
  display: grid;
  place-items: center;
  background-color: ${({ theme }) => theme.color.sunken};
  color: ${({ theme }) => theme.color.textSubtle};

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  svg {
    font-size: 1.75rem;
  }
`

const AddPill = styled.span`
  position: absolute;
  right: 0.5rem;
  bottom: 0.5rem;
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.color.accent[500]};
  color: ${({ theme }) => theme.color.accent.ink};
  opacity: 0;
  transform: scale(0.8);
  transition: all ${({ theme }) => theme.transition.fast};

  svg {
    font-size: 1.125rem;
  }
`

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  flex: 1;
  padding: 0.625rem 0.75rem 0.75rem;
`

const Name = styled.span`
  font-size: ${({ theme }) => theme.font.size.base};
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const Price = styled.span`
  font-size: ${({ theme }) => theme.font.size.base};
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.color.textMuted};
`

export default function ProductPicker({ categories, products, onAdd }: ProductPickerProps) {
  const [query, setQuery] = useState('')
  const [categoryId, setCategoryId] = useState<string>('all')

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase()
    return products.filter((product) => {
      const matchesCategory = categoryId === 'all' || product.categoryId === categoryId
      const matchesQuery = !term || (product.name ?? '').toLowerCase().includes(term)
      return matchesCategory && matchesQuery
    })
  }, [products, query, categoryId])

  return (
    <Panel>
      <Toolbar>
        <SearchField
          placeholder="Search the menu"
          value={query}
          onChange={setQuery}
        />
        <ChipRow>
          <Chip
            active={categoryId === 'all'}
            onClick={() => setCategoryId('all')}
          >
            All
          </Chip>
          {categories.map((category) => (
            <Chip
              key={category.id}
              active={categoryId === category.id}
              onClick={() => setCategoryId(category.id!)}
            >
              {category.name}
            </Chip>
          ))}
        </ChipRow>
      </Toolbar>

      {visible.length === 0 ? (
        <EmptyState
          icon={<RestaurantMenuIcon />}
          title="Nothing on the menu here"
          description="Try another category, or clear the search."
        />
      ) : (
        <Grid>
          {visible.map((product) => (
            <Tile
              key={product.id}
              type="button"
              onClick={() => onAdd(product)}
            >
              <Thumb>
                <ProductImage
                  src={product.imageUrl}
                  alt={product.name ?? ''}
                />
                <AddPill className="add-pill">
                  <AddIcon />
                </AddPill>
              </Thumb>
              <Info>
                <Name title={product.name}>{product.name}</Name>
                <Price>{money(product.price)}</Price>
              </Info>
            </Tile>
          ))}
        </Grid>
      )}
    </Panel>
  )
}
