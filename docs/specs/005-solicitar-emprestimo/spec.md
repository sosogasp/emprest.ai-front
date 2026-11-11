# 005 — Solicitar empréstimo

## Objetivo
Permitir que o colaborador solicite equipamento disponível e acompanhe seus empréstimos em aberto.

## Vínculo
PRD v1 itens 1–3, layout §§5.2, 5.3, 6 e 7, ADR-001 (REST, Prisma e isolamento por tenant) e ADR-003 (design system).

## Regras
- Depende da carga 004. A confirmação cria o empréstimo na hora, sem aprovação ou fila.
- O catálogo mostra foto, nome, categoria e situação. Exibe crédito com link para Pixabay, conforme a decisão sobre a fonte das fotos.
- Cada pessoa pode ter até três empréstimos em aberto. Qualquer empréstimo em atraso bloqueia nova solicitação.
- A devolução vence 14 dias úteis depois da solicitação. Contar a partir do dia seguinte, excluindo sábado e domingo. Feriados ficam para uma etapa futura.
- Validar disponibilidade, limite e atraso no servidor. A criação e a alteração de disponibilidade devem ser atômicas.

## Critérios de aceitação
- CA-01 — O catálogo autenticado apresenta os 12 itens com foto e crédito. Itens em manutenção ou emprestados não podem ser solicitados, inclusive por chamada direta à API.
- CA-02 — A confirmação cria um empréstimo em aberto e altera a disponibilidade do item. Uma retirada na sexta-feira 6 de novembro de 2026 vence na quinta-feira 26 de novembro de 2026.
- CA-03 — O quarto empréstimo ou uma solicitação com atraso existente é recusado com motivo visível. Solicitações concorrentes também respeitam o limite por pessoa.
- CA-04 — Duas solicitações simultâneas pelo mesmo item geram exatamente um empréstimo. A outra recebe uma recusa visível.
- CA-05 — Meus empréstimos mostra os empréstimos em aberto da pessoa autenticada e a data prevista, sem expor empréstimos de outras pessoas ou tenants.

## Fora de escopo
Devolução, tela de Operações, reservas futuras, e-mails, renovação e calendário de feriados.

## Contrato afetado
Contrato REST do catálogo, criação de empréstimo, consulta de empréstimos próprios e erros de regra de negócio.

## Dívida de processo
O limite de três itens segue a decisão mais recente da responsável de manter o PRD original. A proposta anterior de cinco não foi implementada. O layout ainda cita prazo de 14 dias corridos. Alinhar as instruções vigentes ao PRD durante a fatia. A data de referência deve seguir a convenção existente de datas do app. Se não houver convenção, definir o fuso com a responsável antes da implementação.

## Como sei que funcionou
Testes de integração para as recusas, concorrência e isolamento, verificação do calendário e conferência da interface com uma conta de teste. O verificador registra evidência por CA.
