import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import styled from 'styled-components'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { useCategories } from '@api/hooks/useCategories'
import { useDeleteProduct, useProductsByCategories, useUpdateProduct } from '@api/hooks/useProducts'
import { errorMessage } from '@api/client/errorMessage'
import type { Product } from '@api/__generated__'
import Button from '@components/ui/Button'
import ConfirmDialog from '@components/ui/ConfirmDialog'
import ProductImage from '@components/ui/ProductImage'
import Input, { Field, FieldError, Label, Select } from '@components/ui/Input'
import { EmptyState, LoadingState } from '@components/ui/Feedback'
import ProductHero from '@components/Product/ProductHero'
import ProductStats from '@components/Product/ProductStats'
import { money } from '@lib/money'

type ProductFormInputs = {
  name: string
  price: number
  categoryId: string
  imageUrl: string
}

const BackLink = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  margin-bottom: 1rem;
  padding: 0;
  border: none;
  background: none;
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: 600;
  color: ${({ theme }) => theme.color.textMuted};

  svg {
    font-size: 1rem;
  }

  &:hover {
    color: ${({ theme }) => theme.color.text};
  }
`

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 380px;
  gap: 1.25rem;
  align-items: start;

  @media (max-width: 1100px) {
    grid-template-columns: minmax(0, 1fr);
  }
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-width: 0;

  @media (max-width: 1100px) {
    display: contents;
  }
`

const Siblings = styled.section`
  min-width: 0;

  @media (max-width: 1100px) {
    order: 3;
  }
`

const SectionTitle = styled.h2`
  margin-bottom: 0.75rem;
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: 700;
`

const Strip = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(148px, 1fr));
  gap: 0.75rem;
`

const Sibling = styled.button`
  display: flex;
  flex-direction: column;
  padding: 0;
  text-align: left;
  background-color: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  transition:
    border-color ${({ theme }) => theme.transition.fast},
    box-shadow ${({ theme }) => theme.transition.fast};

  &:hover {
    border-color: ${({ theme }) => theme.color.accent.line};
    box-shadow: ${({ theme }) => theme.shadow.md};
  }
`

const SiblingThumb = styled.span`
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  display: grid;
  place-items: center;
  overflow: hidden;
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

const SiblingInfo = styled.span`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  padding: 0.5625rem 0.6875rem 0.6875rem;
  min-width: 0;

  strong {
    font-size: ${({ theme }) => theme.font.size.sm};
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span {
    font-size: ${({ theme }) => theme.font.size.sm};
    color: ${({ theme }) => theme.color.textMuted};
    font-variant-numeric: tabular-nums;
  }
`

const Panel = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem;
  background-color: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  position: sticky;
  top: 1.5rem;

  @media (max-width: 1100px) {
    position: static;
    order: 2;
  }
`

const PanelTitle = styled.h2`
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: 700;
`

const Row = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 0.875rem;
`

const Hint = styled.p`
  font-size: ${({ theme }) => theme.font.size.xs};
  color: ${({ theme }) => theme.color.textSubtle};
`

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.625rem;
  flex-wrap: wrap;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.color.border};
`

function ProductEditor({
  product,
  siblings,
  categories,
}: {
  product: Product
  siblings: Product[]
  categories: { id: string; name: string }[]
}) {
  const navigate = useNavigate()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const updateProduct = useUpdateProduct()
  const deleteProduct = useDeleteProduct()

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProductFormInputs>({
    defaultValues: {
      name: product.name ?? '',
      price: product.price ?? 0,
      categoryId: product.categoryId ?? '',
      imageUrl: product.imageUrl ?? '',
    },
  })

  const live = watch()
  const liveCategory = categories.find((category) => category.id === live.categoryId)?.name

  const onSubmit: SubmitHandler<ProductFormInputs> = (data) => {
    updateProduct.mutate(
      { categoryId: product.categoryId!, productId: product.id!, productData: data },
      { onSuccess: () => reset(data) },
    )
  }

  return (
    <Layout>
      <Column>
        <ProductHero
          name={live.name}
          price={Number(live.price) || 0}
          category={liveCategory}
          imageUrl={live.imageUrl}
          ratio="2 / 1"
        />

        <ProductStats productId={product.id} />

        {siblings.length > 0 && (
          <Siblings>
            <SectionTitle>More from {liveCategory}</SectionTitle>
            <Strip>
              {siblings.map((sibling) => (
                <Sibling
                  key={sibling.id}
                  type="button"
                  onClick={() => navigate(`/products/${sibling.id}`)}
                >
                  <SiblingThumb>
                    <ProductImage
                      src={sibling.imageUrl}
                      alt=""
                    />
                  </SiblingThumb>
                  <SiblingInfo>
                    <strong>{sibling.name}</strong>
                    <span>{money(sibling.price)}</span>
                  </SiblingInfo>
                </Sibling>
              ))}
            </Strip>
          </Siblings>
        )}
      </Column>

      <Panel
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <PanelTitle>Details</PanelTitle>

        <Field>
          <Label htmlFor="detail-name">Name</Label>
          <Input
            id="detail-name"
            {...register('name', { required: 'Name is required' })}
          />
          {errors.name && <FieldError>{errors.name.message}</FieldError>}
        </Field>

        <Row>
          <Field>
            <Label htmlFor="detail-price">Price</Label>
            <Input
              id="detail-price"
              type="number"
              step="0.01"
              min={0}
              {...register('price', {
                required: 'Price is required',
                min: { value: 0, message: 'Price cannot be negative' },
                valueAsNumber: true,
              })}
            />
            {errors.price && <FieldError>{errors.price.message}</FieldError>}
          </Field>

          <Field>
            <Label htmlFor="detail-category">Category</Label>
            <Select
              id="detail-category"
              {...register('categoryId', { required: true })}
            >
              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              ))}
            </Select>
          </Field>
        </Row>

        <Field>
          <Label htmlFor="detail-image">Image URL</Label>
          <Input
            id="detail-image"
            placeholder="https://…"
            {...register('imageUrl')}
          />
        </Field>

        <Hint>The preview updates as you type. Nothing is saved until you press Save.</Hint>

        {updateProduct.isError && (
          <FieldError role="alert">{errorMessage(updateProduct.error)}</FieldError>
        )}

        <Footer>
          <Button
            variant="danger"
            icon={<DeleteOutlineIcon />}
            onClick={() => setConfirmDelete(true)}
          >
            Delete
          </Button>
          <Button
            type="submit"
            disabled={!isDirty || updateProduct.isLoading}
          >
            {updateProduct.isLoading ? 'Saving…' : isDirty ? 'Save changes' : 'Saved'}
          </Button>
        </Footer>
      </Panel>

      {confirmDelete && (
        <ConfirmDialog
          title={`Delete ${product.name}?`}
          description="It disappears from the menu and can no longer be added to bills."
          confirmLabel="Delete product"
          isWorking={deleteProduct.isLoading}
          error={deleteProduct.isError ? errorMessage(deleteProduct.error) : null}
          onClose={() => {
            deleteProduct.reset()
            setConfirmDelete(false)
          }}
          onConfirm={() =>
            deleteProduct.mutate(
              { productId: product.id!, categoryId: product.categoryId! },
              { onSuccess: () => navigate('/products') },
            )
          }
        />
      )}
    </Layout>
  )
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: categories, isLoading: loadingCategories } = useCategories()

  const selectable = useMemo(
    () =>
      (categories ?? []).filter(
        (category): category is { id: string; name: string } => !!category.id && !!category.name,
      ),
    [categories],
  )
  const { products, isLoading: loadingProducts } = useProductsByCategories(
    selectable.map((category) => category.id),
  )

  const product = products.find((item) => item.id === id)
  const siblings = product
    ? products.filter((item) => item.categoryId === product.categoryId && item.id !== product.id)
    : []

  return (
    <>
      <BackLink
        type="button"
        onClick={() => navigate('/products')}
      >
        <ArrowBackIcon />
        Products
      </BackLink>

      {loadingCategories || (loadingProducts && !product) ? (
        <LoadingState label="Loading product" />
      ) : !product ? (
        <EmptyState
          tone="danger"
          title="Product not found"
          description="It may have been deleted."
        />
      ) : (
        <ProductEditor
          key={product.id}
          product={product}
          siblings={siblings}
          categories={selectable}
        />
      )}
    </>
  )
}
