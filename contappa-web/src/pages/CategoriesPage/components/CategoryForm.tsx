import { useForm, SubmitHandler } from 'react-hook-form'
import styled from 'styled-components'
import { useCreateCategory, useUpdateCategory } from '@api/hooks/useCategories'
import Modal, { ModalActions } from '@components/ui/Modal'
import Button from '@components/ui/Button'
import Input, { Field, FieldError, Label } from '@components/ui/Input'

export type EditableCategory = {
  id: string
  name: string
  description?: string
}

type CategoryFormInputs = {
  name: string
  description: string
}

type CategoryFormProps = {
  category?: EditableCategory
  onClose: () => void
}

const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export default function CategoryForm({ category, onClose }: CategoryFormProps) {
  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory()
  const isWorking = createMutation.isLoading || updateMutation.isLoading

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormInputs>({
    defaultValues: { name: category?.name ?? '', description: category?.description ?? '' },
  })

  const onSubmit: SubmitHandler<CategoryFormInputs> = (data) => {
    if (category) {
      updateMutation.mutate({ categoryId: category.id, categoryData: data }, { onSuccess: onClose })
      return
    }
    createMutation.mutate(data, { onSuccess: onClose })
  }

  return (
    <Modal
      title={category ? 'Edit category' : 'New category'}
      description="Categories group the menu on the order screen."
      onClose={onClose}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Fields>
          <Field>
            <Label htmlFor="category-name">Name</Label>
            <Input
              id="category-name"
              placeholder="e.g. Cocktails"
              autoFocus
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && <FieldError>{errors.name.message}</FieldError>}
          </Field>
          <Field>
            <Label htmlFor="category-description">Description</Label>
            <Input
              id="category-description"
              placeholder="A short note for the team (optional)"
              {...register('description')}
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
            disabled={isWorking}
          >
            {isWorking ? 'Saving…' : category ? 'Save changes' : 'Create category'}
          </Button>
        </ModalActions>
      </form>
    </Modal>
  )
}
