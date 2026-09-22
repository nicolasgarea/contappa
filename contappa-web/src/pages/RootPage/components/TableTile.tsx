import styled, { css } from 'styled-components'
import PersonIcon from '@mui/icons-material/Person'
import TableGlyph from '@components/ui/TableGlyph'
import { FloorTable, Urgency, formatElapsed } from '../floor'
import { money } from '@lib/money'

const Tile = styled.button<{ $selected: boolean; $seated: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.5rem;
  width: 100%;
  padding: 1rem 1rem 0.875rem;
  text-align: left;
  background-color: ${({ theme, $seated }) => ($seated ? theme.color.surface : 'transparent')};
  border: 1px ${({ $seated }) => ($seated ? 'solid' : 'dashed')}
    ${({ theme, $seated }) => ($seated ? theme.color.border : theme.color.borderStrong)};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme, $seated }) => ($seated ? theme.shadow.xs : 'none')};
  transition:
    border-color ${({ theme }) => theme.transition.fast},
    box-shadow ${({ theme }) => theme.transition.fast},
    background-color ${({ theme }) => theme.transition.fast};

  &:hover {
    background-color: ${({ theme }) => theme.color.surface};
    border-color: ${({ theme }) => theme.color.borderStrong};
    box-shadow: ${({ theme }) => theme.shadow.md};
  }

  ${({ theme, $selected }) =>
    $selected &&
    css`
      background-color: ${theme.color.surface};
      border: 1px solid ${theme.color.text};
      box-shadow: inset 0 0 0 1px ${theme.color.text};

      &:hover {
        border-color: ${theme.color.text};
        box-shadow: inset 0 0 0 1px ${theme.color.text};
      }
    `}
`

const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  min-height: 1.625rem;
`

const Name = styled.span<{ $seated: boolean }>`
  font-size: ${({ theme }) => theme.font.size.base};
  font-weight: 650;
  color: ${({ theme, $seated }) => ($seated ? theme.color.text : theme.color.textMuted)};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const TimeTag = styled.span<{ $urgency: Urgency }>`
  padding: 0.125rem 0.5rem;
  border-radius: ${({ theme }) => theme.radius.pill};
  font-size: ${({ theme }) => theme.font.size.xs};
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;

  ${({ theme, $urgency }) => {
    if ($urgency === 'overdue')
      return `background-color: ${theme.color.danger.base}; color: ${theme.color.danger.ink};`
    if ($urgency === 'watch')
      return `background-color: ${theme.color.warning.soft}; color: ${theme.color.warning.base}; box-shadow: inset 0 0 0 1px ${theme.color.warning.line};`
    return `background-color: ${theme.color.sunken}; color: ${theme.color.textMuted};`
  }}
`

const Stage = styled.div`
  display: grid;
  place-items: center;
  padding: 0.625rem 0;
`

const Foot = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
  min-height: 1.5rem;
`

const Guests = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.color.textMuted};
  font-variant-numeric: tabular-nums;

  svg {
    font-size: 1rem;
    align-self: center;
    color: ${({ theme }) => theme.color.textSubtle};
  }
`

const Amount = styled.span`
  font-family: ${({ theme }) => theme.font.heading};
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: 700;
  letter-spacing: -0.01em;
  font-variant-numeric: tabular-nums;
`

const FreeTag = styled.span`
  font-size: ${({ theme }) => theme.font.size.xs};
  font-weight: 700;
  color: ${({ theme }) => theme.color.success.base};
`

type TableTileProps = {
  table: FloorTable
  selected: boolean
  onSelect: () => void
  onOpen: () => void
}

export default function TableTile({ table, selected, onSelect, onOpen }: TableTileProps) {
  return (
    <Tile
      type="button"
      $selected={selected}
      $seated={table.seated}
      onClick={onSelect}
      onDoubleClick={onOpen}
    >
      <Head>
        <Name $seated={table.seated}>{table.name}</Name>
        {table.seated && table.seatedMinutes !== null ? (
          <TimeTag $urgency={table.urgency}>{formatElapsed(table.seatedMinutes)}</TimeTag>
        ) : (
          <FreeTag>Free</FreeTag>
        )}
      </Head>

      <Stage>
        <TableGlyph
          label={String(table.number)}
          capacity={table.capacity}
          guests={table.guests}
          seated={table.seated}
          size={132}
        />
      </Stage>

      <Foot>
        <Guests>
          <PersonIcon />
          {table.seated ? `${table.guests}/${table.capacity}` : table.capacity}
        </Guests>
        {table.seated && <Amount>{money(table.amount)}</Amount>}
      </Foot>
    </Tile>
  )
}
