# Handoff — implementação de 2026-10-01 (consistência de regras e specs)

| campo | valor |
|---|---|
| fatia | nenhuma — consistência de `rules/` e das specs 001 e 002, sem `CA-xx` |
| CA atendidos | nenhum; tarefa sem critério numerado, declarado conforme `rules/checks.md` passo 5 |
| commits | nenhum ainda — mudanças no working tree do front, espelhadas em `backend/rules/` |
| checks | `npm run lint` → `LINT_EXIT=0` · `npx tsc -b` → `TSC_EXIT=0` · `npm run build` → `✓ built in 2.12s`, `BUILD_EXIT=0` |

## Onde parei

Fechei as contradições de documentação da auditoria. As duas cópias de `rules/`
(byte a byte iguais) agora concordam sobre push, migration e `.env`; a frase
desatualizada do scaffold em `restrictions.md` foi corrigida; e as specs 001 e
002 pararam de citar texto que não existe mais e de pedir "CA-01 a CA-14" (a
spec define 15). Nada foi commitado e nenhum arquivo de código mudou:
`rules/tests.md` e `src/pages/Login.tsx` já apareciam como `M` antes desta
tarefa (não são do escopo dela); `docs/specs/` e vários handoffs seguem
untracked.

## Decisões não óbvias

- **Direção escolhida pelo dono (2026-10-01): o fluxo do `AGENTS.md` vence.**
  `operacao.md` foi alinhado a ele — push direto na `main` é permitido, com os
  checks do `rules/checks.md` passando. Antes, `operacao.md` dizia "nunca na
  produção" e conflitava com `restrictions.md`/`AGENTS.md`.
- **`operacao.md` como referência para os outros dois conflitos.** Migration:
  `migration.md` deixou de exigir aprovação prévia ("PARE. Eu aprovo ou
  corrijo") e passou a "avisar depois", que é o nível que a tabela de
  `operacao.md` já registrava. `.env`: `restrictions.md` deixou de proibir
  ("Não mexa") e passou a "pedir antes", também como `operacao.md`, mantendo a
  proteção do segredo (nenhum valor vai para commit, log ou resposta —
  `secrets.md`).
- **`rules/` continua espelhado.** As três edições saíram no `frontend/` e
  foram copiadas para `backend/`; a conferência por SHA-256 dos 9 arquivos deu
  IGUAL nos dois lados.
- A atribuição de `restrictions.md` ("autorizado em AGENTS.md") foi corrigida:
  o commit está no `AGENTS.md`; o push, no `operacao.md`.

## O que tentei e não funcionou

- Nada de código foi tentado — a tarefa é de documentação. O único atrito foi
  de shell: os checks disparados juntos devolveram saída parcial/bufferizada;
  rodar `tsc` e `build` com a saída em arquivo separado deu o resultado
  completo (`TSC_EXIT=0`, `BUILD_EXIT=0`).

## Próximo passo exato

Revisar o diff e commitar — `frontend/`: `git add rules docs` (as specs e os
handoffs untracked entram junto); `backend/`: `git add rules`. `rules/tests.md`
já estava modificado antes (commit próprio). Depois, a Tarefa 9 de
`docs/specs/002-catalogo/tasks.md` (Vitest + jsdom, CA-01…CA-15) segue sendo o
próximo item que não depende de decisão do time.

## Arquivos relevantes

- frontend/rules/operacao.md, frontend/rules/migration.md, frontend/rules/restrictions.md (espelhados em backend/rules/)
- frontend/docs/specs/001-login/plan.md (pendência 4), frontend/docs/specs/001-login/tasks.md (Tarefa 13)
- frontend/docs/specs/002-catalogo/plan.md, frontend/docs/specs/002-catalogo/tasks.md (CA-01 a CA-15)
- frontend/docs/handoffs/2026-09-28-contrato-de-operacao.md (decisão anterior sobre push)
