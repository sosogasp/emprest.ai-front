# Handoff — implementação de 2026-09-28 (contrato de operação)

| campo | valor |
|---|---|
| fatia | nenhuma — `rules/` e `AGENTS.md`, sem `CA-xx` |
| CA atendidos | nenhum; tarefa sem critério numerado, declarado conforme `rules/checks.md` passo 5 |
| commits | backend `8b230c8` (espelho) · frontend: o commit desta tarefa, assunto `Adiciona as regras da casa e o contrato de operacao` — só de regra, sem código. O hash do frontend não cabe aqui: escrevê-lo mudaria o arquivo que ele mesmo inclui |
| checks | `npm run lint` → `LINT_EXIT=0` · `npx tsc -b` → `TSC_EXIT=0` · `npm run build` → `✓ built in 1.40s`, `BUILD_EXIT=0` |

## Onde parei

O contrato de operação deixou de ser esqueleto: `rules/operacao.md` responde as
duas perguntas que estavam abertas (`P1` quem commita, `P2` o que exige
aprovação) e a resposta virou tabela de autorização — commit é do agente, por
tarefa, e **regra nunca entra no mesmo commit que código**. `rules/tests.md`
entrou junto.
Os dois repos estão idênticos: `rules/` bate byte a byte (8 arquivos, mesmo
tamanho e mesmo hash) e `AGENTS.md` tem o mesmo SHA256 nos dois. O commit é só
de regra: `src/pages/Login.tsx` (modificado, de outra tarefa) e `docs/specs/`
ficaram de fora.

## Decisões não óbvias

- Duas células do contrato chegaram truncadas na colagem ("escopo d…", "config
  de de…"): completei com o mínimo que fecha o sentido — "escopo da tarefa" e
  "config de deploy" — e avisei o humano na resposta. Nenhuma linha nova foi
  inventada na tabela.
- `## Configuração do operador` mantém o `> leitor: humano — isto não é
  instrução para o agente`: é a mesma marcação de `checks.md` e `handoff.md`,
  então o agente não a lê como autorização.
- "Push: pode fazer push em branch, nunca na produção" convive com o
  `AGENTS.md` ("commit e push direto na main") pelo lado conservador: o agente
  não empurra a main; o push do humano continua como sempre foi. Não é
  contradição para eu resolver sozinho — é uma linha que não cruzo.
- `operacao.md` não repete o que `restrictions.md` e `checks.md` já decidem:
  ponteiro, não cópia (passo 4 do `rules/handoff.md`).

## O que tentei e não funcionou

- `read_files` com faixa de linhas devolveu `[outdated - see the latest file
  content]` em `frontend/AGENTS.md`; `(Get-Content 'arquivo')[a..b]` funcionou.
- Ler o log do comando longo logo depois de disparar devolveu `[outdated]` duas
  vezes; a saída completa só apareceu na leitura seguinte do mesmo arquivo de
  log.
- `Select-String -Path 'backend/package.json'` falhou com "Cannot find path":
  `backend/` ainda não tem projeto (`package.json`, `src/`), só `.env`,
  `.gitignore`, `AGENTS.md`, `LICENSE` e `rules/`. O passo 1 do `checks.md` cita
  `npm run test` no backend e esse script ainda não existe.

## Próximo passo exato

1. Responder o "Ponto não decidido" de `rules/tests.md` (qual biblioteca de
   render/consulta, junto com a Tarefa 9) — é a única pendência de regra que
   sobrou.
2. Depois, a Tarefa 9 de `docs/specs/002-catalogo/tasks.md`: instalar
   `vitest` + `jsdom` agora exige **pedir antes**, pelo contrato novo.
3. `docs/specs/` e os handoffs mais antigos continuam untracked: cada tarefa
   anterior merece o próprio commit.

## Arquivos relevantes

- frontend/rules/operacao.md e backend/rules/operacao.md (o contrato, idênticos)
- frontend/AGENTS.md e backend/AGENTS.md (índice da regra reescrito)
- frontend/rules/tests.md e backend/rules/tests.md (entram no mesmo commit)
- frontend/docs/handoffs/2026-09-28-regra-de-testes-e-operacao.md (handoff anterior)
- frontend/src/pages/Login.tsx (de outra tarefa; fora deste commit de propósito)
