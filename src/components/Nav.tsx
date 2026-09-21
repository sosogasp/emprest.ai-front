import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Avatar } from '@/components/Avatar'
import { useAuth } from '@/store/auth'
import type { Papel } from '@/data/demo'

interface Aba {
  para: string
  rotulo: string
  papeis: Papel[]
}

const ABAS: Aba[] = [
  { para: '/', rotulo: 'Catálogo', papeis: ['Colaborador', 'Operações'] },
  { para: '/operacoes', rotulo: 'Operações', papeis: ['Operações'] },
  { para: '/equipamentos', rotulo: 'Equipamentos', papeis: ['Operações'] },
  { para: '/meus', rotulo: 'Meus empréstimos', papeis: ['Colaborador', 'Operações'] },
]

/** Barra sticky de 60px; abas por papel (layout.md §6). */
export function Nav() {
  const usuario = useAuth((s) => s.usuario)
  const sair = useAuth((s) => s.sair)
  const navigate = useNavigate()

  if (!usuario) return null

  const abas = ABAS.filter((a) => a.papeis.includes(usuario.papel))

  function aoSair() {
    sair()
    void navigate('/login')
  }

  return (
    <header className="nav">
      <Link to="/" className="brand">
        <span className="brand-mark" aria-hidden="true" />
        <span className="brand-name" style={{ fontSize: 15 }}>
          EMPREST<span className="ai">.AI</span>
        </span>
      </Link>
      <nav className="nav-tabs" aria-label="Navegação principal">
        {abas.map((aba) => (
          <NavLink
            key={aba.para}
            to={aba.para}
            end={aba.para === '/'}
            className={({ isActive }) => `nav-tab${isActive ? ' active' : ''}`}
          >
            {aba.rotulo}
          </NavLink>
        ))}
      </nav>
      <div className="nav-side">
        <span className="tag tag-outline">{usuario.papel}</span>
        <Avatar iniciais={usuario.iniciais} />
        <span className="nav-user">{usuario.nome}</span>
        <button type="button" className="nav-sair" onClick={aoSair}>
          Sair
        </button>
      </div>
    </header>
  )
}
