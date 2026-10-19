# Handoff — acesso real e publicação

Fatia: `003-acesso-real`; CA-01–08 implementados, validação ponta a ponta e
publicação ainda pendentes. Branch nos dois repositórios: `spec/003-acesso-real`.
Checks: backend `Tests: 17 passed, 17 total`; frontend `Tests 3 passed (3)`;
lint e typecheck nos dois sem erros (lint do arquivo Orval tem quatro warnings
gerados); build frontend `✓ built in 3.65s`; build backend e adaptador sem erros.
Docker não está em execução: integração com Postgres local não foi executada.

## Onde parei

Login real exige perfil da API e vínculo de tenant; sessão restaurada pelo
Supabase, logout real, atalhos falsos removidos. Telas usam Orval/TanStack Query
e mutações persistentes; backend valida JWKS, confirma membro e restringe tenant.
Usuária autorizou aplicar a migration inicial remota e informou que atualizou
as conexões de pooler na Vercel. O banco local ainda tem URLs diretas inacessíveis.

## Decisões não óbvias

Nest 11, Prisma 6 e TS 5.9 no backend para compatibilidade com nestjs-zod e
schema existente; sem alteração de entidades ou migrations. Novo fluxo pedido
pela usuária: branch por spec e merge na main. Regra de branch é commit separado.
Deploy da API aplica somente migrations existentes, seed idempotente e, se houver
INITIAL_OPERATOR_EMAIL, vincula essa conta existente ao tenant como Operações.

## O que tentei e não funcionou

Conexão direta remota falhou antes de aplicar migration; o arquivo local não tem
pooler. Supabase estava pausado; após retomada, consultas mostraram tabelas
ausentes e zero usuários na primeira conferência. Não há evidência de login real
ou gravação no banco ainda. Não houve reset, exclusão ou seed de dados fictícios.

## Próximo passo exato

Publicar os commits de `spec/003-acesso-real`, verificar a compilação na Vercel
com as variáveis preenchidas, confirmar migration e conta inicial; testar login,
F5, cadastro, empréstimo e devolução antes de afirmar que está funcionando.

## Arquivos relevantes

- backend/src/modules/acesso/, backend/src/modules/catalogo/
- backend/api/index.ts, backend/vercel.json, backend/scripts/vincular.cjs
- frontend/src/components/Sessao.tsx, frontend/src/data/dados.ts
- frontend/src/api/gerado.ts, frontend/orval.config.ts
- frontend/rules/spec-flow.md, backend/rules/spec-flow.md
