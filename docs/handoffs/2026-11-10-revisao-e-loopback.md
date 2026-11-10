# Handoff — revisão sintética e loopback

Spec 004, CA-01 a CA-04. Revisões: front 579d09e, back a7bfaeb. Jest isolado: Test Suites: 1 passed, 1 total; Tests: 1 passed, 1 total. Servidor mínimo: HTTP 200.

## Onde parei
Um subagente independente, com contexto novo e somente evidência sintética, devolveu:

| CA | Resultado | Evidência | Motivo |
|---|---|---|---|
| CA-01 | SEM EVIDÊNCIA | Inventário ausente | Quantidade e estados não demonstrados |
| CA-02 | REPROVADO | TI-0001 e TI-0002 usam a foto Pixabay 123 | A foto precisa ser distinta por equipamento |
| CA-03 | SEM EVIDÊNCIA | Duas execuções não demonstradas | Idempotência não demonstrada |
| CA-04 | SEM EVIDÊNCIA | Login e contagem ausentes | Conta e zero empréstimos não demonstrados |

Veredito: NÃO PRONTA.

## Decisões não óbvias
O erro foi fornecido somente como evidência sintética. Nenhum dado ou código da aplicação foi alterado para esta rodada.

## O que tentei e não funcionou
O CLI do Codex falhou ao iniciar por acesso negado ao estado local. A rodada acima usou o subagente da sessão, sem ferramentas. Jest falhou no ambiente restrito com EACCES ao conectar a 127.0.0.1; o mesmo teste passou com acesso local permitido.

## Próximo passo exato
Rodar o perfil registrado no Codex e guardar a prova da falha plantada e da reversão em commits isolados, antes de marcar a primeira tarefa da spec 004.

## Arquivos relevantes
- backend/src/adaptador.spec.ts
- frontend/.codex/agents/verificador-spec.toml
- frontend/docs/specs/004-dados-iniciais/tasks.md
