import { createBrowserRouter } from 'react-router-dom'

import RootPage from '@pages/RootPage/RootPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
  },
])

export default router
