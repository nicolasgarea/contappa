import { useMemo } from 'react'
import type { ReactNode } from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import TableRestaurantOutlinedIcon from '@mui/icons-material/TableRestaurantOutlined'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined'
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import { useTables } from '@api/hooks/useTables'
import { useThemeMode } from '@styles/ThemeMode'
import { LogoMark } from '@components/Brand/Logo'

const Layout = styled.div`
  display: grid;
  grid-template-columns: ${({ theme }) => theme.layout.sidebar} minmax(0, 1fr);
  min-height: 100vh;

  @media (max-width: 900px) {
    grid-template-columns: minmax(0, 1fr);
  }
`

const Rail = styled.aside`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 1.125rem 0 1rem;
  background-color: ${({ theme }) => theme.color.surface};
  border-right: 1px solid ${({ theme }) => theme.color.border};
  position: sticky;
  top: 0;
  height: 100vh;

  @media (max-width: 900px) {
    position: fixed;
    top: auto;
    left: 0;
    right: 0;
    bottom: 0;
    flex-direction: row;
    justify-content: space-between;
    height: auto;
    gap: 0.25rem;
    padding: 0.375rem 0.75rem calc(0.375rem + env(safe-area-inset-bottom));
    border-right: none;
    border-top: 1px solid ${({ theme }) => theme.color.border};
    z-index: 50;
  }
`

const Home = styled(NavLink)`
  display: grid;
  place-items: center;

  @media (max-width: 900px) {
    display: none;
  }
`

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  width: 100%;
  padding: 0 0.5rem;

  @media (max-width: 900px) {
    flex-direction: row;
    flex: 1;
    justify-content: space-around;
    width: auto;
    padding: 0;
  }
`

const NavItem = styled(NavLink)`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5625rem 0.25rem 0.4375rem;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: ${({ theme }) => theme.color.textMuted};
  transition:
    background-color ${({ theme }) => theme.transition.fast},
    color ${({ theme }) => theme.transition.fast};

  svg {
    font-size: 1.4375rem;
  }

  &:hover {
    background-color: ${({ theme }) => theme.color.sunken};
    color: ${({ theme }) => theme.color.text};
  }

  &.active {
    background-color: ${({ theme }) => theme.color.accent.soft};
    color: ${({ theme }) => theme.color.accent[600]};
  }

  @media (max-width: 900px) {
    flex: 1;
    padding: 0.375rem 0.25rem;
  }
`

const Dot = styled.span`
  position: absolute;
  top: 0.3125rem;
  left: calc(50% + 0.375rem);
  min-width: 1.0625rem;
  height: 1.0625rem;
  padding: 0 0.25rem;
  display: grid;
  place-items: center;
  border-radius: ${({ theme }) => theme.radius.pill};
  background-color: ${({ theme }) => theme.color.accent[500]};
  color: ${({ theme }) => theme.color.accent.ink};
  border: 2px solid ${({ theme }) => theme.color.surface};
  font-size: 0.625rem;
  font-weight: 700;
  line-height: 1;
  font-variant-numeric: tabular-nums;
`

const Spacer = styled.div`
  flex: 1;

  @media (max-width: 900px) {
    display: none;
  }
`

const ThemeButton = styled.button`
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.color.border};
  background-color: ${({ theme }) => theme.color.surface};
  color: ${({ theme }) => theme.color.textMuted};
  transition: all ${({ theme }) => theme.transition.fast};

  svg {
    font-size: 1.1875rem;
  }

  &:hover {
    border-color: ${({ theme }) => theme.color.borderStrong};
    color: ${({ theme }) => theme.color.text};
  }
`

const Main = styled.main`
  min-width: 0;
  padding: 1.75rem 2.25rem 3rem;

  @media (max-width: 900px) {
    padding: 1.25rem 1rem 6rem;
  }
`

const items = [
  { label: 'Overview', to: '/overview', icon: <InsightsOutlinedIcon /> },
  { label: 'Floor', to: '/tables', icon: <TableRestaurantOutlinedIcon /> },
  { label: 'Products', to: '/products', icon: <RestaurantMenuIcon /> },
  { label: 'Categories', to: '/categories', icon: <CategoryOutlinedIcon /> },
]

export default function AppShell({ children }: { children: ReactNode }) {
  const { mode, toggle } = useThemeMode()
  const { data: tables } = useTables()

  const seated = useMemo(
    () => (tables ?? []).filter((table) => (table.activeBills?.length ?? 0) > 0).length,
    [tables],
  )

  return (
    <Layout>
      <Rail>
        <Home
          to="/overview"
          aria-label="Contappa"
        >
          <LogoMark size={40} />
        </Home>

        <Nav>
          {items.map(({ label, to, icon }) => (
            <NavItem
              key={to}
              to={to}
            >
              {icon}
              {label}
              {to === '/tables' && seated > 0 && <Dot>{seated}</Dot>}
            </NavItem>
          ))}
        </Nav>

        <Spacer />

        <ThemeButton
          type="button"
          onClick={toggle}
          aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={mode === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          {mode === 'dark' ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
        </ThemeButton>
      </Rail>
      <Main>{children}</Main>
    </Layout>
  )
}
