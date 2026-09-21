import styled from 'styled-components'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import PersonIcon from '@mui/icons-material/Person'
import Badge from '@components/ui/Badge'
import Button from '@components/ui/Button'
import { money } from '@lib/money'

export type OrderLine = {
  productId: string
  name: string
  unitPrice: number
  quantity: number
}

type OrderPanelProps = {
  reference: string
  paid: boolean
  lines: OrderLine[]
  guests: number
  capacity: number
  dirty: boolean
  isNew: boolean
  isSaving: boolean
  isPaying: boolean
  isDeleting: boolean
  error?: string | null
  onChangeGuests: (guests: number) => void
  onChangeQuantity: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
  onSave: () => void
  onPay: () => void
  onSplit: () => void
  onDelete: () => void
}

const Panel = styled.aside`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  overflow: hidden;
  position: sticky;
  top: 1.5rem;
  height: calc(100vh - 13.5rem);
  min-height: 480px;

  @media (max-width: 1100px) {
    position: static;
    height: auto;
  }
`

const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
`

const Reference = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;

  svg {
    font-size: 1.125rem;
    color: ${({ theme }) => theme.color.accent[500]};
  }
`

const GuestsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
  background-color: ${({ theme }) => theme.color.surfaceAlt};
`

const GuestsLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4375rem;
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: 600;
  color: ${({ theme }) => theme.color.textMuted};

  svg {
    font-size: 1.125rem;
    color: ${({ theme }) => theme.color.textSubtle};
  }

  small {
    font-size: ${({ theme }) => theme.font.size.xs};
    font-weight: 500;
    color: ${({ theme }) => theme.color.textSubtle};
  }
`

const Lines = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  padding: 1rem;
  overflow-y: auto;
`

const Line = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: ${({ theme }) => theme.color.surfaceAlt};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.md};
`

const LineTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
`

const LineName = styled.span`
  font-weight: 600;
`

const LineMath = styled.span`
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.color.textMuted};
  font-weight: 500;
  font-variant-numeric: tabular-nums;

  strong {
    color: ${({ theme }) => theme.color.text};
    font-weight: 700;
  }
`

const LineBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`

const Stepper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 2px;
  background-color: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.pill};
`

const StepButton = styled.button`
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border: none;
  border-radius: 50%;
  background-color: transparent;
  color: ${({ theme }) => theme.color.textMuted};
  transition: all ${({ theme }) => theme.transition.fast};

  svg {
    font-size: 1rem;
  }

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.color.accent[500]};
    color: ${({ theme }) => theme.color.accent.ink};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`

const Quantity = styled.span`
  min-width: 22px;
  text-align: center;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
`

const IconButton = styled.button`
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radius.sm};
  background-color: transparent;
  color: ${({ theme }) => theme.color.textSubtle};
  transition: all ${({ theme }) => theme.transition.fast};

  &:hover {
    background-color: ${({ theme }) => theme.color.danger.soft};
    border-color: ${({ theme }) => theme.color.danger.line};
    color: ${({ theme }) => theme.color.danger.base};
  }
`

const Totals = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid ${({ theme }) => theme.color.border};
`

const Row = styled.div<{ $strong?: boolean }>`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  font-size: ${({ theme, $strong }) => ($strong ? theme.font.size.md : theme.font.size.base)};
  color: ${({ theme, $strong }) => ($strong ? theme.color.text : theme.color.textMuted)};
  font-weight: ${({ $strong }) => ($strong ? 700 : 400)};

  span:last-child {
    font-variant-numeric: tabular-nums;
  }
`

const Actions = styled.div`
  display: grid;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid ${({ theme }) => theme.color.border};
`

const ErrorNote = styled.p`
  padding: 0.5rem 0.75rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.color.danger.line};
  background-color: ${({ theme }) => theme.color.danger.soft};
  color: ${({ theme }) => theme.color.danger.base};
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: 500;
`

const ActionRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
`

const Placeholder = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 3rem 1.5rem;
  text-align: center;
  color: ${({ theme }) => theme.color.textMuted};
  font-size: ${({ theme }) => theme.font.size.sm};

  svg {
    font-size: 1.75rem;
    color: ${({ theme }) => theme.color.borderStrong};
  }
`

export default function OrderPanel({
  reference,
  paid,
  lines,
  guests,
  capacity,
  dirty,
  isNew,
  isSaving,
  isPaying,
  isDeleting,
  error,
  onChangeGuests,
  onChangeQuantity,
  onRemove,
  onSave,
  onPay,
  onSplit,
  onDelete,
}: OrderPanelProps) {
  const subtotal = lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0)
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0)

  return (
    <Panel>
      <Head>
        <Reference>
          <ReceiptLongIcon />
          {reference}
        </Reference>
        <Badge
          $tone={isNew ? 'neutral' : paid ? 'success' : 'accent'}
          $dot
        >
          {isNew ? 'Draft' : paid ? 'Paid' : 'Open'}
        </Badge>
      </Head>

      <GuestsRow>
        <GuestsLabel>
          <PersonIcon />
          Guests <small>seats {capacity}</small>
        </GuestsLabel>
        <Stepper>
          <StepButton
            type="button"
            aria-label="Fewer guests"
            disabled={paid || guests <= 1}
            onClick={() => onChangeGuests(guests - 1)}
          >
            <RemoveIcon />
          </StepButton>
          <Quantity>{guests}</Quantity>
          <StepButton
            type="button"
            aria-label="More guests"
            disabled={paid || guests >= capacity}
            onClick={() => onChangeGuests(guests + 1)}
          >
            <AddIcon />
          </StepButton>
        </Stepper>
      </GuestsRow>

      {lines.length === 0 ? (
        <Placeholder>
          <ReceiptLongIcon />
          Pick items from the menu to start this order.
        </Placeholder>
      ) : (
        <Lines>
          {lines.map((line) => (
            <Line key={line.productId}>
              <LineTop>
                <LineName>{line.name}</LineName>
                <IconButton
                  type="button"
                  aria-label={`Remove ${line.name}`}
                  onClick={() => onRemove(line.productId)}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </LineTop>
              <LineBottom>
                <Stepper>
                  <StepButton
                    type="button"
                    aria-label="Decrease quantity"
                    disabled={line.quantity <= 1}
                    onClick={() => onChangeQuantity(line.productId, line.quantity - 1)}
                  >
                    <RemoveIcon />
                  </StepButton>
                  <Quantity>{line.quantity}</Quantity>
                  <StepButton
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => onChangeQuantity(line.productId, line.quantity + 1)}
                  >
                    <AddIcon />
                  </StepButton>
                </Stepper>
                <LineMath>
                  {money(line.unitPrice)} × {line.quantity} ={' '}
                  <strong>{money(line.unitPrice * line.quantity)}</strong>
                </LineMath>
              </LineBottom>
            </Line>
          ))}
        </Lines>
      )}

      <Totals>
        <Row>
          <span>Items</span>
          <span>{itemCount}</span>
        </Row>
        <Row $strong>
          <span>Total</span>
          <span>{money(subtotal)}</span>
        </Row>
      </Totals>

      <Actions>
        {error && <ErrorNote role="alert">{error}</ErrorNote>}
        {isNew ? (
          <Button
            variant="primary"
            size="lg"
            fullWidth
            disabled={lines.length === 0 || isSaving}
            onClick={onSave}
          >
            {isSaving ? 'Opening…' : 'Open bill'}
          </Button>
        ) : (
          <>
            <Button
              variant="ink"
              size="lg"
              fullWidth
              disabled={!dirty || isSaving || paid}
              onClick={onSave}
            >
              {isSaving ? 'Saving…' : dirty ? 'Save changes' : 'No changes'}
            </Button>
            <ActionRow>
              <Button
                variant="secondary"
                disabled={paid || dirty || lines.reduce((sum, line) => sum + line.quantity, 0) < 2}
                title={dirty ? 'Save your changes before splitting' : undefined}
                onClick={onSplit}
              >
                Split
              </Button>
              <Button
                variant="danger"
                disabled={isDeleting}
                onClick={onDelete}
              >
                {isDeleting ? 'Deleting…' : 'Delete'}
              </Button>
              <Button
                variant="success"
                disabled={paid || isPaying}
                onClick={onPay}
              >
                {paid ? 'Settled' : isPaying ? 'Paying…' : 'Mark paid'}
              </Button>
            </ActionRow>
          </>
        )}
      </Actions>
    </Panel>
  )
}
