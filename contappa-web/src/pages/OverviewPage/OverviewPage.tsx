import { useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import styled from 'styled-components'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined'
import { useDailyReport } from '@api/hooks/useReports'
import PageHeader from '@components/ui/PageHeader'
import Button from '@components/ui/Button'
import ProductImage from '@components/ui/ProductImage'
import { EmptyState, LoadingState } from '@components/ui/Feedback'
import HourlyChart from './components/HourlyChart'
import { money } from '@lib/money'

const toIsoDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

const shiftDay = (iso: string, days: number) => {
  const [year, month, day] = iso.split('-').map(Number)
  return toIsoDate(new Date(year, month - 1, day + days))
}

const dayFormat = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

const DayNav = styled.div`
  display: inline-flex;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background-color: ${({ theme }) => theme.color.surface};
  overflow: hidden;
`

const DayButton = styled.button`
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border: none;
  background: none;
  color: ${({ theme }) => theme.color.textMuted};
  transition: all ${({ theme }) => theme.transition.fast};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.color.sunken};
    color: ${({ theme }) => theme.color.text};
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`

const DayLabel = styled.span`
  flex: 1;
  min-width: 11.5rem;
  padding: 0 0.5rem;
  text-align: center;
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: 600;
  border-left: 1px solid ${({ theme }) => theme.color.border};
  border-right: 1px solid ${({ theme }) => theme.color.border};
  line-height: 38px;
`

const Kpis = styled.div`
  display: grid;
  grid-template-columns: 1.6fr repeat(3, 1fr);
  gap: 2rem;
  padding: 0.5rem 0 1.75rem;
  margin-bottom: 1.25rem;
  border-bottom: 1px solid ${({ theme }) => theme.color.border};

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: minmax(0, 1fr);
  }
`

const Panel = styled.section`
  display: flex;
  flex-direction: column;
  padding: 1.25rem;
  background-color: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.lg};
`

const KpiLabel = styled.span`
  display: block;
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.color.textMuted};
`

const KpiValue = styled.span<{ $hero?: boolean }>`
  font-family: ${({ theme }) => theme.font.heading};
  display: block;
  margin-top: 0.25rem;
  font-size: ${({ theme, $hero }) => ($hero ? '3.5rem' : theme.font.size['2xl'])};
  font-weight: 700;
  letter-spacing: -0.035em;
  line-height: 1.1;
`

const KpiHint = styled.span`
  display: block;
  margin-top: 0.375rem;
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.color.textSubtle};
  font-variant-numeric: tabular-nums;
`

const Row = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(0, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 1100px) {
    grid-template-columns: minmax(0, 1fr);
  }
`

const PanelHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
`

const PanelTitle = styled.h2`
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: 700;
`

const PanelNote = styled.span`
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.color.textMuted};
`

const ProductList = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  margin: 0;
  padding: 0;
  list-style: none;
`

const ProductRow = styled.li`
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.75rem;
`

const Thumb = styled.div`
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

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  min-width: 0;
`

const ProductName = styled.span`
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const Track = styled.div`
  height: 6px;
  border-radius: 0 4px 4px 0;
  background-color: ${({ theme }) => theme.color.sunken};
  overflow: hidden;
`

const Fill = styled.div<{ $ratio: number }>`
  height: 100%;
  width: ${({ $ratio }) => `${Math.max($ratio * 100, 2)}%`};
  border-radius: 0 4px 4px 0;
  background-color: ${({ theme }) => theme.color.accent[500]};
`

const ProductFigures = styled.div`
  font-family: ${({ theme }) => theme.font.heading};
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-variant-numeric: tabular-nums;

  strong {
    font-size: ${({ theme }) => theme.font.size.sm};
    font-weight: 700;
  }

  span {
    font-size: ${({ theme }) => theme.font.size.xs};
    color: ${({ theme }) => theme.color.textMuted};
  }
`

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const CategoryRow = styled.div`
  display: grid;
  grid-template-columns: 7rem minmax(0, 1fr) 8.5rem;
  align-items: center;
  gap: 1rem;
  font-size: ${({ theme }) => theme.font.size.sm};

  @media (max-width: 560px) {
    grid-template-columns: 5rem minmax(0, 1fr) 6rem;
  }
`

const CategoryName = styled.span`
  font-weight: 600;
`

const CategoryBar = styled(Track)`
  height: 10px;
`

const CategoryFigures = styled.span`
  font-family: ${({ theme }) => theme.font.heading};
  text-align: right;
  font-variant-numeric: tabular-nums;
  font-weight: 700;

  small {
    margin-left: 0.5rem;
    font-size: ${({ theme }) => theme.font.size.xs};
    font-weight: 500;
    color: ${({ theme }) => theme.color.textMuted};
  }
`

const LiveBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
`

export default function OverviewPage() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const today = useMemo(() => toIsoDate(new Date()), [])
  const date = params.get('date') ?? today

  const { data: report, isLoading, error } = useDailyReport(date)

  const label = useMemo(() => {
    const [year, month, day] = date.split('-').map(Number)
    const text = dayFormat.format(new Date(year, month - 1, day))
    return date === today ? `Today · ${text}` : text
  }, [date, today])

  const goTo = (next: string) => setParams(next === today ? {} : { date: next })

  const header = (
    <PageHeader
      title="Overview"
      subtitle="Settled sales for the day, refreshed every minute."
      actions={
        <DayNav>
          <DayButton
            type="button"
            aria-label="Previous day"
            onClick={() => goTo(shiftDay(date, -1))}
          >
            <ChevronLeftIcon />
          </DayButton>
          <DayLabel>{label}</DayLabel>
          <DayButton
            type="button"
            aria-label="Next day"
            disabled={date >= today}
            onClick={() => goTo(shiftDay(date, 1))}
          >
            <ChevronRightIcon />
          </DayButton>
        </DayNav>
      }
    />
  )

  if (isLoading) {
    return (
      <>
        {header}
        <LoadingState label="Crunching the day" />
      </>
    )
  }

  if (error || !report) {
    return (
      <>
        {header}
        <EmptyState
          tone="danger"
          title="Could not load the report"
          description={error?.message}
        />
      </>
    )
  }

  const revenue = report.revenue ?? 0
  const hourly = (report.hourly ?? []).map((point) => ({
    hour: point.hour ?? 0,
    revenue: point.revenue ?? 0,
    bills: point.bills ?? 0,
  }))
  const products = report.topProducts ?? []
  const categories = report.categories ?? []
  const topQuantity = Math.max(...products.map((product) => product.quantity ?? 0), 1)
  const topCategory = Math.max(...categories.map((category) => category.revenue ?? 0), 1)
  const peak = hourly.reduce(
    (best, point) => (point.revenue > best.revenue ? point : best),
    hourly[0],
  )

  return (
    <>
      {header}

      <Kpis>
        <div>
          <KpiLabel>Revenue</KpiLabel>
          <KpiValue $hero>{money(revenue)}</KpiValue>
          <KpiHint>
            from {report.billsPaid} settled {report.billsPaid === 1 ? 'bill' : 'bills'}
          </KpiHint>
        </div>
        <div>
          <KpiLabel>Average ticket</KpiLabel>
          <KpiValue>{money(report.averageTicket)}</KpiValue>
          <KpiHint>per settled bill</KpiHint>
        </div>
        <div>
          <KpiLabel>Guests served</KpiLabel>
          <KpiValue>{report.guestsServed}</KpiValue>
          <KpiHint>
            {report.guestsServed
              ? `${money(revenue / report.guestsServed)} per guest`
              : 'no guests yet'}
          </KpiHint>
        </div>
        <div>
          <KpiLabel>Busiest hour</KpiLabel>
          <KpiValue>{peak ? `${String(peak.hour).padStart(2, '0')}:00` : '—'}</KpiValue>
          <KpiHint>
            {peak
              ? `${money(peak.revenue)} across ${peak.bills} ${peak.bills === 1 ? 'bill' : 'bills'}`
              : 'no sales yet'}
          </KpiHint>
        </div>
      </Kpis>

      {report.billsPaid === 0 ? (
        <EmptyState
          icon={<InsightsOutlinedIcon />}
          title="Nothing settled on this day"
          description="Sales show up here as soon as the first bill is marked as paid."
          action={
            <Button
              variant="secondary"
              onClick={() => navigate('/tables')}
            >
              Go to the floor
            </Button>
          }
        />
      ) : (
        <>
          <Row>
            <Panel>
              <PanelHead>
                <PanelTitle>Sales by hour</PanelTitle>
                <PanelNote>Settled revenue, by the hour the bill was opened</PanelNote>
              </PanelHead>
              <HourlyChart points={hourly} />
            </Panel>

            <Panel>
              <PanelHead>
                <PanelTitle>Best sellers</PanelTitle>
                <PanelNote>by units</PanelNote>
              </PanelHead>
              <ProductList>
                {products.map((product) => (
                  <ProductRow key={product.name}>
                    <Thumb>
                      <ProductImage
                        src={product.imageUrl}
                        alt={product.name ?? ''}
                      />
                    </Thumb>
                    <ProductInfo>
                      <ProductName>{product.name}</ProductName>
                      <Track>
                        <Fill $ratio={(product.quantity ?? 0) / topQuantity} />
                      </Track>
                    </ProductInfo>
                    <ProductFigures>
                      <strong>{product.quantity} sold</strong>
                      <span>{money(product.revenue)}</span>
                    </ProductFigures>
                  </ProductRow>
                ))}
              </ProductList>
            </Panel>
          </Row>

          <Row>
            <Panel>
              <PanelHead>
                <PanelTitle>Sales by category</PanelTitle>
                <PanelNote>share of settled revenue</PanelNote>
              </PanelHead>
              <CategoryList>
                {categories.map((category) => (
                  <CategoryRow key={category.name}>
                    <CategoryName>{category.name}</CategoryName>
                    <CategoryBar>
                      <Fill $ratio={(category.revenue ?? 0) / topCategory} />
                    </CategoryBar>
                    <CategoryFigures>
                      {money(category.revenue)}
                      <small>
                        {revenue ? Math.round(((category.revenue ?? 0) / revenue) * 100) : 0}%
                      </small>
                    </CategoryFigures>
                  </CategoryRow>
                ))}
              </CategoryList>
            </Panel>

            <Panel>
              <PanelHead>
                <PanelTitle>On the floor now</PanelTitle>
              </PanelHead>
              <LiveBody>
                <KpiValue>{money(report.openAmount)}</KpiValue>
                <KpiHint>
                  {report.billsOpen} open {report.billsOpen === 1 ? 'bill' : 'bills'} waiting to be
                  settled
                </KpiHint>
              </LiveBody>
              <Button
                variant="secondary"
                fullWidth
                onClick={() => navigate('/tables')}
              >
                Open the floor
                <ArrowForwardIcon />
              </Button>
            </Panel>
          </Row>
        </>
      )}
    </>
  )
}
