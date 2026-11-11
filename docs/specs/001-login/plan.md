# Plano — 001 Login e sessão

**Status geral:** implementado e verificado. Este plano descreve como a fatia foi
construída; o que está *(pendente)* é dívida aberta e não foi feito.

**Restrições que valem para todo o plano:** ADR-001 §2 (bibliotecas do front),
§7 (Supabase Auth, cadastro fechado, token no header), §4 (contrato REST/orval),
§6 (tenant no claim). Layout §5.1, §6, §7.11, §10.

## Etapa 1 — Sessão de cliente

Objetivo: guardar quem está logado e qual o papel, para as telas internas e a
barra de navegação.

Arquivos:
- `frontend/src/store/auth.ts` (novo) — `useAuth` com `usuario`, `entrar`,
  `entrarDemo`, `sair`; `Usuario = { id, nome, iniciais, papel }`.
- `frontend/src/data/demo.ts` (fonte dos dados do §9 usados pela demonstração).

Verificação: typecheck; `usuario` é a única fonte de identidade das telas.

## Etapa 2 — Client do Supabase

Objetivo: criar o client **só** quando as variáveis existirem, para o app rodar
sem Supabase configurado.

Arquivos: `frontend/src/lib/supabase.ts`, `frontend/.env.example`
(`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_URL`).

Verificação: sem as variáveis, `supabase` é `null` e nenhuma chamada é feita.

## Etapa 3 — Rotas protegidas e por papel

Objetivo: nenhuma tela interna abre sem sessão; telas de balcão só para
Operações (layout §6, §7.11).

Arquivos: `frontend/src/App.tsx` (`Protegido`, `SomenteOperacoes`,
`createBrowserRouter`), `frontend/src/components/Nav.tsx`.

Verificação: visitar `/`, `/meus`, `/operacoes`, `/equipamentos` sem sessão cai
em `/login`; Colaborador em `/operacoes` cai no Catálogo (CA-06, CA-07).

## Etapa 4 — A tela do §5.1

Objetivo: reproduzir o §5.1 elemento por elemento (regra 8 da spec).

Arquivos: `frontend/src/pages/Login.tsx`, `frontend/src/index.css` (tokens:
acento teal `#2fb8ac`, Raleway — layout §1 e §2).

Verificação: grade `1.05fr 0.95fr`, `min-height: 820px`, brilho radial de 520px
em `left:-160px; top:120px`, coluna direita de 340px, título em duas linhas,
lead de 16px a 60%, faixa de três estatísticas, rodapé 12px/40% (CA-09).

## Etapa 5 — Entrada por credencial

Objetivo: entrar pelo Supabase Auth com e-mail e senha e navegar conforme o
papel.

Arquivos: `frontend/src/pages/Login.tsx` (`signInWithPassword`, `entrarCom`).

Verificação: CA-01, CA-02 e CA-03 (falha não cria sessão nem navega).

## Etapa 6 — Validação de campo

Objetivo: barrar formato inválido antes de falar com o Supabase (ADR-001 §2 —
React Hook Form + `zodResolver`).

Arquivos: `frontend/src/pages/Login.tsx` (schema Zod do formulário).

Verificação: CA-04 e CA-05.

## Etapa 7 — Demonstração isolada do bloco visual

Objetivo: com Supabase ausente, a tela continua utilizável sem sujar a
reprodução do §5.1 — os controles de protótipo (§10) ficam depois da régua,
com kicker "Protótipo".

Arquivos: `frontend/src/pages/Login.tsx`.

Verificação: CA-10; a coluna direita do §5.1 termina na nota "Cada pessoa vê
apenas os próprios empréstimos".

## Pendências (não implementadas — precisam de decisão ou aprovação)

1. **Teste automatizado da tela** (CA-01 a CA-10). Vitest já é decisão do
   ADR-001 §8, mas ainda não está no `package.json`; instalar é dependência
   nova → mostrar e esperar.
2. **Q1 e Q2 da spec** (origem de `nome`/`papel` e persistência da sessão):
   não implementar por suposição; hoje o nome sai do e-mail e a store vive em
   memória.
3. **Q8** (`signOut` no "Sair").
4. **`rules/spec-flow.md` e `rules/restrictions.md`** — já resolvido: os dois
   arquivos existem e `restrictions.md` já exige a pasta `docs/specs/`; não há
   mais texto dizendo "não há pasta docs/specs/".
5. **Specs 002 a 005** (Catálogo, Meus empréstimos, Operações, Equipamentos)
   antes de qualquer ajuste nessas telas.

## Verificação (rules/checks.md)

- `cd frontend && npm run lint && npx tsc -b`
- `cd frontend && npm run build`
- `git status --short` — indisponível nesta pasta (não é repositório git);
  o escopo foi confirmado por listagem de arquivos.
