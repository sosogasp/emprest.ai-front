# Handoff — implementação de 2026-09-28 (regra de testes e operação)

| campo | valor |
|---|---|
| fatia | nenhuma — mudança em `rules/` e `AGENTS.md`, sem `CA-xx` |
| CA atendidos | nenhum; tarefa sem critério numerado, declarado conforme `rules/checks.md` passo 5 |
| commits | nenhum ainda — os arquivos estão untracked nos dois repositórios |
| checks | `npm run lint` → `LINT_EXIT=0` · `npx tsc -b` → `TSC_EXIT=0` · `npm run build` → `✓ built in 2.02s`, `BUILD_EXIT=0` |

## Onde parei

`rules/tests.md` existe (novo, 79 linhas, byte a byte igual nos dois repos) e
`rules/operacao.md` deixou de ser um arquivo de 0 bytes: virou o esqueleto com
as perguntas `P1` e `P2` e dois `R:` em branco esperando o time. Os dois
`AGENTS.md` indexam a regra nova e pararam de dizer que `operacao.md` está
vazio. Nenhum arquivo de código foi alterado e nenhuma pergunta foi respondida
por mim: o que faltava era decisão do time.

## Decisões não óbvias

- `tests.md` **não prescreve** a biblioteca de render/consulta
  (`@testing-library/react`, `react-dom/test-utils`): a busca mostra que
  nenhuma delas está no ADR-001 §8, que só decide o runner (Vitest), nem no
  `tasks.md`, que só diz `jsdom`. Escolher uma seria escolher biblioteca fora do
  ADR (`rules/restrictions.md`), então o arquivo declara o ponto como **não
  decidido** e manda propor junto com a Tarefa 9 — em vez de fixar o padrão de
  mercado em silêncio.
- `tests.md` aponta para o ADR e para o `checks.md` em vez de repetir a matriz:
  a regra só acrescenta o que não existia — onde o teste mora, o que o nome do
  caso cita e o que fazer enquanto não há runner.
- `operacao.md` ganhou front-matter e um `## Verificação` porque arquivo de 0
  bytes não é regra válida no formato da casa: do jeito antigo, um agente que o
  abrisse não aprendia nada. As proibições já fixadas em `restrictions.md` não
  foram copiadas para dentro dele, só apontadas (passo 4 do `rules/handoff.md`).
- CRLF mantido: a casa usa CRLF sem BOM (`checks.md` começa com `2D 2D 2D 0D`),
  e o `operacao.md` escrito por inserção saiu em LF — foi normalizado antes de
  ser espelhado no backend.

## O que tentei e não funcionou

- `read_files` com faixa de linhas devolveu `[outdated - see the latest file
  content]` em `frontend/AGENTS.md` e em `frontend/rules/qualidade-codigo.md`;
  `(Get-Content 'arquivo')[a..b]` funcionou nos dois.
- `Select-String -Path 'backend/package.json'` falhou com "Cannot find path":
  a pasta `backend/` ainda não tem projeto (`package.json`, `src/`), só `.env`,
  `.gitignore`, `AGENTS.md`, `LICENSE` e `rules/`. É por isso que o passo 1 do
  `rules/checks.md` cita `npm run test` no backend e o script não existe ainda.
- Ler o log de um comando longo deste shell logo após o disparo devolveu
  `[outdated]`; a saída completa (com `LINT_EXIT`, `TSC_EXIT`, `built in 2.02s`)
  só apareceu na última leitura do mesmo arquivo.

## Próximo passo exato

Responder `P1` e `P2` em `rules/operacao.md` — a resposta vale nos dois repos,
que precisam continuar idênticos — ou autorizar o commit do que está parado:
`git add rules/ AGENTS.md` no `frontend/` e os mesmos caminhos no `backend/`.
Se a resposta de `P1` for "pode commitar depois dos checks", ela destrava
também as quatro regras antigas que continuam untracked.

## Arquivos relevantes

- frontend/rules/tests.md e backend/rules/tests.md (novos, idênticos)
- frontend/rules/operacao.md e backend/rules/operacao.md (esqueleto com P1/P2)
- frontend/AGENTS.md e backend/AGENTS.md (índice das duas regras)
- frontend/docs/specs/002-catalogo/tasks.md (Tarefa 9: o runner pendente)
- frontend/docs/handoffs/2026-09-28-regra-qualidade-codigo.md (handoff anterior)
