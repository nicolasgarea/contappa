import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled, { css } from 'styled-components'
import AddIcon from '@mui/icons-material/Add'
import CategoryIcon from '@mui/icons-material/Category'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { useCategories, useDeleteCategory } from '@api/hooks/useCategories'
import { useCreateProduct, useProductsByCategories } from '@api/hooks/useProducts'
import { errorMessage } from '@api/client/errorMessage'
import Button from '@components/ui/Button'
import PageHeader from '@components/ui/PageHeader'
import ConfirmDialog from '@components/ui/ConfirmDialog'
import ProductImage from '@components/ui/ProductImage'
import { EmptyState, LoadingState } from '@components/ui/Feedback'
import ProductForm from '@pages/ProductsPage/components/ProductForm'
import { money } from '@lib/money'
import CategoryForm, { EditableCategory } from './components/CategoryForm'

const Workspace = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 400px;
  gap: 1.25rem;
  align-items: start;

  @media (max-width: 1100px) {
    grid-template-columns: minmax(0, 1fr);
  }
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
`

const Card = styled.button<{ $selected: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 0;
  text-align: left;
  background-color: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  transition:
    border-color ${({ theme }) => theme.transition.fast},
    box-shadow ${({ theme }) => theme.transition.fast};

  &:hover {
    border-color: ${({ theme }) => theme.color.borderStrong};
    box-shadow: ${({ theme }) => theme.shadow.md};
  }

  ${({ theme, $selected }) =>
    $selected &&
    css`
      border-color: ${theme.color.text};
      box-shadow: inset 0 0 0 1px ${theme.color.text};

      &:hover {
        border-color: ${theme.color.text};
        box-shadow: inset 0 0 0 1px ${theme.color.text};
      }
    `}
`

const Mosaic = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 2px;
  width: 100%;
  aspect-ratio: 2 / 1;
  background-color: ${({ theme }) => theme.color.border};
`

const MosaicCell = styled.div<{ $lead?: boolean }>`
  position: relative;
  display: grid;
  place-items: center;
  overflow: hidden;
  grid-row: ${({ $lead }) => ($lead ? '1 / span 2' : 'auto')};
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

const CardBody = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
  padding: 0.875rem 1rem 1rem;
`

const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
`

const CardName = styled.span`
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: 700;
  letter-spacing: -0.02em;
`

const CardNote = styled.span`
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.color.textMuted};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const CardCount = styled.span`
  font-family: ${({ theme }) => theme.font.heading};
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-variant-numeric: tabular-nums;
  line-height: 1.1;

  strong {
    font-size: ${({ theme }) => theme.font.size.xl};
    font-weight: 700;
  }

  span {
    font-size: ${({ theme }) => theme.font.size.xs};
    color: ${({ theme }) => theme.color.textMuted};
  }
`

const Panel = styled.aside`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  position: sticky;
  top: 1.5rem;
  height: calc(100vh - 8.5rem);
  min-height: 480px;
  overflow: hidden;

  @media (max-width: 1100px) {
    position: static;
    height: auto;
  }
`

const PanelHead = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1.25rem 1.25rem 1rem;
  background-color: ${({ theme }) => theme.color.surfaceAlt};
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
`

const PanelTitle = styled.h2`
  font-size: ${({ theme }) => theme.font.size.xl};
  font-weight: 700;
`

const PanelNote = styled.p`
  margin-top: 0.125rem;
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.color.textMuted};
`

const IconRow = styled.div`
  display: flex;
  gap: 0.25rem;
`

const IconButton = styled.button<{ $danger?: boolean }>`
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radius.sm};
  background-color: transparent;
  color: ${({ theme }) => theme.color.textMuted};
  transition: all ${({ theme }) => theme.transition.fast};

  svg {
    font-size: 1.1875rem;
  }

  &:hover:not(:disabled) {
    background-color: ${({ theme, $danger }) =>
      $danger ? theme.color.danger.soft : theme.color.sunken};
    border-color: ${({ theme, $danger }) =>
      $danger ? theme.color.danger.line : theme.color.border};
    color: ${({ theme, $danger }) => ($danger ? theme.color.danger.base : theme.color.text)};
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`

const Facts = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
`

const Fact = styled.div`
  font-family: ${({ theme }) => theme.font.heading};
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  padding: 0.75rem 1rem;
  border-right: 1px solid ${({ theme }) => theme.color.border};

  &:last-child {
    border-right: none;
  }

  span {
    font-size: ${({ theme }) => theme.font.size.xs};
    color: ${({ theme }) => theme.color.textMuted};
  }

  strong {
    font-size: ${({ theme }) => theme.font.size.md};
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }
`

const Items = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0.375rem 0.625rem;
`

const Item = styled.button`
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) auto auto;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.5rem 0.625rem;
  text-align: left;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  background: none;
  transition: background-color ${({ theme }) => theme.transition.fast};

  &:hover {
    background-color: ${({ theme }) => theme.color.sunken};
  }

  > svg {
    font-size: 1.125rem;
    color: ${({ theme }) => theme.color.textSubtle};
  }
`

const Thumb = styled.span`
  position: relative;
  width: 44px;
  height: 44px;
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

const ItemName = styled.span`
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const ItemPrice = styled.span`
  font-family: ${({ theme }) => theme.font.heading};
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.color.textMuted};
`

const EmptyItems = styled.p`
  padding: 2.5rem 1rem;
  text-align: center;
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.color.textMuted};
`

const PanelFoot = styled.div`
  padding: 1rem 1.25rem 1.25rem;
  border-top: 1px solid ${({ theme }) => theme.color.border};
`

export default function CategoriesPage() {
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [addingProduct, setAddingProduct] = useState(false)
  const [editing, setEditing] = useState<EditableCategory | null>(null)
  const [deleting, setDeleting] = useState<EditableCategory | null>(null)

  const { data: categories, isLoading } = useCategories()
  const deleteCategory = useDeleteCategory()
  const createProduct = useCreateProduct()

  const list = useMemo(
    () =>
      (categories ?? []).filter(
        (category): category is EditableCategory => !!category.id && !!category.name,
      ),
    [categories],
  )
  const { products } = useProductsByCategories(list.map((category) => category.id))

  if (isLoading) return <LoadingState label="Loading categories" />

  const selected = list.find((category) => category.id === selectedId) ?? list[0]
  const selectedItems = selected
    ? products.filter((product) => product.categoryId === selected.id)
    : []
  const averagePrice = selectedItems.length
    ? selectedItems.reduce((sum, product) => sum + (product.price ?? 0), 0) / selectedItems.length
    : 0
  const menuShare = products.length ? Math.round((selectedItems.length / products.length) * 100) : 0

  return (
    <>
      <PageHeader
        title="Categories"
        subtitle={`${list.length} ${list.length === 1 ? 'category' : 'categories'} organising ${products.length} products`}
        actions={
          <Button
            icon={<AddIcon />}
            onClick={() => setShowForm(true)}
          >
            New category
          </Button>
        }
      />

      {list.length === 0 || !selected ? (
        <EmptyState
          icon={<CategoryIcon />}
          title="No categories yet"
          description="Create the first one and start adding products to it."
          action={
            <Button
              icon={<AddIcon />}
              onClick={() => setShowForm(true)}
            >
              New category
            </Button>
          }
        />
      ) : (
        <Workspace>
          <Grid>
            {list.map((category) => {
              const items = products.filter((product) => product.categoryId === category.id)
              const prices = items.map((product) => product.price ?? 0)
              const cells = Array.from({ length: 5 }, (_, index) => items[index])
              return (
                <Card
                  key={category.id}
                  type="button"
                  $selected={category.id === selected.id}
                  onClick={() => setSelectedId(category.id)}
                >
                  <Mosaic>
                    {cells.map((product, index) => (
                      <MosaicCell
                        key={product?.id ?? index}
                        $lead={index === 0}
                      >
                        {product && (
                          <ProductImage
                            src={product.imageUrl}
                            alt=""
                          />
                        )}
                      </MosaicCell>
                    ))}
                  </Mosaic>
                  <CardBody>
                    <CardInfo>
                      <CardName>{category.name}</CardName>
                      <CardNote>
                        {prices.length
                          ? `${money(Math.min(...prices))} to ${money(Math.max(...prices))}`
                          : 'No products yet'}
                      </CardNote>
                    </CardInfo>
                    <CardCount>
                      <strong>{items.length}</strong>
                      <span>{items.length === 1 ? 'product' : 'products'}</span>
                    </CardCount>
                  </CardBody>
                </Card>
              )
            })}
          </Grid>

          <Panel>
            <PanelHead>
              <div>
                <PanelTitle>{selected.name}</PanelTitle>
                <PanelNote>{selected.description || 'No description'}</PanelNote>
              </div>
              <IconRow>
                <IconButton
                  type="button"
                  aria-label={`Edit ${selected.name}`}
                  title="Edit category"
                  onClick={() => setEditing(selected)}
                >
                  <EditOutlinedIcon />
                </IconButton>
                <IconButton
                  type="button"
                  $danger
                  aria-label={`Delete ${selected.name}`}
                  title={
                    selectedItems.length > 0
                      ? 'Move or delete its products first'
                      : 'Delete category'
                  }
                  disabled={selectedItems.length > 0}
                  onClick={() => setDeleting(selected)}
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </IconRow>
            </PanelHead>

            <Facts>
              <Fact>
                <span>Products</span>
                <strong>{selectedItems.length}</strong>
              </Fact>
              <Fact>
                <span>Average price</span>
                <strong>{money(averagePrice)}</strong>
              </Fact>
              <Fact>
                <span>Share of menu</span>
                <strong>{menuShare}%</strong>
              </Fact>
            </Facts>

            <Items>
              {selectedItems.length === 0 ? (
                <EmptyItems>Nothing in this category yet.</EmptyItems>
              ) : (
                selectedItems.map((product) => (
                  <Item
                    key={product.id}
                    type="button"
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    <Thumb>
                      <ProductImage
                        src={product.imageUrl}
                        alt=""
                      />
                    </Thumb>
                    <ItemName>{product.name}</ItemName>
                    <ItemPrice>{money(product.price)}</ItemPrice>
                    <ChevronRightIcon />
                  </Item>
                ))
              )}
            </Items>

            <PanelFoot>
              <Button
                variant="secondary"
                fullWidth
                icon={<AddIcon />}
                onClick={() => setAddingProduct(true)}
              >
                New product in {selected.name}
              </Button>
            </PanelFoot>
          </Panel>
        </Workspace>
      )}

      {showForm && <CategoryForm onClose={() => setShowForm(false)} />}
      {editing && (
        <CategoryForm
          category={editing}
          onClose={() => setEditing(null)}
        />
      )}

      {addingProduct && selected && (
        <ProductForm
          categories={list}
          selectedCategoryId={selected.id}
          isSubmitting={createProduct.isLoading}
          onClose={() => setAddingProduct(false)}
          onSubmit={(data) =>
            createProduct.mutate(data, { onSuccess: () => setAddingProduct(false) })
          }
        />
      )}

      {deleting && (
        <ConfirmDialog
          title={`Delete ${deleting.name}?`}
          description="The category is removed from the menu. This cannot be undone."
          confirmLabel="Delete category"
          isWorking={deleteCategory.isLoading}
          error={deleteCategory.isError ? errorMessage(deleteCategory.error) : null}
          onClose={() => {
            deleteCategory.reset()
            setDeleting(null)
          }}
          onConfirm={() =>
            deleteCategory.mutate(deleting.id, {
              onSuccess: () => {
                setDeleting(null)
                setSelectedId(null)
              },
            })
          }
        />
      )}
    </>
  )
}
