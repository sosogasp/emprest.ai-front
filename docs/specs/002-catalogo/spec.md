# Spec — Catálogo (a tela inicial)

**Status:** implementada em protótipo sobre os dados de exemplo do §9 (o código
foi escrito antes desta spec — ver "Dívida de processo"); o caminho de API não
existe.
**Decidido pelo time em 2026-09-28:** "home" é esta tela (o Catálogo do §5.2,
rota `/`) e o PRD item 3 (solicitar empréstimo) faz parte desta fatia — ver
regra 16.
**Fonte:** `docs/PRD.md` itens 2 e 3 e seção "Regras que Operações já decidiu" ·
`docs/layout.md` §5.2, §3, §4, §6, §7.1, §7.4–§7.9, §7.11, §8, §9, §10 ·
`docs/adr/001-stack.md` §2, §4, §6, §8

## Objetivo

Qualquer pessoa abre a tela inicial e vê, sem perguntar a ninguém, todos os
equipamentos de TI com a situação de cada um — disponível, emprestado (para
quem e até quando) ou em manutenção — e pede emprestado um que esteja
disponível sem sair da tela.

## Vínculo

- **PRD:** item 2 ("Catálogo de equipamentos com a situação de cada um") e item
  3 ("Solicitar empréstimo de um item disponível", que faz parte desta fatia —
  regra 16); seção "Regras que Operações já decidiu" (limite de 3 itens, prazo
  de 14 dias, atraso bloqueia, manutenção não é disponível).
- **Nomenclatura:** o layout **não** tem tela chamada "home". A tela inicial é o
  §5.2 **Catálogo**, na rota `/`, com a aba "Catálogo" (§6), e é essa a tela
  desta spec. Uma tela de resumo nova não está no PRD nem no layout: se o time
  quiser uma, é fatia nova, com desenho próprio e spec própria.
- **ADRs que restringem:**
  - ADR-001 §2 — React + Vite, TypeScript `strict`, React Router (data APIs),
    TanStack Query para estado de servidor, Zustand para o que sobra.
  - ADR-001 §4 — REST em `/v1`, OpenAPI → cliente gerado por orval (nunca
    escrito à mão), erros em RFC 9457, **lista paginada por cursor**, sem tempo
    real (atualização por polling do TanStack Query).
  - ADR-001 §6 — o tenant vem do claim do JWT; a tela nunca manda `tenant_id`.
  - ADR-001 §8 — teste de unidade no front é Vitest; E2E é Playwright.
- **Layout:** §5.2 (a tela), §3 (medidas: grade `minmax(292px, 1fr)` com
  `gap: 16px`, largura máxima 1240px, padding `36px 40px 64px`, card com
  padding 18px e `gap` 12), §4 (classes `.btn`, `.card`, `.chip`), §6 (abas e
  rotas), §7.1 e §7.4–§7.9 (interações), §8 (`fadeUp` dos cards), §9 (dados de
  exemplo), §10 (notas de protótipo).

## Regras

1. `/` é o Catálogo, a tela inicial dos dois papéis e o destino do "Entrar" do
   Colaborador (§6). Sem sessão, `/` cai em `/login` (spec 001, CA-06).
2. O catálogo lista **todos** os equipamentos, com a situação de cada um (PRD
   item 2). O escopo por pessoa do §7.11 vale para os empréstimos, não para o
   catálogo — não existe filtro por pessoa aqui.
3. A situação é derivada no render, nunca gravada na tela (§10): `manutencao`
   quando o item está marcado em manutenção; senão `emprestado` quando existe
   empréstimo em aberto para ele; senão `disponivel`.
4. Manutenção nunca conta como disponível (PRD; §7.6).
5. Cabeçalho (§5.2): H1 "Catálogo" + lead "X de Y equipamentos disponíveis
   agora", onde X são os itens `disponivel` e Y é o total listado — e a busca
   de 260px alinhada à direita.
6. Card (§5.2): kicker de categoria (uppercase 11px) · nome 16.5px · patrimônio
   12px · pill de situação à direita · linha de detalhe com `min-height: 18px` ·
   botão de largura total.
7. A linha de detalhe diz exatamente uma das quatro coisas: "Pronto para
   retirada no balcão" (disponível) · "Com você · devolver até {data}"
   (empréstimo de quem está logado) · "Com {pessoa} · devolver até {data}"
   (empréstimo de outra pessoa) · a observação do item (manutenção) — §5.2,
   §7.6, §7.7.
8. O botão do card tem exatamente um dos seis rótulos de §7.4–§7.7, nesta
   precedência: manutenção → "Indisponível"; emprestado a outra pessoa →
   "Emprestado"; comigo → "Está com você"; atraso → "Bloqueado por atraso";
   limite de 3 → "Limite de 3 itens"; caso contrário → "Solicitar empréstimo",
   o único habilitado e o único primário. Todo botão desabilitado é
   `btn-secondary`.
9. Os quatro chips — Todos · Disponíveis · Emprestados · Em manutenção — são
   exclusivos, e o ativo ganha borda e texto no acento com fundo
   `rgba(47,184,172,0.10)` (§7.9).
10. A busca filtra por nome **e** por patrimônio, case-insensitive, a cada
    tecla e com estado vazio próprio (§7.8).
11. Limite de 3 itens e bloqueio por atraso são regras de produto (PRD): esta
    tela as **representa**. Quem recusa o empréstimo é o backend — autorização
    é do servidor e o front não é fonte da verdade (ADR-001 §7).
12. Com item em atraso, o banner vermelho (§1, §7.5) aparece no topo do
    catálogo com atalho para a tela dos próprios empréstimos, e os botões de
    solicitar viram "Bloqueado por atraso".
13. "Solicitar empréstimo" abre o modal (§5.6, §7.1) com o equipamento e
    "Devolver até = hoje + 14 dias" no resumo. Confirmar registra o empréstimo
    e mostra o toast; fechar sem confirmar não muda nada.
14. Fidelidade visual do §5.2 + §3 + §8 é regra, não preferência: grade
    `repeat(auto-fill, minmax(292px, 1fr))` com `gap: 16px`, conteúdo em
    `max-width: 1240px` com padding `36px 40px 64px`, card com padding 18px,
    cards com `fadeUp .25s ease both`, acento nunca como preenchimento sólido
    (§1) e nenhuma animação em número de KPI, tabela ou navegação (§8).
15. Enquanto o dado é o de exemplo (§9, data de referência 31/08/2026), a tela
    é protótipo visual (§10) e o módulo de dados de exemplo sai quando a API
    existir. A tela nunca busca dado de empréstimo por fora do cliente gerado
    (ADR-001 §4).
16. Esta fatia entrega o catálogo **e** o pedido de empréstimo (PRD itens 2 e 3)
    — decidido pelo time em 2026-09-28; separar entregaria seis rótulos de botão
    sem nenhum funcionar. A devolução (PRD item 4) e a visão de Operações (item
    5) ficam para as fatias seguintes.

## Critérios de aceitação

- CA-01 · `/` renderiza o Catálogo (H1 "Catálogo") e é o destino do "Entrar" do
  Colaborador; sem sessão, `/` redireciona para `/login`
- CA-02 · cabeçalho com H1, lead "X de Y equipamentos disponíveis agora" e busca
  de 260px à direita; com os dados do §9, lê-se "4 de 12 equipamentos
  disponíveis agora" (sobre o Y, ver Q5)
- CA-03 · a grade usa `repeat(auto-fill, minmax(292px, 1fr))` com `gap: 16px`,
  dentro de `max-width: 1240px` e padding `36px 40px 64px`
- CA-04 · cada card traz kicker de categoria, nome, patrimônio, pill de situação
  à direita, linha de detalhe com `min-height: 18px` e botão `btn-block`
- CA-05 · a linha de detalhe corresponde à situação do item e é uma das quatro
  frases da regra 7 — inclusive "Com {pessoa} · devolver até {data}" para item
  com outra pessoa
- CA-06 · item em manutenção: pill cinza, detalhe com a observação e botão
  "Indisponível" desabilitado, fora da contagem de disponíveis
- CA-07 · item com empréstimo em aberto de outra pessoa: botão "Emprestado"
  desabilitado; item comigo: botão "Está com você" desabilitado
- CA-08 · item disponível: botão "Solicitar empréstimo" habilitado e primário
- CA-09 · com 3 empréstimos ativos, todos os botões de solicitar ficam
  desabilitados, `btn-secondary` e com o rótulo "Limite de 3 itens"
- CA-10 · com item em atraso, o banner vermelho aparece no topo com atalho para
  os próprios empréstimos e os botões de solicitar viram "Bloqueado por atraso"
- CA-11 · os quatro chips filtram exclusivamente (Todos, Disponíveis,
  Emprestados, Em manutenção) e o ativo fica com borda/texto no acento e fundo
  `rgba(47,184,172,0.10)`
- CA-12 · a busca filtra por nome e por patrimônio, case-insensitive, a cada
  tecla; sem resultado, aparece o estado vazio próprio
- CA-13 · "Solicitar empréstimo" abre o modal com o equipamento e "Devolver até"
  = hoje + 14 dias; confirmar registra o empréstimo, o card passa a "Está com
  você" e o toast aparece; fechar sem confirmar não muda o estado
- CA-14 · os cards entram com `fadeUp .25s ease both` e não há animação em
  número, tabela ou navegação
- CA-15 · `npm run lint`, `npx tsc -b` e `npm run build` passam no frontend
  (`rules/checks.md` itens 1 e 3)

## Fora de escopo / não decidido

Perguntas que o PRD e o layout **não** respondem. As duas primeiras foram
decididas pelo time em 2026-09-28 e ficam registradas com a resposta, para o
histórico; as demais seguem aguardando, e nenhuma foi implementada por suposição:

- **Q1. ✅ decidida em 2026-09-28 — "home" é esta tela** (§5.2, rota `/`). O PRD
  e o layout não descrevem tela de resumo (o painel de números é o §5.4, de
  Operações); uma tela de resumo seria fatia nova, com desenho e spec próprios.
- **Q2. ✅ decidida em 2026-09-28 — o PRD item 3 (solicitar empréstimo) fica
  nesta fatia** (regra 16), como o código já fazia: o pedido é interação do §5.2
  (§7.1) e o botão faz parte do card. A alternativa — catálogo com seis rótulos
  de botão sem nenhum funcionar — foi descartada pelo time.
- **Q3.** De onde vem o dado? O ADR-001 §4 decide REST em `/v1` com paginação
  por cursor, mas não decide o recurso: `/v1/equipamentos` + empréstimos em
  aberto, ou um payload único com a situação já resolvida? E quem calcula
  `situacao` — o servidor (campo na resposta) ou a tela, como hoje?
- **Q4.** Qual é "hoje" quando o dado vier da API? A tela decide atraso e
  "hoje + 14 dias" com `HOJE_DEMO = 2026-08-31` (§9). Com a API: relógio do
  navegador, do servidor, ou a data que o servidor devolve em cada empréstimo?
  E qual o fuso de um campo que é só data?
- **Q5.** O que entra no "Y" da contagem quando existir paginação por cursor
  (ADR-001 §4)? Hoje Y é o total listado — 12 itens, incluindo os 3 que só
  existem porque estão emprestados no §9 (o §9 lista 9 no catálogo).
- **Q6.** Lista grande: o desenho não tem "carregar mais" nem rolagem infinita,
  e o ADR-001 §4 exige cursor. O que a tela faz com 300 equipamentos?
- **Q7.** Textos que o layout não especifica e o protótipo escolheu: estado
  vazio ("Nenhum equipamento encontrado para esta busca.") e toast de
  confirmação ("Empréstimo registrado").
- **Q8.** Estados de rede: nada no layout diz o que a tela mostra enquanto a API
  carrega, quando a chamada falha (RFC 9457) ou como a lista se atualiza
  (polling do TanStack Query, `staleTime`).
- **Q9.** Ordem dos cards: o §7.10 só diz que o item recém-cadastrado entra no
  topo. A ordem dos demais (patrimônio, nome, criação) não está decidida.

Fora da v1 (do PRD): reserva com data futura, notificação por e-mail,
importação da planilha.

Fora **desta** spec: as telas Meus empréstimos, Operações e Equipamentos (003 em
diante) e o cadastro de equipamento (§5.5, §7.10).

## Contrato afetado

- **Rota:** `/` (index da rota-pai protegida, com a Nav acima e `Outlet` — forma
  escolhida na spec 001, CA-06). O §6 diz "não há rotas aninhadas" ao descrever
  o comportamento do protótipo (troca de tela na mesma janela); a rota-pai não
  empilha tela. Se o time ler o §6 como proibição de rota aninhada, é mudança de
  arquitetura e mexe em `App.tsx` — fora desta fatia.
- **Dados de exemplo:** `src/data/demo.ts` (`useDemo` com `equipamentos`,
  `emprestimos`, `solicitar`) e as derivações `situacaoDoEquipamento`,
  `emprestimoDoItem`, `emprestimosDe`, `temAtraso`; `src/lib/format.ts`
  (`formatarData`, `somarDias`, `estaAtrasado`). O módulo declara que sai quando
  a API existir. Formato que a API precisará fornecer (Q3):
  `Equipamento = { id, nome, categoria, patrimonio, manutencao?, observacao? }`
  e `Emprestimo = { id, equipamentoId, pessoaId, retirada, prazo }`.
- **Constantes de produto usadas na tela:** `LIMITE_ITENS = 3` e
  `PRAZO_PADRAO_DIAS = 14` (PRD — regra); `HOJE_DEMO` (§9 — protótipo, Q4).
- **O que a tela revela:** o nome de quem está com cada item (§5.2, §7.7), para
  qualquer pessoa logada, Colaborador incluído. É decisão do layout e não foi
  mudada aqui; registro porque convive com o PRD item 1 ("cada pessoa vê os
  próprios empréstimos"). Esconder o nome é mudança de layout, não desta spec.
- **O que NÃO pode mudar:** nada de `tenant_id` em corpo ou query (ADR-001 §6);
  nenhum cliente HTTP escrito à mão (ADR-001 §4); nenhum dado de empréstimo lido
  do Supabase pelo navegador (spec 001, CA-11).

## Dívida de processo

A tela foi codada antes de existir `docs/specs/`: entrou no scaffold do front
(`4abc059` — "Cria o app do frontend: scaffold Vite + TS strict, telas da v1 e
design system do layout.md"), junto com as outras telas da v1, com o §10 do
layout autorizando o protótipo. É a mesma inversão de cadeia registrada na spec
001, agora registrada na fatia a que pertence. Da 003 em diante a ordem volta ao
procedimento (`rules/spec-flow.md`).

Risco conhecido do arquivo: `Catalogo.tsx` lê `useAuth((s) => s.usuario)!` — a
garantia de que há usuário vem da rota protegida (001, CA-06), não de uma guarda
dentro da própria tela.

Duas dívidas de código fora do arquivo desta fatia ficaram registradas quando
`rules/qualidade-codigo.md` entrou no repositório (2026-09-28); não foram
consertadas para não refatorar fora do escopo:

- `MeusEmprestimos.tsx` repete o `useAuth((s) => s.usuario)!` de `Catalogo.tsx`
  (a Tarefa 15 cobre só o catálogo) — a correção é uma função só, não o `!`
  repetido.
- `Operacoes.tsx` recalcula "disponível" inline
  (`!e.manutencao && !emprestimos.some(...)`), que já é
  `situacaoDoEquipamento(item, emprestimos) === 'disponivel'`.

As duas pertencem às fatias dessas telas; até elas existirem, ficam aqui.

## Como sei que funcionou

- **CA-02 a CA-10 observados** em smoke de render: `Catalogo` montado dentro do
  `MemoryRouter` com a sessão de Ana Ribeiro (§9), impresso como HTML e
  conferido — cabeçalho ("4 de 12 equipamentos disponíveis agora"), grade
  `repeat(auto-fill, minmax(292px, 1fr))` com `max-width:1240px` e padding
  `36px 40px 64px`, classes do card (`card-item`, `card-kicker`, `card-title`,
  `linha-detalhe`, `btn-block`, `page-title`), os rótulos "Solicitar empréstimo"
  · "Está com você" · "Emprestado" · "Indisponível", as frases de detalhe
  ("Com você · devolver até 12/09/2026", "Com Marcos Lemos · devolver até
  07/09/2026", a observação da manutenção) e, nos casos extremos, "Limite de 3
  itens" (CA-09) e o banner "Você tem um item em atraso" com "Bloqueado por
  atraso" (CA-10).
- **CA-13 pela metade:** a data do modal é derivada no render (`hoje + 14 =
  14/09/2026`, §9); o clique de confirmar e o toast não têm evidência — o modal
  é `createPortal` e precisa de DOM.
- **CA-11 (chips), CA-12 (busca) e CA-14 (animação), por leitura do código:** os
  dois primeiros exigem interação e `fadeUp` é CSS; o smoke não alcança.
- **CA-01 e CA-15:** rota protegida lida em `App.tsx` (001, CA-06); `npm run
  lint` (0), `npx tsc -b` (0) e `npm run build` nesta fatia.
- **Achado do smoke:** para renderizar a tela em Node foi preciso substituir o
  `getInitialState` do zustand — no `renderToString` ele é o *server snapshot*,
  então a store aparece sempre com o estado inicial (`usuario: null`) e a tela
  não renderiza. Não é problema de produção (o app é SPA, ADR-001 §2), mas
  explica por que o smoke da 001 passou fácil: a tela de Login não lê a store de
  sessão. Cobrir os CAs que faltam é a tarefa de Vitest + jsdom.
- **Sem teste versionado:** igual à 001, o teste no repositório ainda não
  existe; Vitest está decidido no ADR-001 §8 e a instalação é tarefa pendente.
