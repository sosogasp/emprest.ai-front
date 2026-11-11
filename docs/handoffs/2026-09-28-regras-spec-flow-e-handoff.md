# Handoff — implementação de 2026-09-28

| campo | valor |
|---|---|
| fatia | nenhuma — trabalho de processo/documentação, fora de fatia |
| CA atendidos | nenhum |
| commits | nenhum nos dois repositórios (mudanças só no working tree) |
| checks | `frontend`: `npm run lint` → LINT=0 · `npx tsc -b` → TSC=0 · `npm run build` → BUILD_EXIT=0 |

## Onde parei

O ciclo spec → plano → tarefas está escrito e fiado no fluxo: `rules/spec-flow.md`,
`rules/handoff.md` (novos) e `rules/checks.md` + `rules/restrictions.md` + os dois
`AGENTS.md` atualizados para apontar para eles. A spec 001 (login) está completa e
versionada em `frontend/docs/specs/001-login/` (spec com CA-01…CA-12, plano de 7
etapas, tarefas 1–8 `[x]` e 9–14 pendentes). Nada foi commitado: o repositório
`frontend` ainda **não tem nenhum commit** — os 40 arquivos estão só no index.

## Decisões não óbvias

- Handoff datado e acumulado (um arquivo por implementação, em
  `docs/handoffs/`) por decisão do time — é o contrário da aula 3, que pede um só
  `docs/handoff.md` sobrescrito e lista "entradas datadas" como armadilha. A
  divergência está registrada dentro do próprio `rules/handoff.md`, junto com o
  pedido do usuário que a originou, para não parecer descuido na revisão.
- O `docs/` versionado é o do repositório do front (`emprest.ai-front`). A pasta
  `lån\docs` (raiz do workspace) é uma cópia **fora do git**, com PRD/layout/ADR de
  03/09 (mais antigos que os do repo, de 21/09). `lån\ARQUITETURA.md` e
  `lån\.gitignore` são o mesmo caso.
- São dois repositórios git independentes: `frontend/` (projeto inteiro: doc,
  rules, src) e `backend/` (só `AGENTS.md` + `rules/`, 3 commits, remote
  `emprest.ai-back`). `lån/` não é repositório. O `docs/` fica no repo do front
  porque é onde ele já vivia; o backend não tem `docs/`.
- `rules/` existe em dobro com conteúdo **idêntico**; as edições de hoje foram
  feitas nos dois lados e conferidas por SHA-256. Logo, editar uma cópia só é
  drift silencioso.
- A spec 001 documenta comportamento que já existia no código (`src/pages/Login.tsx`
  está modificado e não commitado). Ela é retroativa: Q1, Q2 e Q8 seguem abertas,
  e a dívida está declarada na própria spec.

## O que tentei e não funcionou

- Escrever a spec em `lån\docs\specs\001-login\`: pasta fora de qualquer
  repositório — o `git status` do `checks.md` nunca a veria e ela nunca seria
  commitada. Corrigido movendo para `frontend/docs/specs/001-login/`.
- Rodar o `Copy-Item` dos arquivos e o `Get-FileHash` de conferência **no mesmo
  `run_commands`**: as duas commands rodaram em paralelo e a de hash leu o arquivo
  antes da cópia terminar (`spec.md` "não existe" / "DIFERENTES"). Conferência de
  arquivo recém-copiado tem que ser comando separado, depois.
- `git -C frontend ls-files --others --exclude-standard docs` vazio **não** era
  anomalia do git: `docs/specs/` simplesmente não existia naquele repo ainda.
- As estratégias de `Get-ChildItem | Select-Object Name` e de `Format-Table`
  truncam caminho longo no console desta máquina; para conferir nome completo,
  imprimir string (`$_.FullName`) linha a linha.
- `lån\docs` e `frontend\docs` não são junction nem hardlink — foram conferidos
  `LinkType`, `Target` e `FileId`; são cópias distintas (o `ReparsePoint` que
  aparece em tudo é o placeholder do OneDrive, não link).

## Próximo passo exato

Revisar os textos novos (`rules/spec-flow.md`, `rules/handoff.md`) e commitar os
dois repositórios — no `backend/`, `git add AGENTS.md rules && git commit -m
"chore: regras de spec-flow, handoff e checks"`; no `frontend/`, o mesmo com
`AGENTS.md ARQUITETURA.md rules docs`, lembrando que este seria o **primeiro
commit** do repositório e que `docs/handoffs/` também precisa entrar no `git add`.
Depois disso, retomar a Tarefa 9 da spec 001 (Vitest) — ou responder Q1/Q2/Q8.

## Arquivos relevantes

- frontend/rules/spec-flow.md
- frontend/rules/handoff.md
- frontend/rules/checks.md
- frontend/rules/restrictions.md
- frontend/AGENTS.md
- frontend/ARQUITETURA.md
- frontend/docs/specs/001-login/spec.md
- frontend/docs/specs/001-login/plan.md
- frontend/docs/specs/001-login/tasks.md
- frontend/docs/handoffs/2026-09-28-regras-spec-flow-e-handoff.md
- backend/rules/handoff.md
- backend/rules/spec-flow.md
- backend/AGENTS.md
- backend/.env (intocável — no `.gitignore`)
