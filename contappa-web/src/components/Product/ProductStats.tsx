import styled from 'styled-components'
import { useProductReport } from '@api/hooks/useReports'
import { money } from '@lib/money'

const Grid = styled.dl`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin: 0;
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  background-color: ${({ theme }) => theme.color.surface};
  overflow: hidden;
`

const Fact = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
  padding: 0.875rem 1rem;
  border-right: 1px solid ${({ theme }) => theme.color.border};

  &:last-child {
    border-right: none;
  }

  dt {
    font-size: ${({ theme }) => theme.font.size.xs};
    color: ${({ theme }) => theme.color.textMuted};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  dd {
    margin: 0;
    font-size: ${({ theme }) => theme.font.size.lg};
    font-weight: 700;
    letter-spacing: -0.02em;
    font-variant-numeric: tabular-nums;
  }

  small {
    font-size: ${({ theme }) => theme.font.size.xs};
    color: ${({ theme }) => theme.color.textSubtle};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

const relativeTime = (iso?: string | null) => {
  if (!iso) return 'never sold'
  const minutes = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000))
  if (minutes < 60) return `last ${minutes} min ago`
  const hours = Math.round(minutes / 60)
  if (hours < 48) return `last ${hours} h ago`
  return `last ${Math.round(hours / 24)} d ago`
}

export default function ProductStats({ productId }: { productId?: string }) {
  const { data: report } = useProductReport(productId)

  return (
    <Grid>
      <Fact>
        <dt>Units sold</dt>
        <dd>{report?.unitsSold ?? '—'}</dd>
        <small>{report ? relativeTime(report.lastSoldAt) : ' '}</small>
      </Fact>
      <Fact>
        <dt>Revenue</dt>
        <dd>{report ? money(report.revenue) : '—'}</dd>
        <small>
          {report ? `across ${report.billsSold} ${report.billsSold === 1 ? 'bill' : 'bills'}` : ' '}
        </small>
      </Fact>
      <Fact>
        <dt>On open bills</dt>
        <dd>{report?.unitsOpen ?? '—'}</dd>
        <small>
          {report
            ? report.tablesOpen
              ? `at ${report.tablesOpen} ${report.tablesOpen === 1 ? 'table' : 'tables'} now`
              : 'none right now'
            : ' '}
        </small>
      </Fact>
    </Grid>
  )
}
