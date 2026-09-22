import { useTheme } from 'styled-components'

export function LogoMark({ size = 36 }: { size?: number }) {
  const theme = useTheme()

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width={size}
      height={size}
      fill="none"
      role="img"
      aria-label="Contappa"
    >
      <path
        d="M30.2 14.8A13 13 0 1 0 30.2 33.2"
        stroke={theme.color.text}
        strokeWidth="9"
        strokeLinecap="round"
      />
      <rect
        x="37"
        y="17"
        width="8"
        height="14"
        rx="4"
        fill={theme.color.text}
      />
    </svg>
  )
}
