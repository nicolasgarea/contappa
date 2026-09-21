import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import AddIcon from '@mui/icons-material/Add'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import {
  useCreateProduct,
  useDeleteProduct,
  useProductsByCategories,
  useUpdateProduct,
} from '@api/hooks/useProducts'
import { useCategories } from '@api/hooks/useCategories'
import { errorMessage } from '@api/client/errorMessage'
import type { Product } from '@api/__generated__'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'
import PageHeader from '@components/ui/PageHeader'
import SearchField from '@components/ui/SearchField'
import Chip, { ChipRow } from '@components/ui/Chip'
import ConfirmDialog from '@components/ui/ConfirmDialog'
import ProductImage from '@components/ui/ProductImage'
import { EmptyState, LoadingState } from '@components/ui/Feedback'
import { money } from '@lib/money'
import ProductForm, { ProductFormInputs } from './components/ProductForm'
import PriceCell from './components/PriceCell'
import ProductHero from '@components/Product/ProductHero'
import ProductStats from '@components/Product/ProductStats'

type SortKey = 'name' | 'category' | 'price'
type Sort = { key: SortKey; direction: 'asc' | 'desc' }

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin-bottom: 1.25rem;
  background-color: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.lg};

  @media (max-width: 800px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
  padding: 0.875rem 1.25rem;
  border-right: 1px solid ${({ theme }) => theme.color.border};

  &:last-child {
    border-right: none;
  }
`

const StatLabel = styled.span`
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.color.textMuted};
`

const StatValue = styled.span`
  font-size: ${({ theme }) => theme.font.size.xl};
  font-weight: 700;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  small {
    margin-left: 0.375rem;
    font-size: ${({ theme }) => theme.font.size.sm};
    font-weight: 500;
    letter-spacing: 0;
    color: ${({ theme }) => theme.color.textSubtle};
  }
`

const Workspace = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 380px;
  gap: 1.25rem;
  align-items: start;

  @media (max-width: 1100px) {
    grid-template-columns: minmax(0, 1fr);
  }
`

const Side = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  position: sticky;
  top: 1.5rem;

  @media (max-width: 1100px) {
    display: none;
  }
`

const SideActions = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 0.5rem;
`

const TableCard = styled.div`
  background-color: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
`

const Scroller = styled.div`
  overflow-x: auto;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${({ theme }) => theme.font.size.base};
`

const HeadCell = styled.th<{ $align?: 'right'; $hideOnSmall?: boolean }>`
  @media (max-width: 700px) {
    display: ${({ $hideOnSmall }) => ($hideOnSmall ? 'none' : 'table-cell')};
  }

  padding: 0;
  text-align: ${({ $align }) => $align ?? 'left'};
  background-color: ${({ theme }) => theme.color.surfaceAlt};
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
  white-space: nowrap;
`

const SortButton = styled.button<{ $active: boolean; $align?: 'right' }>`
  display: inline-flex;
  flex-direction: ${({ $align }) => ($align === 'right' ? 'row-reverse' : 'row')};
  align-items: center;
  gap: 0.25rem;
  width: 100%;
  justify-content: flex-start;
  padding: 0.6875rem 1.25rem;
  border: none;
  background: none;
  font-size: ${({ theme }) => theme.font.size.xs};
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme, $active }) => ($active ? theme.color.text : theme.color.textMuted)};

  svg {
    font-size: 0.9375rem;
    opacity: ${({ $active }) => ($active ? 1 : 0)};
  }

  &:hover {
    color: ${({ theme }) => theme.color.text};
  }

  &:hover svg {
    opacity: ${({ $active }) => ($active ? 1 : 0.4)};
  }
`

const PlainHead = styled.span`
  display: block;
  padding: 0.6875rem 1.25rem;
  font-size: ${({ theme }) => theme.font.size.xs};
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.textMuted};
`

const Row = styled.tr<{ $selected: boolean }>`
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transition.fast};
  background-color: ${({ theme, $selected }) =>
    $selected ? theme.color.accent.soft : 'transparent'};
  box-shadow: ${({ theme, $selected }) =>
    $selected ? `inset 3px 0 0 ${theme.color.accent[500]}` : 'none'};

  &:hover {
    background-color: ${({ theme, $selected }) =>
      $selected ? theme.color.accent.soft : theme.color.surfaceAlt};
  }

  &:hover .row-actions {
    opacity: 1;
  }

  &:not(:last-child) td {
    border-bottom: 1px solid ${({ theme }) => theme.color.border};
  }
`

const Cell = styled.td<{ $align?: 'right'; $hideOnSmall?: boolean }>`
  padding: 0.4375rem 1.25rem;
  text-align: ${({ $align }) => $align ?? 'left'};
  vertical-align: middle;

  @media (max-width: 700px) {
    display: ${({ $hideOnSmall }) => ($hideOnSmall ? 'none' : 'table-cell')};
    padding: 0.4375rem 0.875rem;
  }
`

const ProductCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  min-width: 0;
`

const Thumb = styled.span`
  position: relative;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radius.sm};
  background-color: ${({ theme }) => theme.color.sunken};
  color: ${({ theme }) => theme.color.borderStrong};

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const ProductName = styled.span`
  font-weight: 600;
`

const Actions = styled.div`
  display: inline-flex;
  gap: 0.25rem;
  opacity: 0.35;
  transition: opacity ${({ theme }) => theme.transition.fast};
`

const IconButton = styled.button<{ $danger?: boolean }>`
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radius.sm};
  background-color: transparent;
  color: ${({ theme }) => theme.color.textMuted};
  transition: all ${({ theme }) => theme.transition.fast};

  svg {
    font-size: 1.125rem;
  }

  &:hover {
    background-color: ${({ theme, $danger }) =>
      $danger ? theme.color.danger.soft : theme.color.sunken};
    border-color: ${({ theme, $danger }) =>
      $danger ? theme.color.danger.line : theme.color.border};
    color: ${({ theme, $danger }) => ($danger ? theme.color.danger.base : theme.color.text)};
  }
`

const Footer = styled.div`
  padding: 0.75rem 1.25rem;
  border-top: 1px solid ${({ theme }) => theme.color.border};
  background-color: ${({ theme }) => theme.color.surfaceAlt};
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.color.textMuted};
  font-variant-numeric: tabular-nums;
`

export default function ProductsPage() {
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(false)
  const [categoryId, setCategoryId] = useState('all')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<Sort>({ key: 'category', direction: 'asc' })
  const [deleting, setDeleting] = useState<Product | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const { data: categories, isLoading: loadingCategories } = useCategories()

  const selectableCategories = useMemo(
    () =>
      (categories ?? []).filter(
        (category): category is { id: string; name: string; description?: string } =>
          !!category.id && !!category.name,
      ),
    [categories],
  )

  const categoryIds = useMemo(
    () => selectableCategories.map((category) => category.id),
    [selectableCategories],
  )
  const { products, isLoading: loadingProducts } = useProductsByCategories(categoryIds)

  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const deleteProduct = useDeleteProduct()

  const categoryName = useMemo(() => {
    const names = new Map(selectableCategories.map((category) => [category.id, category.name]))
    return (id?: string) => names.get(id ?? '') ?? '—'
  }, [selectableCategories])

  const rows = useMemo(() => {
    const term = query.trim().toLowerCase()
    const direction = sort.direction === 'asc' ? 1 : -1

    return products
      .filter((product) => categoryId === 'all' || product.categoryId === categoryId)
      .filter((product) => !term || (product.name ?? '').toLowerCase().includes(term))
      .sort((a, b) => {
        if (sort.key === 'price') return ((a.price ?? 0) - (b.price ?? 0)) * direction
        if (sort.key === 'category') {
          const byCategory = categoryName(a.categoryId).localeCompare(categoryName(b.categoryId))
          return (byCategory || (a.name ?? '').localeCompare(b.name ?? '')) * direction
        }
        return (a.name ?? '').localeCompare(b.name ?? '') * direction
      })
  }, [products, categoryId, query, sort, categoryName])

  const summary = useMemo(() => {
    if (products.length === 0) return null
    const byPrice = [...products].sort((a, b) => (a.price ?? 0) - (b.price ?? 0))
    return {
      average: products.reduce((sum, product) => sum + (product.price ?? 0), 0) / products.length,
      cheapest: byPrice[0],
      priciest: byPrice[byPrice.length - 1],
    }
  }, [products])

  const selected = rows.find((product) => product.id === selectedId) ?? rows[0]

  const openOrSelect = (product: Product) => {
    if (window.matchMedia('(max-width: 1100px)').matches) {
      navigate(`/products/${product.id}`)
      return
    }
    setSelectedId(product.id ?? null)
  }

  const toggleSort = (key: SortKey) =>
    setSort((current) =>
      current.key === key
        ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' },
    )

  const sortIcon = (key: SortKey) =>
    sort.key === key && sort.direction === 'desc' ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />

  const handleCreateProduct = (data: ProductFormInputs) => {
    if (!data.categoryId) return
    createProduct.mutate(data, { onSuccess: () => setShowForm(false) })
  }

  if (loadingCategories) return <LoadingState label="Loading menu" />

  return (
    <>
      <PageHeader
        title="Products"
        subtitle={`${products.length} products in ${selectableCategories.length} categories`}
        actions={
          <>
            <SearchField
              width="260px"
              placeholder="Search products"
              value={query}
              onChange={setQuery}
            />
            <Button
              icon={<AddIcon />}
              disabled={selectableCategories.length === 0}
              onClick={() => setShowForm(true)}
            >
              New product
            </Button>
          </>
        }
      />

      {selectableCategories.length === 0 ? (
        <EmptyState
          icon={<RestaurantMenuIcon />}
          title="No categories yet"
          description="Products live inside a category. Create one first and the menu will show up here."
          action={
            <Button
              variant="secondary"
              onClick={() => navigate('/categories')}
            >
              Go to categories
            </Button>
          }
        />
      ) : (
        <>
          {summary && (
            <Stats>
              <Stat>
                <StatLabel>Products</StatLabel>
                <StatValue>{products.length}</StatValue>
              </Stat>
              <Stat>
                <StatLabel>Average price</StatLabel>
                <StatValue>{money(summary.average)}</StatValue>
              </Stat>
              <Stat>
                <StatLabel>Lowest price</StatLabel>
                <StatValue>
                  {money(summary.cheapest.price)}
                  <small>{summary.cheapest.name}</small>
                </StatValue>
              </Stat>
              <Stat>
                <StatLabel>Highest price</StatLabel>
                <StatValue>
                  {money(summary.priciest.price)}
                  <small>{summary.priciest.name}</small>
                </StatValue>
              </Stat>
            </Stats>
          )}

          <ChipRow style={{ marginBottom: '1rem' }}>
            <Chip
              active={categoryId === 'all'}
              count={products.length}
              onClick={() => setCategoryId('all')}
            >
              All
            </Chip>
            {selectableCategories.map((category) => (
              <Chip
                key={category.id}
                active={categoryId === category.id}
                count={products.filter((product) => product.categoryId === category.id).length}
                onClick={() => setCategoryId(category.id)}
              >
                {category.name}
              </Chip>
            ))}
          </ChipRow>

          {loadingProducts ? (
            <LoadingState label="Loading products" />
          ) : rows.length === 0 ? (
            <EmptyState
              icon={<RestaurantMenuIcon />}
              title="Nothing matches"
              description="Try another category or clear the search."
            />
          ) : (
            <Workspace>
              <TableCard>
                <Scroller>
                  <Table>
                    <thead>
                      <tr>
                        <HeadCell style={{ width: '46%' }}>
                          <SortButton
                            type="button"
                            $active={sort.key === 'name'}
                            onClick={() => toggleSort('name')}
                          >
                            Product
                            {sortIcon('name')}
                          </SortButton>
                        </HeadCell>
                        <HeadCell $hideOnSmall>
                          <SortButton
                            type="button"
                            $active={sort.key === 'category'}
                            onClick={() => toggleSort('category')}
                          >
                            Category
                            {sortIcon('category')}
                          </SortButton>
                        </HeadCell>
                        <HeadCell $align="right">
                          <SortButton
                            type="button"
                            $align="right"
                            $active={sort.key === 'price'}
                            onClick={() => toggleSort('price')}
                          >
                            Price
                            {sortIcon('price')}
                          </SortButton>
                        </HeadCell>
                        <HeadCell
                          $align="right"
                          $hideOnSmall
                        >
                          <PlainHead>Actions</PlainHead>
                        </HeadCell>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((product) => (
                        <Row
                          key={product.id}
                          $selected={product.id === selected?.id}
                          onClick={() => openOrSelect(product)}
                          onDoubleClick={() => navigate(`/products/${product.id}`)}
                        >
                          <Cell>
                            <ProductCell>
                              <Thumb>
                                <ProductImage
                                  src={product.imageUrl}
                                  alt=""
                                />
                              </Thumb>
                              <ProductName>{product.name}</ProductName>
                            </ProductCell>
                          </Cell>
                          <Cell $hideOnSmall>
                            <Badge>{categoryName(product.categoryId)}</Badge>
                          </Cell>
                          <Cell $align="right">
                            <PriceCell
                              price={product.price ?? 0}
                              isSaving={updateProduct.isLoading}
                              onSave={(price) =>
                                updateProduct.mutate({
                                  categoryId: product.categoryId!,
                                  productId: product.id!,
                                  productData: { price },
                                })
                              }
                            />
                          </Cell>
                          <Cell
                            $align="right"
                            $hideOnSmall
                          >
                            <Actions className="row-actions">
                              <IconButton
                                type="button"
                                aria-label={`Edit ${product.name}`}
                                onClick={(event) => {
                                  event.stopPropagation()
                                  navigate(`/products/${product.id}`)
                                }}
                              >
                                <EditOutlinedIcon />
                              </IconButton>
                              <IconButton
                                type="button"
                                $danger
                                aria-label={`Delete ${product.name}`}
                                onClick={(event) => {
                                  event.stopPropagation()
                                  setDeleting(product)
                                }}
                              >
                                <DeleteOutlineIcon />
                              </IconButton>
                            </Actions>
                          </Cell>
                        </Row>
                      ))}
                    </tbody>
                  </Table>
                </Scroller>
                <Footer>
                  Showing {rows.length} of {products.length} products · click a price to change it
                </Footer>
              </TableCard>

              {selected && (
                <Side>
                  <ProductHero
                    key={selected.id}
                    name={selected.name ?? ''}
                    price={selected.price ?? 0}
                    category={categoryName(selected.categoryId)}
                    imageUrl={selected.imageUrl}
                    ratio="4 / 3"
                  />
                  <ProductStats productId={selected.id} />
                  <SideActions>
                    <Button
                      variant="danger"
                      icon={<DeleteOutlineIcon />}
                      onClick={() => setDeleting(selected)}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="ink"
                      fullWidth
                      onClick={() => navigate(`/products/${selected.id}`)}
                    >
                      Edit product
                      <ArrowForwardIcon />
                    </Button>
                  </SideActions>
                </Side>
              )}
            </Workspace>
          )}
        </>
      )}

      {deleting && (
        <ConfirmDialog
          title={`Delete ${deleting.name}?`}
          description="It disappears from the menu and can no longer be added to bills."
          confirmLabel="Delete product"
          isWorking={deleteProduct.isLoading}
          error={deleteProduct.isError ? errorMessage(deleteProduct.error) : null}
          onClose={() => {
            deleteProduct.reset()
            setDeleting(null)
          }}
          onConfirm={() =>
            deleteProduct.mutate(
              { productId: deleting.id!, categoryId: deleting.categoryId! },
              { onSuccess: () => setDeleting(null) },
            )
          }
        />
      )}

      {showForm && (
        <ProductForm
          categories={selectableCategories}
          selectedCategoryId={
            categoryId === 'all' ? (selectableCategories[0]?.id ?? '') : categoryId
          }
          isSubmitting={createProduct.isLoading}
          onClose={() => setShowForm(false)}
          onSubmit={handleCreateProduct}
        />
      )}
    </>
  )
}
