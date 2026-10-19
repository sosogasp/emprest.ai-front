# Handoff — login sem scroll e backend publicado

Fatia 003, CA-08 e CA-09. Backend: `Tests: 20 passed, 20 total`, lint e tipos
sem erros; adaptador validado sem socket. Frontend: `Tests 3 passed (3)`, lint
com zero erros (quatro warnings do Orval), typecheck exit 0, `✓ built in 676ms`.

## Onde parei

Backend publicado retorna 401 sem sessão e a usuária confirmou o login real
na tela de Operações. Depois dessa confirmação, o login deixou de exigir 820px
e passou a acompanhar a altura da janela. Medidas locais de documento e viewport
coincidem em 1280×720, 1280×600 e 390×640; o botão fica visível no celular.
O deploy deste ajuste visual será conferido após o push.

## Decisões não óbvias

Não foi aplicado overflow hidden no body: o formulário continua acessível com
zoom, teclado ou janelas excepcionalmente pequenas. Em celular, marketing fica
oculto para priorizar o formulário. O mínimo fixo anterior foi substituído pelo
pedido expresso da usuária, registrado como CA-09.

## O que tentei e não funcionou

O adaptador precisava tratar socket nulo na Vercel; o teste de regressão agora
reproduz esse formato sem banco. A compilação anterior da Vercel também exigia
public/ e metadados do Nest compilado. Os ajustes estão em commits separados.

## Próximo passo exato

Conferir o login publicado após o deploy do CSS, medindo o documento contra o
viewport. Marcar CA-09 concluído em tasks.md após essa verificação.

## Arquivos relevantes

- frontend/src/pages/Login.tsx, frontend/src/index.css
- frontend/docs/specs/003-acesso-real/
- backend/api/index.ts, backend/src/adaptador.spec.ts
