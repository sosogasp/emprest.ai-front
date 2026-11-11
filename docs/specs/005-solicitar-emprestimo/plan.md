# Plano — Solicitar empréstimo

1. Conferir a convenção de datas e alinhar `docs/layout.md` às regras aprovadas no PRD. Mapear os contratos existentes no backend e no frontend antes de propor alterações.
2. Implementar a operação no backend e consultar os empréstimos próprios. Usar transação e controle de concorrência no banco para proteger tanto o equipamento quanto o limite por pessoa. Validar os dois cenários concorrentes e o isolamento, conforme ADR-001.
3. Atualizar OpenAPI e regenerar o cliente pelo fluxo existente. Integrar catálogo, confirmação, recusas e Meus empréstimos no frontend usando o design system de docs/layout.md, com ADR-003 mantido como proposta pendente de aceite.
4. Rodar checks dos dois repositórios, gerar handoff e encaminhar evidências ao verificador. Registrar em `ENTREGA.md` a tabela final e a conferência de produção com conta separada.
