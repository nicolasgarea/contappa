import { useForm, SubmitHandler } from 'react-hook-form'
import styled from 'styled-components'
import { useTables, useCreateTable, useUpdateTable } from '@api/hooks/useTables'
import { CreateTableRequest } from '@api/__generated__'
import Modal, { ModalActions } from '@components/ui/Modal'
import Button from '@components/ui/Button'
import Input, { Field, FieldError, Label, Select } from '@components/ui/Input'

export type EditableTable = {
  id: string
  number: number
  name: string
  capacity: number
}

type TableFormProps = {
  table?: EditableTable
  onClose: () => void
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

const capacities = [2, 4, 6, 8, 10]

export default function TableForm({ table, onClose }: TableFormProps) {
  const { data: tables = [] } = useTables()
  const createMutation = useCreateTable()
  const updateMutation = useUpdateTable()
  const isEditing = !!table
  const isWorking = createMutation.isLoading || updateMutation.isLoading
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CreateTableRequest>({
    defaultValues: table
      ? { number: table.number, name: table.name, capacity: table.capacity }
      : { capacity: 4 },
  })

  const onSubmit: SubmitHandler<CreateTableRequest> = (data) => {
    if (tables.some((other) => other.number === data.number && other.id !== table?.id)) {
      setError('number', { message: 'A table with this number already exists' })
      return
    }

    if (table) {
      updateMutation.mutate({ tableId: table.id, tableData: data }, { onSuccess: onClose })
      return
    }

    createMutation.mutate(data, { onSuccess: onClose })
  }

  return (
    <Modal
      title={isEditing ? 'Edit table' : 'New table'}
      description="Give it a number, a name the floor recognises and how many it seats."
      onClose={onClose}
      width="520px"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Fields>
          <Field>
            <Label htmlFor="table-name">Name</Label>
            <Input
              id="table-name"
              placeholder="e.g. Terrace 2"
              autoFocus
              {...register('name')}
            />
          </Field>

          <Row>
            <Field>
              <Label htmlFor="table-number">Number</Label>
              <Input
                id="table-number"
                type="number"
                min={1}
                placeholder="e.g. 12"
                {...register('number', {
                  required: 'Table number is required',
                  min: { value: 1, message: 'Must be 1 or higher' },
                  valueAsNumber: true,
                })}
              />
              {errors.number && <FieldError>{errors.number.message}</FieldError>}
            </Field>

            <Field>
              <Label htmlFor="table-capacity">Seats</Label>
              <Select
                id="table-capacity"
                {...register('capacity', { valueAsNumber: true })}
              >
                {capacities.map((seats) => (
                  <option
                    key={seats}
                    value={seats}
                  >
                    {seats} seats
                  </option>
                ))}
              </Select>
            </Field>
          </Row>
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
            {isWorking ? 'Saving…' : isEditing ? 'Save changes' : 'Create table'}
          </Button>
        </ModalActions>
      </form>
    </Modal>
  )
}
