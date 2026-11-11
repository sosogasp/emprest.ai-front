# Tarefas — 001 Login e sessão

Uma tarefa por vez, cada uma citando o CA que atende e cabendo num commit.
`[x]` feito · `[ ]` pendente.

## Tarefa 1 — Store de sessão (CA-08)

- [x] `frontend/src/store/auth.ts` com `usuario`, `entrar`, `entrarDemo`,
      `sair` e `Usuario = { id, nome, iniciais, papel }`.
- Commit: `feat: store de sessão (CA-08)`

## Tarefa 2 — Client do Supabase condicional (CA-11)

- [x] `frontend/src/lib/supabase.ts` cria o client apenas com
      `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`; `.env.example` atualizado.
- Commit: `feat: client supabase-js só com env (CA-11)`

## Tarefa 3 — Rotas protegidas e por papel (CA-06, CA-07)

- [x] `frontend/src/App.tsx`: `Protegido` redireciona para `/login`;
      `SomenteOperacoes` devolve Colaborador ao Catálogo; rotas `/`, `/meus`,
      `/operacoes`, `/equipamentos`.
- Commit: `feat: proteção de rota por sessão e papel (CA-06, CA-07)`

## Tarefa 4 — Tela fiel ao §5.1 (CA-09)

- [x] `frontend/src/pages/Login.tsx`: grade `1.05fr 0.95fr`, `min-height`
      820px, coluna direita de 340px, brilho radial de 520px em
      `left:-160px; top:120px`, título em duas linhas, lead de 16px a 60%,
      três estatísticas, rodapé 12px/40%.
- Commit: `feat: tela de login do layout §5.1 (CA-09)`

## Tarefa 5 — Entrada por credencial (CA-01, CA-02, CA-03)

- [x] `signInWithPassword` no submit; sucesso navega por papel
      (Colaborador → `/`, Operações → `/operacoes`); falha não cria sessão, não
      navega e mostra o motivo.
- Commit: `feat: entrada por e-mail e senha no supabase auth (CA-01..CA-03)`

## Tarefa 6 — Validação de campo (CA-04, CA-05)

- [x] Schema Zod do formulário: obrigatórios e formato `algo@algo.algo`, com
      mensagem junto ao campo.
- Commit: `feat: validação de e-mail e senha no login (CA-04, CA-05)`

## Tarefa 7 — Demonstração fora do bloco do §5.1 (CA-10)

- [x] Entrada de demonstração (Ana Ribeiro · Colaborador, §9) movida para
      depois da régua, com kicker "Protótipo" e aviso de Supabase ausente
      (§10).
- Commit: `chore: isola controle de protótipo no login (CA-10)`

## Tarefa 8 — Checks de fim de tarefa (CA-12)

- [x] `npm run lint` (0), `npx tsc -b` (0), `npm run build` (ok) e dev server
      `GET /login → 200`.
- Commit: sem mudança de arquivo.

---

## Pendentes — dependem de resposta do time ou de aprovação

- [ ] **Tarefa 9 — Teste automatizado com Vitest (CA-01 a CA-10).** Vitest é
      decisão do ADR-001 §8, mas ainda não está no `frontend/package.json`:
      instalar dependência nova exige mostrar antes e esperar.
      Commit previsto: `test: cobre login (CA-01..CA-10)`
- [ ] **Tarefa 10 — Q1 da spec:** decidir a origem de `nome`, `iniciais` e
      `papel` (memberships + `/v1`? claim? `user_metadata`?) e substituir o
      palpite derivado do e-mail.
- [ ] **Tarefa 11 — Q2 da spec:** persistir a sessão entre recarregamentos e
      pular `/login` para quem já tem sessão (hoje a store vive em memória).
- [ ] **Tarefa 12 — Q8 da spec:** "Sair" revogar sessão (`signOut`) além de
      limpar a store.
- [x] **Tarefa 13 — `rules/spec-flow.md` e `rules/restrictions.md`**
      Resolvido: os dois arquivos existem e `restrictions.md` já exige a pasta
      `docs/specs/`; não há mais texto dizendo "não há pasta docs/specs/".
- [ ] **Tarefa 14 — Specs 002 a 005** (Catálogo, Meus empréstimos, Operações,
      Equipamentos) antes de qualquer ajuste nessas telas.
