import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import UrlProvider from './context'
import AppLayout from './layouts/app-layout'
import LandingPage from './pages/landing-page'
import Dashboard from './pages/dashboard'
import Auth from './pages/auth'
import Link from './pages/link'
import RequireAuth from './components/RequireAuth'
import RedirectLink from './pages/redirect-link'

import './App.css'

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: '/auth',
        element: <Auth />
      },
      {
        path: '/dashboard',
        element: <RequireAuth><Dashboard /></RequireAuth>
      },
      {
        path: '/',
        element: <LandingPage />
      },
      {
        path: '/link/:id',
        element: <RequireAuth><Link /></RequireAuth>
      },
      {
        path: '/:id',
        element: <RedirectLink />
      }
    ]
  }
])

function App() {
  return (
    <UrlProvider>
      <RouterProvider router={router} />
    </UrlProvider>
  )
}

export default App
