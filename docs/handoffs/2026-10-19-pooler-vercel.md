# Handoff — conexão da Vercel

Fatia 003, CA-08. Backend: `Tests: 19 passed, 19 total`; lint, typecheck do
adaptador e build terminaram com exit 0. Frontend já publicado; verificações
anteriores continuam válidas porque esta correção altera somente a API.

## Onde parei

A migration inicial foi aplicada com sucesso, sem reset. Tenant, usuário e
vínculo Operações existem; Auth tem uma conta com claim tenant_id. O primeiro
deploy da API falhou com P1001 porque as variáveis da Vercel apontavam ao host
direto sem IPv4. A correção usa o pooler validado sem reenviar credenciais.

## Decisões não óbvias

DNS e faixas oficiais da AWS confirmaram o banco em us-west-2, divergente da
descrição de infraestrutura no ADR-001; nenhuma região foi migrada. SELECT 1
funcionou no pooler aws-0-us-west-2. URLs já configuradas com pooler são preservadas.
Migração usa sessão 5432; runtime usa transação 6543 com pgbouncer e limite 1.

## O que tentei e não funcionou

Poolers da região descrita no ADR recusaram o tenant. Upload do arquivo .env
foi bloqueado pela revisão automática; nenhuma credencial foi enviada por esse
caminho. A normalização usa apenas as variáveis que a usuária já salvou na Vercel.

## Próximo passo exato

Publicar o ajuste de conexão da API, verificar o novo build na Vercel e executar
login real, F5, criação e devolução de um empréstimo. Não declarar esse E2E concluído
antes de observá-lo.

## Arquivos relevantes

- backend/src/conexao.ts, backend/src/conexao.spec.ts
- backend/scripts/deploy.cjs, backend/vercel.json
- backend/src/bootstrap.ts
