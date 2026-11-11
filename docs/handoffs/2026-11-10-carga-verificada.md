# Handoff — carga de equipamentos verificada

Spec 004 CA-01/02/03. Verificador registrado em contexto novo e somente leitura. Frontend 6545035cd27e11ffc2f071b7bcaa67a59fa7910a; backend 5b389f93d1b0479196c5a1beb8222ae4ec46bf3c.

## Onde parei
O verificador não encontrou defeito concreto de correção na implementação local. A carga local está concluída e o roteiro humano está em carga-equipamentos.md.
Checks documentados: backend Test Suites 4 passed / Tests 26 passed; frontend Tests 3 passed; lint, typecheck e build passaram. O reset das migrations ocorreu em PostgreSQL descartável por Testcontainers.

| CA | Resultado | Evidência e pendência |
|---|---|---|
| CA-01 | SEM EVIDÊNCIA | Dataset e teste local comprovam os 12 equipamentos e estados; carga no tenant final aguarda execução humana |
| CA-02 | APROVADO | Manifesto e verificação pública comprovam 12 imagens 800×600, créditos, HTTP 200 e SHA-256 |
| CA-03 | SEM EVIDÊNCIA | Código e testes provam upserts, IDs, empréstimo, isolamento e concorrência; dupla execução no tenant final e identidade da conta docente aguardam evidência |
| CA-04 | SEM EVIDÊNCIA | Provisionamento, login e zero empréstimos da conta docente continuam pendentes |

Veredito global: spec 004 NÃO PRONTA. A preparação local e a publicação de fotos têm evidência; a carga e a conta em produção ainda precisam de comprovação.

## Decisões não óbvias
O script exige o tenant existente como argumento. As instruções identificam suporte_ti como o tenant criado pelo seed/provisionamento anterior, com confirmação pela responsável antes de executar.
O código usa a mesma trava de tenant da solicitação de empréstimo existente e mantém toda a carga numa transação.

## O que tentei e não funcionou
A leitura de dependências novas no OneDrive falhou no ambiente original. A cópia temporária com os mesmos 60 arquivos e lockfile passou nos testes, inclusive o comando real da carga. A versão compatível de Testcontainers e os avisos de auditoria estão documentados no handoff anterior.

## Próximo passo exato
A responsável executa a migration e a carga conforme docs/specs/004-dados-iniciais/carga-equipamentos.md, confere o tenant e repete a carga para registrar os mesmos IDs. Depois, preparar a tarefa separada de conta docente.

## Arquivos relevantes
- docs/handoffs/2026-11-10-carga-local-equipamentos.md
- docs/specs/004-dados-iniciais/carga-equipamentos.md
- docs/specs/004-dados-iniciais/verificacao-local-carga.json
- docs/specs/004-dados-iniciais/verificacao-publica.json
- backend/prisma/carregar-equipamentos.ts
- backend/prisma/carregar-equipamentos.spec.ts