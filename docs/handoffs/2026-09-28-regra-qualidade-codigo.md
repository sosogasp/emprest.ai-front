# Handoff — implementação de 2026-09-28 (regra de qualidade de código)

| campo | valor |
|---|---|
| fatia | nenhuma — mudança em `rules/` e `AGENTS.md`, sem `CA-xx` |
| CA atendidos | nenhum; tarefa sem critério numerado, declarado conforme `rules/checks.md` passo 5 |
| commits | nenhum ainda — o arquivo está untracked nos dois repositórios |
| checks | `npm run lint` → `LINT_EXIT=0` · `npx tsc -b` → `TSC_EXIT=0` · `npm run build` → `✓ built in 856ms`, `BUILD_EXIT=0` |

## Onde parei

Existe `rules/qualidade-codigo.md` nos dois repositórios, byte a byte igual
(SHA256 `D74729BD…C21F`, 105 linhas), com o SOLID traduzido em regra executável e
exemplos tirados do código real; o `AGENTS.md` dos dois lados ganhou a linha que
a indexa. Nenhum arquivo de código foi alterado: as violações que a regra
descreve continuam no repositório como dívida registrada.

## Decisões não óbvias

- `alwaysApply: true`, e não `globs: ["frontend/src/**", "backend/src/**"]` como
  em `migration.md` e `secrets.md`: SOLID vale em qualquer arquivo de código e o
  custo de esquecer é maior que o de carregar. Se o time preferir o estilo por
  glob, são duas linhas do front-matter.
- Não existe diretório `.cursor/` em nenhum lugar do workspace: `rules/` é o
  único lugar dessas regras, então o espelho `.cursor/rules/` que ficou em
  aberto na sessão anterior não tem para onde ir hoje.
- As violações citadas como exemplo — a contagem de disponíveis de
  `Operacoes.tsx` duplicando `situacaoDoEquipamento`, e o `useAuth(...)!` em duas
  telas — foram **registradas, não consertadas**: consertar seria refatorar fora
  do escopo da tarefa, e o `!` já é a Tarefa 15 da fatia 002.

## O que tentei e não funcionou

- `read_files` com faixa de linhas em `docs/adr/001-stack.md` devolveu
  `[outdated - see the latest file content]` duas vezes seguidas.
  `(Get-Content '001-stack.md')[69..133]` no pwsh leu o trecho na primeira
  tentativa.
- `Get-FileHash ... | Select-Object Hash, Path` imprime vazio neste shell;
  concatenar com `+ (Get-FileHash 'arquivo').Hash` funciona.

## Próximo passo exato

Commitar a regra nos dois repositórios, com o seu ok — `frontend/`:
`git add rules/qualidade-codigo.md AGENTS.md`; `backend/`: os mesmos caminhos.
Depois disso, a Tarefa 9 do `frontend/docs/specs/002-catalogo/tasks.md`
(Vitest + jsdom) é o próximo item da fila, e é o primeiro que já nasce sob esta
regra.

## Arquivos relevantes

- frontend/rules/qualidade-codigo.md e backend/rules/qualidade-codigo.md (idênticos)
- frontend/AGENTS.md e backend/AGENTS.md (linha de índice da regra)
- frontend/docs/specs/002-catalogo/spec.md (Dívida de processo: as duas dívidas
  de código que a regra encontrou e não consertou)
- frontend/docs/specs/002-catalogo/tasks.md (Tarefa 15: o `!` como dívida)
- frontend/docs/handoffs/2026-09-28-q1-e-q2-da-fatia-002.md (handoff anterior)
