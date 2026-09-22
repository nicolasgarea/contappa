import { useMemo } from 'react'
import type { ReactNode } from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import TableRestaurantOutlinedIcon from '@mui/icons-material/TableRestaurantOutlined'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined'
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined'
import { useTables } from '@api/hooks/useTables'
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
  background-color: ${({ theme }) => theme.color.canvas};
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
    color: ${({ theme }) => theme.color.text};
    font-weight: 700;
  }

  @media (max-width: 900px) {
    flex: 1;
    padding: 0.375rem 0.25rem;
  }
`

const Count = styled.span`
  font-size: 0.6875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.color.textSubtle};
  font-variant-numeric: tabular-nums;
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
              {to === '/tables' && seated > 0 && <Count>{seated} seated</Count>}
            </NavItem>
          ))}
        </Nav>
      </Rail>
      <Main>{children}</Main>
    </Layout>
  )
}
