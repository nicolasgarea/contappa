import { useForm, SubmitHandler } from 'react-hook-form'
import styled from 'styled-components'
import Modal, { ModalActions } from '@components/ui/Modal'
import Button from '@components/ui/Button'
import Input, { Field, FieldError, Label, Select } from '@components/ui/Input'

export type ProductFormInputs = {
  name: string
  price: number
  imageUrl?: string
  categoryId: string
}

type ProductFormProps = {
  onClose: () => void
  onSubmit: (data: ProductFormInputs) => void
  categories: { id: string; name: string }[]
  selectedCategoryId: string
  isSubmitting?: boolean
}

const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`

export default function ProductForm({
  onClose,
  onSubmit,
  categories,
  selectedCategoryId,
  isSubmitting = false,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormInputs>({
    defaultValues: { categoryId: selectedCategoryId },
  })

  const handleFormSubmit: SubmitHandler<ProductFormInputs> = (data) => onSubmit(data)

  return (
    <Modal
      title="New product"
      description="Add an item to the menu and make it available on every bill."
      onClose={onClose}
      width="520px"
    >
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        noValidate
      >
        <Fields>
          <Field>
            <Label htmlFor="product-name">Name</Label>
            <Input
              id="product-name"
              placeholder="e.g. Flat white"
              autoFocus
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && <FieldError>{errors.name.message}</FieldError>}
          </Field>

          <Row>
            <Field>
              <Label htmlFor="product-price">Price</Label>
              <Input
                id="product-price"
                type="number"
                step="0.01"
                min={0}
                placeholder="0.00"
                {...register('price', {
                  required: 'Price is required',
                  min: { value: 0, message: 'Price cannot be negative' },
                  valueAsNumber: true,
                })}
              />
              {errors.price && <FieldError>{errors.price.message}</FieldError>}
            </Field>

            <Field>
              <Label htmlFor="product-category">Category</Label>
              <Select
                id="product-category"
                {...register('categoryId', { required: 'Pick a category' })}
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
              {errors.categoryId && <FieldError>{errors.categoryId.message}</FieldError>}
            </Field>
          </Row>

          <Field>
            <Label htmlFor="product-image">Image URL</Label>
            <Input
              id="product-image"
              placeholder="https://… (optional)"
              {...register('imageUrl')}
            />
          </Field>
        </Fields>

        <ModalActions>
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating…' : 'Create product'}
          </Button>
        </ModalActions>
      </form>
    </Modal>
  )
}
