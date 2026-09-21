import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import AddIcon from '@mui/icons-material/Add'
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant'
import { useTables, useDeleteTable } from '@api/hooks/useTables'
import Button from '@components/ui/Button'
import PageHeader from '@components/ui/PageHeader'
import SearchField from '@components/ui/SearchField'
import Chip, { ChipRow } from '@components/ui/Chip'
import { EmptyState, LoadingState } from '@components/ui/Feedback'
import TableTile from './components/TableTile'
import TableDetailPanel from './components/TableDetailPanel'
import TableForm from './components/TableForm'
import ConfirmDialog from '@components/ui/ConfirmDialog'
import { errorMessage } from '@api/client/errorMessage'
import { FloorTable, toFloorTable } from './floor'
import { money } from '@lib/money'

type Filter = 'all' | 'seated' | 'free' | 'late'

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

  small {
    font-size: ${({ theme }) => theme.font.size.sm};
    font-weight: 500;
    letter-spacing: 0;
    color: ${({ theme }) => theme.color.textSubtle};
  }
`

const Workspace = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 1.25rem;
  align-items: start;

  @media (max-width: 1100px) {
    grid-template-columns: minmax(0, 1fr);
  }
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(224px, 1fr));
  gap: 1rem;

  @media (max-width: 560px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.625rem;
  }
`

const clockFormat = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  hour: '2-digit',
  minute: '2-digit',
})

export default function RootPage() {
  const navigate = useNavigate()
  const { data: tables, isLoading, error } = useTables()
  const [showForm, setShowForm] = useState(false)
  const [now, setNow] = useState(() => Date.now())
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [editing, setEditing] = useState<FloorTable | null>(null)
  const [deleting, setDeleting] = useState<FloorTable | null>(null)
  const deleteTable = useDeleteTable()

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30000)
    return () => window.clearInterval(timer)
  }, [])

  const floor = useMemo(
    () =>
      (tables ?? []).map((table) => toFloorTable(table, now)).sort((a, b) => a.number - b.number),
    [tables, now],
  )

  const counts = useMemo(
    () => ({
      all: floor.length,
      seated: floor.filter((table) => table.seated).length,
      free: floor.filter((table) => !table.seated).length,
      late: floor.filter((table) => table.urgency !== 'calm').length,
    }),
    [floor],
  )

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase()
    return floor.filter((table) => {
      const matchesFilter =
        filter === 'all' ||
        (filter === 'seated' && table.seated) ||
        (filter === 'free' && !table.seated) ||
        (filter === 'late' && table.urgency !== 'calm')
      const matchesQuery =
        !term || table.name.toLowerCase().includes(term) || String(table.number) === term
      return matchesFilter && matchesQuery
    })
  }, [floor, filter, query])

  if (isLoading) return <LoadingState label="Loading the floor" />
  if (error) {
    return (
      <EmptyState
        tone="danger"
        title="Could not load tables"
        description={error.message}
      />
    )
  }

  const seated = floor.filter((table) => table.seated)
  const openTotal = seated.reduce((sum, table) => sum + table.amount, 0)
  const guests = seated.reduce((sum, table) => sum + table.guests, 0)
  const capacity = floor.reduce((sum, table) => sum + table.capacity, 0)

  const mostUrgent = [...seated].sort((a, b) => (b.seatedMinutes ?? 0) - (a.seatedMinutes ?? 0))[0]
  const selected =
    visible.find((table) => table.id === selectedId) ??
    visible.find((table) => table.id === mostUrgent?.id) ??
    visible[0]

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All tables' },
    { key: 'seated', label: 'Seated' },
    { key: 'free', label: 'Free' },
    { key: 'late', label: 'Over an hour' },
  ]

  return (
    <>
      <PageHeader
        title="Floor"
        subtitle={clockFormat.format(now)}
        actions={
          <>
            <SearchField
              width="260px"
              placeholder="Find a table"
              value={query}
              onChange={setQuery}
            />
            <Button
              icon={<AddIcon />}
              onClick={() => setShowForm(true)}
            >
              New table
            </Button>
          </>
        }
      />

      {floor.length === 0 ? (
        <EmptyState
          icon={<TableRestaurantIcon />}
          title="No tables yet"
          description="Create your first table to start taking orders."
          action={
            <Button
              icon={<AddIcon />}
              onClick={() => setShowForm(true)}
            >
              New table
            </Button>
          }
        />
      ) : (
        <>
          <Stats>
            <Stat>
              <StatLabel>Open bills</StatLabel>
              <StatValue>{money(openTotal)}</StatValue>
            </Stat>
            <Stat>
              <StatLabel>Tables seated</StatLabel>
              <StatValue>
                {counts.seated} <small>/ {counts.all}</small>
              </StatValue>
            </Stat>
            <Stat>
              <StatLabel>Guests</StatLabel>
              <StatValue>
                {guests} <small>/ {capacity} seats</small>
              </StatValue>
            </Stat>
            <Stat>
              <StatLabel>Average ticket</StatLabel>
              <StatValue>{money(counts.seated ? openTotal / counts.seated : 0)}</StatValue>
            </Stat>
          </Stats>

          <ChipRow style={{ marginBottom: '1rem' }}>
            {filters.map(({ key, label }) => (
              <Chip
                key={key}
                active={filter === key}
                count={counts[key]}
                onClick={() => setFilter(key)}
              >
                {label}
              </Chip>
            ))}
          </ChipRow>

          <Workspace>
            {visible.length === 0 ? (
              <EmptyState
                icon={<TableRestaurantIcon />}
                title="No tables match"
                description="Try another filter or clear the search."
              />
            ) : (
              <Grid>
                {visible.map((table) => (
                  <TableTile
                    key={table.id}
                    table={table}
                    selected={table.id === selected?.id}
                    onSelect={() => setSelectedId(table.id)}
                    onOpen={() => navigate(`/tables/${table.id}`)}
                  />
                ))}
              </Grid>
            )}

            {selected && (
              <TableDetailPanel
                table={selected}
                onOpen={() => navigate(`/tables/${selected.id}`)}
                onEdit={() => setEditing(selected)}
                onDelete={() => setDeleting(selected)}
              />
            )}
          </Workspace>
        </>
      )}

      {showForm && <TableForm onClose={() => setShowForm(false)} />}

      {editing && (
        <TableForm
          table={{
            id: editing.id,
            number: editing.number,
            name: editing.name,
            capacity: editing.capacity,
          }}
          onClose={() => setEditing(null)}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title={`Delete ${deleting.name}?`}
          description="The table disappears from the floor. This cannot be undone."
          confirmLabel="Delete table"
          isWorking={deleteTable.isLoading}
          error={deleteTable.isError ? errorMessage(deleteTable.error) : null}
          onClose={() => {
            deleteTable.reset()
            setDeleting(null)
          }}
          onConfirm={() =>
            deleteTable.mutate(deleting.id, {
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
