import styled from 'styled-components'

type TableGlyphProps = {
  label: string
  capacity: number
  guests: number
  seated: boolean
  size?: number
}

const Frame = styled.div<{ $size: number }>`
  position: relative;
  width: 100%;
  max-width: ${({ $size }) => `${$size}px`};
  aspect-ratio: 1 / 1;
  flex-shrink: 0;
`

const Surface = styled.div<{ $seated: boolean; $round: boolean }>`
  position: absolute;
  inset: 21%;
  display: grid;
  place-items: center;
  border-radius: ${({ $round }) => ($round ? '50%' : '18%')};
  border: 2px solid
    ${({ theme, $seated }) => ($seated ? theme.color.occupied : theme.color.borderStrong)};
  background-color: ${({ theme, $seated }) =>
    $seated ? theme.color.surface : theme.color.surfaceAlt};
  box-shadow: ${({ theme, $seated }) => ($seated ? theme.shadow.sm : 'none')};
`

const Label = styled.span<{ $seated: boolean; $size: number }>`
  font-family: ${({ theme }) => theme.font.heading};
  font-size: ${({ $size }) => `${Math.round($size * 0.2)}px`};
  font-weight: 700;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  color: ${({ theme, $seated }) => ($seated ? theme.color.text : theme.color.textSubtle)};
`

const Chair = styled.span<{ $filled: boolean }>`
  position: absolute;
  width: 20%;
  height: 8%;
  border-radius: 999px;
  background-color: ${({ theme, $filled }) => ($filled ? theme.color.occupied : 'transparent')};
  border: 2px solid
    ${({ theme, $filled }) => ($filled ? theme.color.occupied : theme.color.borderStrong)};
`

export default function TableGlyph({
  label,
  capacity,
  guests,
  seated,
  size = 96,
}: TableGlyphProps) {
  const seats = Math.max(capacity, 1)
  const round = seats <= 2

  return (
    <Frame
      $size={size}
      aria-hidden="true"
    >
      {Array.from({ length: seats }, (_, index) => {
        const angle = (index / seats) * 2 * Math.PI - Math.PI / 2
        const left = 50 + Math.cos(angle) * 43
        const top = 50 + Math.sin(angle) * 43
        const rotation = (angle * 180) / Math.PI + 90
        return (
          <Chair
            key={index}
            $filled={index < guests}
            style={{
              left: `${left}%`,
              top: `${top}%`,
              transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
            }}
          />
        )
      })}
      <Surface
        $seated={seated}
        $round={round}
      >
        <Label
          $seated={seated}
          $size={size}
        >
          {label}
        </Label>
      </Surface>
    </Frame>
  )
}
