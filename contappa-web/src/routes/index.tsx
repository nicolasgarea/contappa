import { createBrowserRouter, Navigate } from 'react-router-dom'

import RootPage from '@pages/RootPage/RootPage'
import TableDetailPage from '@pages/TableDetailPage/TableDetailPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/tables" replace />,
  },
  {
    path: '/tables',
    element: <RootPage />,
  },
  {
    path: '/tables/:id',
    element: <TableDetailPage />,
    errorElement: <div>Table not found or an error occurred</div>,
  },
])

export default router
