const theme = {
  color: {
    canvas: '#0C0C0E',
    surface: '#141418',
    surfaceAlt: '#1C1C22',
    sunken: '#222228',
    border: '#28282F',
    borderStrong: '#3A3A44',
    text: '#F0F0F0',
    textMuted: '#A0A0AA',
    textSubtle: '#6C6C78',
    ink: '#F0F0F0',
    inkText: '#0C0C0E',
    occupied: '#F0F0F0',
    occupiedSoft: '#1C1C22',
    overlay: 'rgba(0, 0, 0, 0.7)',
    accent: {
      base: '#5CF2A8',
      soft: 'rgba(92, 242, 168, 0.1)',
      line: 'rgba(92, 242, 168, 0.35)',
      400: '#7DF6BB',
      500: '#5CF2A8',
      600: '#3FD98E',
      ink: '#062A19',
    },
    success: {
      base: '#5CF2A8',
      soft: 'rgba(92, 242, 168, 0.1)',
      line: 'rgba(92, 242, 168, 0.3)',
      ink: '#062A19',
      hover: '#7DF6BB',
    },
    danger: {
      base: '#FF4D6D',
      soft: 'rgba(255, 77, 109, 0.12)',
      line: 'rgba(255, 77, 109, 0.35)',
      ink: '#2A0510',
    },
    warning: {
      base: '#FFC400',
      soft: 'rgba(255, 196, 0, 0.12)',
      line: 'rgba(255, 196, 0, 0.35)',
      ink: '#2A2000',
    },
    info: {
      base: '#3A86FF',
      soft: 'rgba(58, 134, 255, 0.12)',
      line: 'rgba(58, 134, 255, 0.35)',
      ink: '#04122E',
    },
  },
  radius: {
    sm: '10px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    pill: '9999px',
  },
  shadow: {
    xs: 'none',
    sm: 'none',
    md: '0 12px 32px rgba(0, 0, 0, 0.45)',
    lg: '0 24px 64px rgba(0, 0, 0, 0.6)',
    focus: '0 0 0 3px rgba(92, 242, 168, 0.3)',
  },
  font: {
    heading: "'Space Grotesk', 'Inter', system-ui, sans-serif",
    sans: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
    size: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '0.9375rem',
      md: '1.0625rem',
      lg: '1.25rem',
      xl: '1.5rem',
      '2xl': '2rem',
    },
  },
  transition: {
    fast: '150ms ease',
    base: '200ms ease',
  },
  layout: {
    sidebar: '88px',
    orderPanel: '380px',
  },
} as const

export type AppTheme = typeof theme

export default theme
