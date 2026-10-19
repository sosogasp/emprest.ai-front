import type { ReactNode } from 'react'
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Nav } from '@/components/Nav'
import { ToastHost } from '@/components/ToastHost'
import { useAuth } from '@/store/auth'
import Login from '@/pages/Login'
import Catalogo from '@/pages/Catalogo'
import MeusEmprestimos from '@/pages/MeusEmprestimos'
import Operacoes from '@/pages/Operacoes'
import Equipamentos from '@/pages/Equipamentos'
import { Sessao } from '@/components/Sessao'

const queryClient = new QueryClient()

/** Proteção de rota por sessão (ADR-001: React Router data APIs). */
function Protegido() {
  const usuario = useAuth((s) => s.usuario)
  if (!usuario) return <Navigate to="/login" replace />
  return (
    <>
      <Nav />
      <Outlet />
      <ToastHost />
    </>
  )
}

/** Telas de Operações só abrem para o papel Operações (regra 11). */
function SomenteOperacoes({ children }: { children: ReactNode }) {
  const usuario = useAuth((s) => s.usuario)
  if (usuario?.papel !== 'Operações') return <Navigate to="/" replace />
  return <>{children}</>
}

const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  {
    path: '/',
    element: <Protegido />,
    children: [
      { index: true, element: <Catalogo /> },
      { path: 'meus', element: <MeusEmprestimos /> },
      {
        path: 'operacoes',
        element: (
          <SomenteOperacoes>
            <Operacoes />
          </SomenteOperacoes>
        ),
      },
      {
        path: 'equipamentos',
        element: (
          <SomenteOperacoes>
            <Equipamentos />
          </SomenteOperacoes>
        ),
      },
    ],
  },
])

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Sessao><RouterProvider router={router} /></Sessao>
    </QueryClientProvider>
  )
}
