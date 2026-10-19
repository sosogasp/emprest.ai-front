# Handoff — publicação confirmada

Fatia 003, CA-01–09. Backend: `Tests: 20 passed, 20 total`; frontend:
`Tests 3 passed (3)` e `✓ built in 676ms`. Lint, tipos e builds sem erros;
quatro warnings são diretivas geradas pelo Orval. Sem teste de integração com
Postgres local porque o Docker não estava em execução.

## Onde parei

Front e API publicados. `GET /v1/me` sem credenciais retorna 401 em produção;
usuária confirmou que o login real funcionou. Depois disso foi publicado o ajuste
do login: viewport e documento em produção medem 1280×720, sem rolagem forçada.
O CSS publicado é index-Cp-tO963.css; celular e janela baixa foram medidos localmente.

## Decisões não óbvias

Cada spec agora usa branch spec/NNN-nome-curto e merge na main, nos dois repos.
A API adapta req.socket nulo da Vercel; há regressão automatizada sem banco.
Ver contexto de infraestrutura em 2026-10-19-pooler-vercel.md.

## O que tentei e não funcionou

As falhas de configuração e runtime estão registradas nos dois handoffs de hoje.
Nenhuma senha ou chave foi commitada. O fluxo completo de cadastro, empréstimo
e devolução ainda não foi observado no navegador; as regras foram testadas.

## Próximo passo exato

Em /equipamentos, cadastrar o primeiro equipamento real e validar o ciclo de
empréstimo/devolução com uma conta de Colaborador. Inventário começou vazio;
não foram inseridos equipamentos fictícios em produção.

## Arquivos relevantes

- frontend/docs/specs/003-acesso-real/
- frontend/rules/spec-flow.md, backend/rules/spec-flow.md
- frontend/src/pages/Login.tsx, frontend/src/index.css
- backend/api/index.ts, backend/src/adaptador.spec.ts
