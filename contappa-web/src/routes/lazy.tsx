import React from 'react'
import { root } from './paths'

const RootPage = React.lazy(() => import('@pages/RootPage'))

export const lazyRoutes = [
  {
    path: root,
    element: <RootPage />,
  },
]
