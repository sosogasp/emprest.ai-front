import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { iniciais as calcularIniciais } from '@/lib/format'
import { useAuth } from '@/store/auth'
import type { Papel } from '@/data/demo'

const schema = z.object({
  email: z.string().min(1, 'Informe o e-mail').regex(/.+@.+\..+/, 'E-mail inválido'),
  senha: z.string().min(1, 'Informe a senha'),
})

type FormLogin = z.infer<typeof schema>

const ESTATISTICAS = [
  { numero: '3', texto: 'itens por pessoa' },
  { numero: '14', texto: 'dias de prazo' },
  { numero: '0', texto: 'linhas para preencher' },
]

/** Login do layout.md §5.1: grade 1.05fr/0.95fr, altura mínima 820px. */
export default function Login() {
  const entrar = useAuth((s) => s.entrar)
  const entrarDemo = useAuth((s) => s.entrarDemo)
  const navigate = useNavigate()
  const [erro, setErro] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormLogin>({ resolver: zodResolver(schema) })

  function entrarCom(usuario: { nome: string; iniciais: string; papel: Papel; id: string }) {
    entrar(usuario)
    navigate(usuario.papel === 'Operações' ? '/operacoes' : '/')
  }

  async function aoEntrar(valores: FormLogin) {
    setErro(null)
    if (supabase) {
      const { error } = await supabase.auth.signInWithPassword({
        email: valores.email,
        password: valores.senha,
      })
      if (error) {
        setErro('E-mail ou senha inválidos.')
        return
      }
      // Nome provisório derivado do e-mail — perfil completo chega com a API.
      const apelido = valores.email.split('@')[0] ?? 'colaborador'
      const nome = apelido.charAt(0).toUpperCase() + apelido.slice(1)
      entrarCom({
        id: `u:${valores.email}`,
        nome,
        iniciais: calcularIniciais(nome),
        papel: 'Colaborador',
      })
      return
    }
    // Sem Supabase configurado: entra na demonstração com os dados do layout.md §9.
    entrarDemo('Colaborador')
    navigate('/')
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', minHeight: '820px' }}>
      {/* Coluna esquerda: gradiente + brilho radial do acento */}
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          padding: '64px 56px',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(160deg, #1b1f2e, #161826 60%)',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: -160,
            top: 120,
            width: 1040,
            height: 1040,
            background:
              'radial-gradient(circle 520px at 50% 50%, rgba(47,184,172,0.16), transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ position: 'relative' }}>
          <span className="brand">
            <span className="brand-mark" aria-hidden="true" />
            <span className="brand-name" style={{ fontSize: 17 }}>
              EMPREST<span className="ai">.AI</span>
            </span>
          </span>
        </div>
        <div style={{ position: 'relative', marginTop: 'auto', maxWidth: 480 }}>
          <h1 style={{ fontSize: 44 }}>
            Empréstimo de equipamentos
            <br />
            sem planilha.
          </h1>
          <p style={{ fontSize: 16, color: 'var(--t62)', marginTop: 11.2 }}>
            Peça, devolva e acompanhe o que está com quem — direto pelo catálogo.
          </p>
        </div>
        <div
          style={{
            position: 'relative',
            display: 'flex',
            gap: 22.4,
            marginTop: 33.6,
            paddingTop: 16.8,
            borderTop: '1px solid var(--color-divider)',
            fontSize: 12.5,
            color: 'var(--t55)',
          }}
        >
          {ESTATISTICAS.map((e) => (
            <span key={e.texto}>
              <strong style={{ color: 'var(--color-accent-500)', fontWeight: 600 }}>{e.numero}</strong>{' '}
              {e.texto}
            </span>
          ))}
        </div>
        <p style={{ position: 'relative', marginTop: 33.6, fontSize: 12, color: 'var(--t40)' }}>
          Operações · TI interno
        </p>
      </section>

      {/* Coluna direita: coluna de 340px centralizada verticalmente */}
      <section
        style={{
          display: 'grid',
          placeItems: 'center',
          padding: '64px 56px',
          background: 'var(--color-bg)',
        }}
      >
        <div style={{ width: 340 }}>
          <h2 style={{ fontSize: 26 }}>Entrar</h2>
          <p style={{ fontSize: 14, color: 'var(--t55)', marginTop: 5.6 }}>Use o e-mail corporativo.</p>
          <form
            onSubmit={handleSubmit(aoEntrar)}
            style={{ display: 'flex', flexDirection: 'column', gap: 11.2, marginTop: 22.4 }}
            noValidate
          >
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                className="input"
                placeholder="nome@empresa.com"
                {...register('email')}
              />
              {errors.email && (
                <span style={{ fontSize: 12, color: 'var(--state-late-fg)' }}>{errors.email.message}</span>
              )}
            </div>
            <div className="field">
              <label htmlFor="senha">Senha</label>
              <input
                id="senha"
                type="password"
                className="input"
                placeholder="••••••••"
                {...register('senha')}
              />
              {errors.senha && (
                <span style={{ fontSize: 12, color: 'var(--state-late-fg)' }}>{errors.senha.message}</span>
              )}
            </div>
            {erro && <p style={{ fontSize: 13, color: 'var(--state-late-fg)' }}>{erro}</p>}
            {!supabase && (
              <p style={{ fontSize: 12, color: 'var(--t45)' }}>
                Supabase não configurado neste ambiente — o botão entra na demonstração.
              </p>
            )}
            <button type="submit" className="btn btn-primary btn-tall btn-block" disabled={isSubmitting}>
              {isSubmitting ? 'Entrando…' : 'Entrar'}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() =>
                entrarCom({ id: 'p6', nome: 'Operações', iniciais: 'OP', papel: 'Operações' })
              }
            >
              Entrar como Operações →
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() =>
                entrarCom({ id: 'p1', nome: 'Ana Ribeiro', iniciais: 'AR', papel: 'Colaborador' })
              }
            >
              Explorar demonstração (Ana Ribeiro) →
            </button>
            <p style={{ fontSize: 12, color: 'var(--t45)', marginTop: 2.8 }}>
              Cada pessoa vê apenas os próprios empréstimos.
            </p>
          </form>
        </div>
      </section>
    </div>
  )
}
