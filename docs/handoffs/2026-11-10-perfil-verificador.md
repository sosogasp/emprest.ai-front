# Handoff — perfil do verificador de specs

Spec 004, CA-01 a CA-04. Configuração nos commits frontend 579d09e e backend a7bfaeb. TOML validado nos dois lados. Frontend: typecheck executado, lint com quatro avisos no cliente gerado, Vitest 3 testes passaram. Backend: build e typecheck executados. Jest reportou fetch failed, connect EACCES 127.0.0.1, em src/adaptador.spec.ts.

## Onde parei
O perfil somente leitura e a etapa obrigatória foram versionados nos dois repositórios. A prova com falha plantada continua pendente.

## Decisões não óbvias
A regra exige revisão dos dois hashes em uma rodada para manter a tabela comparável.

## O que tentei e não funcionou
O teste do adaptador não conseguiu acessar a porta local no ambiente atual.

## Próximo passo exato
Executar o perfil em sessão isolada com evidência sanitizada e um CA deliberadamente inválido, guardar a tabela e registrar a reversão antes de fechar a primeira tarefa da spec 004.

## Arquivos relevantes
- agents/verificador-spec.md
- .codex/agents/verificador-spec.toml
- rules/spec-flow.md
- docs/specs/004-dados-iniciais/tasks.md
