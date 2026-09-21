import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import AppShell from '@components/AppShell/AppShell'

export const overview = '/overview'
export const root = '/tables'
export const tableDetail = '/tables/:id'

export const productsRoot = '/products'
export const productDetail = '/products/:id'
export const categoriesRoot = '/categories'

const OverviewPage = React.lazy(() => import('@pages/OverviewPage/OverviewPage'))
const RootPage = React.lazy(() => import('@pages/RootPage/RootPage'))
const TableDetailPage = React.lazy(() => import('@pages/TableDetailPage/TableDetailPage'))
const ProductsPage = React.lazy(() => import('@pages/ProductsPage/ProductsPage'))
const ProductDetailPage = React.lazy(() => import('@pages/ProductDetailPage/ProductDetailPage'))
const CategoriesPage = React.lazy(() => import('@pages/CategoriesPage/CategoriesPage'))

function ShellLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  )
}

export const lazyRoutes = [
  {
    element: <ShellLayout />,
    children: [
      {
        path: '/',
        element: (
          <Navigate
            to={overview}
            replace
          />
        ),
      },
      {
        path: overview,
        element: <OverviewPage />,
      },
      {
        path: root,
        element: <RootPage />,
      },
      {
        path: tableDetail,
        element: <TableDetailPage />,
      },
      {
        path: productsRoot,
        element: <ProductsPage />,
      },
      {
        path: productDetail,
        element: <ProductDetailPage />,
      },
      {
        path: categoriesRoot,
        element: <CategoriesPage />,
      },
    ],
  },
]
