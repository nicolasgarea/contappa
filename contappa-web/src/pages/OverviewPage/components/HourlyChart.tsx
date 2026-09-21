import { useState } from 'react'
import styled from 'styled-components'
import { money, moneyRounded } from '@lib/money'

type HourlyPoint = {
  hour: number
  revenue: number
  bills: number
}

const Plot = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 3rem 1fr;
  flex: 1;
  min-height: 280px;
`

const Axis = styled.div`
  position: relative;
  font-size: ${({ theme }) => theme.font.size.xs};
  color: ${({ theme }) => theme.color.textSubtle};
  font-variant-numeric: tabular-nums;
`

const AxisLabel = styled.span<{ $ratio: number }>`
  position: absolute;
  right: 0.625rem;
  bottom: calc(${({ $ratio }) => $ratio} * (100% - 1.75rem) + 1.75rem);
  transform: translateY(50%);
  line-height: 1;
`

const Field = styled.div`
  position: relative;
  padding-bottom: 1.75rem;
`

const GridLine = styled.span<{ $ratio: number }>`
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(${({ $ratio }) => $ratio} * (100% - 1.75rem) + 1.75rem);
  border-top: 1px ${({ $ratio }) => ($ratio === 0 ? 'solid' : 'dashed')}
    ${({ theme, $ratio }) => ($ratio === 0 ? theme.color.borderStrong : theme.color.border)};
`

const Columns = styled.div`
  position: absolute;
  inset: 0 0 1.75rem 0;
  display: flex;
  align-items: flex-end;
  gap: 2px;
`

const Column = styled.div`
  position: relative;
  flex: 1;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  cursor: default;
`

const Bar = styled.span<{ $ratio: number; $active: boolean }>`
  width: min(56%, 40px);
  height: max(${({ $ratio }) => $ratio * 100}%, 2px);
  border-radius: 4px 4px 0 0;
  background-color: ${({ theme, $active }) =>
    $active ? theme.color.accent[600] : theme.color.accent[500]};
  opacity: ${({ $active }) => ($active ? 1 : 0.9)};
  transition:
    background-color ${({ theme }) => theme.transition.fast},
    height ${({ theme }) => theme.transition.base};
`

const HourLabel = styled.span`
  position: absolute;
  bottom: -1.375rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: ${({ theme }) => theme.font.size.xs};
  color: ${({ theme }) => theme.color.textSubtle};
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
`

const Tooltip = styled.div<{ $ratio: number }>`
  position: absolute;
  left: 50%;
  bottom: calc(${({ $ratio }) => $ratio * 100}% + 0.5rem);
  transform: translateX(-50%);
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  padding: 0.4375rem 0.625rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  background-color: ${({ theme }) => theme.color.ink};
  color: ${({ theme }) => theme.color.inkText};
  box-shadow: ${({ theme }) => theme.shadow.md};
  white-space: nowrap;
  pointer-events: none;

  strong {
    font-size: ${({ theme }) => theme.font.size.sm};
    font-variant-numeric: tabular-nums;
  }

  span {
    font-size: ${({ theme }) => theme.font.size.xs};
    opacity: 0.7;
  }
`

const niceCeiling = (value: number) => {
  if (value <= 0) return 10
  const magnitude = 10 ** Math.floor(Math.log10(value))
  const steps = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]
  const step = steps.find((candidate) => candidate * magnitude >= value) ?? 10
  return step * magnitude
}

const hourText = (hour: number) => `${String(hour).padStart(2, '0')}:00`

export default function HourlyChart({ points }: { points: HourlyPoint[] }) {
  const [active, setActive] = useState<number | null>(null)
  const ceiling = niceCeiling(Math.max(...points.map((point) => point.revenue), 0))
  const ticks = [0, 0.5, 1]
  const labelEvery = points.length > 12 ? 2 : 1

  return (
    <Plot
      role="img"
      aria-label="Sales by hour"
    >
      <Axis>
        {ticks.map((ratio) => (
          <AxisLabel
            key={ratio}
            $ratio={ratio}
          >
            {moneyRounded(ceiling * ratio)}
          </AxisLabel>
        ))}
      </Axis>
      <Field>
        {ticks.map((ratio) => (
          <GridLine
            key={ratio}
            $ratio={ratio}
          />
        ))}
        <Columns>
          {points.map((point, index) => {
            const ratio = point.revenue / ceiling
            return (
              <Column
                key={point.hour}
                onMouseEnter={() => setActive(point.hour)}
                onMouseLeave={() => setActive(null)}
              >
                {active === point.hour && (
                  <Tooltip $ratio={ratio}>
                    <strong>{money(point.revenue)}</strong>
                    <span>
                      {hourText(point.hour)} · {point.bills} {point.bills === 1 ? 'bill' : 'bills'}
                    </span>
                  </Tooltip>
                )}
                <Bar
                  $ratio={ratio}
                  $active={active === point.hour}
                />
                {index % labelEvery === 0 && <HourLabel>{hourText(point.hour)}</HourLabel>}
              </Column>
            )
          })}
        </Columns>
      </Field>
    </Plot>
  )
}
