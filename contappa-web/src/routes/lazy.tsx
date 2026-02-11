import React from 'react'
import { Navigate } from 'react-router-dom'

export const root = '/tables'
export const tableDetail = '/tables/:id'

export const productsRoot = '/products'
export const productDetail = '/products/:id'

const RootPage = React.lazy(() => import('@pages/RootPage/RootPage'))
const TableDetailPage = React.lazy(() => import('@pages/TableDetailPage/TableDetailPage'))
const ProductsPage = React.lazy(() => import('@pages/ProductsPage/ProductsPage'))
const ProductDetailPage = React.lazy(() => import('@pages/ProductDetailPage/ProductDetailPage'))

export const lazyRoutes = [
  {
    path: '/',
    element: <Navigate to={root} replace />,
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
]
