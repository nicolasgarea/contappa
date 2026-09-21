const shared = {
  radius: {
    sm: '8px',
    md: '10px',
    lg: '14px',
    xl: '18px',
    pill: '9999px',
  },
  font: {
    sans: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
    size: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '0.9375rem',
      md: '1.0625rem',
      lg: '1.25rem',
      xl: '1.5rem',
      '2xl': '1.875rem',
    },
  },
  transition: {
    fast: '120ms ease',
    base: '200ms ease',
  },
  layout: {
    sidebar: '88px',
    orderPanel: '380px',
  },
}

export const lightTheme = {
  ...shared,
  mode: 'light' as 'light' | 'dark',
  color: {
    canvas: '#F6F7F9',
    surface: '#FFFFFF',
    surfaceAlt: '#FAFBFC',
    sunken: '#F2F4F7',
    border: '#E9EBEF',
    borderStrong: '#D7DBE2',
    text: '#14181F',
    textMuted: '#697586',
    textSubtle: '#98A1AE',
    ink: '#111827',
    inkHover: '#1F2937',
    inkText: '#FFFFFF',
    occupied: '#344054',
    occupiedSoft: '#EEF1F5',
    overlay: 'rgba(20, 24, 31, 0.45)',
    accent: {
      base: '#FF7A00',
      soft: '#FFF3E7',
      line: '#FFD4AC',
      400: '#FF9024',
      500: '#FF7A00',
      600: '#E56A00',
      ink: '#FFFFFF',
    },
    success: {
      base: '#16A34A',
      soft: '#E9F7EF',
      line: '#B7E4C7',
      ink: '#FFFFFF',
      hover: '#128A3E',
    },
    danger: { base: '#E5484D', soft: '#FDECEC', line: '#F6C7C9', ink: '#FFFFFF' },
    warning: { base: '#D97706', soft: '#FEF4E6', line: '#FADFB4', ink: '#FFFFFF' },
    info: { base: '#2563EB', soft: '#EAF1FE', line: '#C3D6FB', ink: '#FFFFFF' },
  },
  shadow: {
    xs: '0 1px 2px rgba(20, 24, 31, 0.04)',
    sm: '0 1px 3px rgba(20, 24, 31, 0.06), 0 1px 2px rgba(20, 24, 31, 0.04)',
    md: '0 6px 16px rgba(20, 24, 31, 0.08)',
    lg: '0 18px 40px rgba(20, 24, 31, 0.12)',
    focus: '0 0 0 3px rgba(255, 122, 0, 0.18)',
  },
}

export type AppTheme = typeof lightTheme

export const darkTheme: AppTheme = {
  ...shared,
  mode: 'dark',
  color: {
    canvas: '#0D1014',
    surface: '#151A21',
    surfaceAlt: '#1A2029',
    sunken: '#1F2630',
    border: '#252D38',
    borderStrong: '#37414F',
    text: '#E9EDF3',
    textMuted: '#9BA6B5',
    textSubtle: '#66717F',
    ink: '#E9EDF3',
    inkHover: '#FFFFFF',
    inkText: '#0D1014',
    occupied: '#C3CCD9',
    occupiedSoft: '#222A35',
    overlay: 'rgba(3, 5, 8, 0.7)',
    accent: {
      base: '#FF8A1F',
      soft: 'rgba(255, 138, 31, 0.13)',
      line: 'rgba(255, 138, 31, 0.38)',
      400: '#FFA043',
      500: '#FF8A1F',
      600: '#FFA043',
      ink: '#160A00',
    },
    success: {
      base: '#3FCB7A',
      soft: 'rgba(63, 203, 122, 0.12)',
      line: 'rgba(63, 203, 122, 0.32)',
      ink: '#04170C',
      hover: '#5BD991',
    },
    danger: {
      base: '#F2686C',
      soft: 'rgba(242, 104, 108, 0.12)',
      line: 'rgba(242, 104, 108, 0.34)',
      ink: '#1B0506',
    },
    warning: {
      base: '#F0A43A',
      soft: 'rgba(240, 164, 58, 0.12)',
      line: 'rgba(240, 164, 58, 0.32)',
      ink: '#1A0F00',
    },
    info: {
      base: '#6C9CFF',
      soft: 'rgba(108, 156, 255, 0.12)',
      line: 'rgba(108, 156, 255, 0.32)',
      ink: '#050B1A',
    },
  },
  shadow: {
    xs: '0 1px 2px rgba(0, 0, 0, 0.3)',
    sm: '0 1px 3px rgba(0, 0, 0, 0.4)',
    md: '0 8px 20px rgba(0, 0, 0, 0.45)',
    lg: '0 20px 48px rgba(0, 0, 0, 0.6)',
    focus: '0 0 0 3px rgba(255, 138, 31, 0.28)',
  },
}

export default lightTheme
