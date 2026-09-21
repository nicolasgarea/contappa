import styled from 'styled-components'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ScheduleIcon from '@mui/icons-material/Schedule'
import PersonIcon from '@mui/icons-material/Person'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import TableGlyph from '@components/ui/TableGlyph'
import Badge from '@components/ui/Badge'
import Button from '@components/ui/Button'
import { FloorTable, formatElapsed } from '../floor'
import { money } from '@lib/money'

const Panel = styled.aside`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  position: sticky;
  top: 1.5rem;
  min-height: calc(100vh - 18.5rem);
  max-height: calc(100vh - 3rem);
  overflow: hidden;

  @media (max-width: 1100px) {
    position: static;
    min-height: 0;
    max-height: none;
  }
`

const Hero = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
  background-color: ${({ theme }) => theme.color.surfaceAlt};
`

const HeroText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.4375rem;
  min-width: 0;
  flex: 1;
`

const HeroActions = styled.div`
  display: flex;
  gap: 0.25rem;
  align-self: flex-start;
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

const Title = styled.h2`
  font-size: ${({ theme }) => theme.font.size.xl};
  font-weight: 700;
`

const Facts = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
`

const Fact = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  padding: 0.75rem 1rem;
  border-right: 1px solid ${({ theme }) => theme.color.border};

  &:last-child {
    border-right: none;
  }
`

const FactLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: ${({ theme }) => theme.font.size.xs};
  color: ${({ theme }) => theme.color.textMuted};

  svg {
    font-size: 0.875rem;
  }
`

const FactValue = styled.span<{ $tone?: 'danger' | 'warning' }>`
  font-size: ${({ theme }) => theme.font.size.base};
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: ${({ theme, $tone }) =>
    $tone === 'danger'
      ? theme.color.danger.base
      : $tone === 'warning'
        ? theme.color.warning.base
        : theme.color.text};
`

const Items = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem 1.25rem;
`

const ItemRow = styled.div`
  display: grid;
  grid-template-columns: 2rem 1fr auto;
  align-items: baseline;
  gap: 0.5rem;
  padding: 0.625rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
  font-size: ${({ theme }) => theme.font.size.base};

  &:last-child {
    border-bottom: none;
  }
`

const Quantity = styled.span`
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.color.textMuted};
`

const ItemTotal = styled.span`
  font-weight: 600;
  font-variant-numeric: tabular-nums;
`

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  padding: 1rem 1.25rem 1.25rem;
  border-top: 1px solid ${({ theme }) => theme.color.border};
`

const TotalRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;

  span {
    font-size: ${({ theme }) => theme.font.size.base};
    color: ${({ theme }) => theme.color.textMuted};
  }

  strong {
    font-size: ${({ theme }) => theme.font.size['2xl']};
    font-weight: 700;
    letter-spacing: -0.03em;
    font-variant-numeric: tabular-nums;
  }
`

const FreeBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 2.5rem 1.5rem;
  text-align: center;
  color: ${({ theme }) => theme.color.textMuted};

  svg {
    font-size: 2rem;
    color: ${({ theme }) => theme.color.borderStrong};
  }
`

type TableDetailPanelProps = {
  table: FloorTable
  onOpen: () => void
  onEdit: () => void
  onDelete: () => void
}

export default function TableDetailPanel({
  table,
  onOpen,
  onEdit,
  onDelete,
}: TableDetailPanelProps) {
  const tone =
    table.urgency === 'overdue' ? 'danger' : table.urgency === 'watch' ? 'warning' : undefined

  return (
    <Panel>
      <Hero>
        <TableGlyph
          label={String(table.number)}
          capacity={table.capacity}
          guests={table.guests}
          seated={table.seated}
          size={88}
        />
        <HeroText>
          <Title>{table.name}</Title>
          <Badge
            $tone={table.seated ? 'accent' : 'success'}
            $dot
          >
            {table.seated ? 'Seated' : 'Free'}
          </Badge>
        </HeroText>
        <HeroActions>
          <IconButton
            type="button"
            aria-label="Edit table"
            title="Edit table"
            onClick={onEdit}
          >
            <EditOutlinedIcon />
          </IconButton>
          <IconButton
            type="button"
            $danger
            aria-label="Delete table"
            title={table.seated ? 'Settle the open bill before deleting' : 'Delete table'}
            disabled={table.seated}
            onClick={onDelete}
          >
            <DeleteOutlineIcon />
          </IconButton>
        </HeroActions>
      </Hero>

      {table.seated ? (
        <>
          <Facts>
            <Fact>
              <FactLabel>
                <ScheduleIcon />
                Seated
              </FactLabel>
              <FactValue $tone={tone}>{formatElapsed(table.seatedMinutes ?? 0)}</FactValue>
            </Fact>
            <Fact>
              <FactLabel>
                <RestaurantIcon />
                Last order
              </FactLabel>
              <FactValue>
                {table.lastOrderMinutes === null ? '—' : formatElapsed(table.lastOrderMinutes)}
              </FactValue>
            </Fact>
            <Fact>
              <FactLabel>
                <PersonIcon />
                Guests
              </FactLabel>
              <FactValue>
                {table.guests}/{table.capacity}
              </FactValue>
            </Fact>
          </Facts>

          <Items>
            {table.items.map((item) => (
              <ItemRow key={item.name}>
                <Quantity>{item.quantity}×</Quantity>
                <span>{item.name}</span>
                <ItemTotal>{money(item.total)}</ItemTotal>
              </ItemRow>
            ))}
          </Items>

          <Footer>
            <TotalRow>
              <span>Total</span>
              <strong>{money(table.amount)}</strong>
            </TotalRow>
            <Button
              size="lg"
              fullWidth
              onClick={onOpen}
            >
              Open order
              <ArrowForwardIcon />
            </Button>
          </Footer>
        </>
      ) : (
        <>
          <FreeBody>
            <RestaurantIcon />
            Seats {table.capacity}. Nothing open on this table.
          </FreeBody>
          <Footer>
            <Button
              size="lg"
              fullWidth
              onClick={onOpen}
            >
              Start a bill
              <ArrowForwardIcon />
            </Button>
          </Footer>
        </>
      )}
    </Panel>
  )
}
