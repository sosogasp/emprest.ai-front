# Plano — 002 Catálogo (a tela inicial)

**Status geral:** a tela existe desde o scaffold do front (`4abc059`) e está
verificada nos critérios que o smoke alcança (ver "Como sei que funcionou" da
spec). Este plano descreve como a fatia foi construída e o que está
*(pendente)* — dependente de decisão do time ou de aprovação.

**Restrições que valem para todo o plano:** ADR-001 §2 (bibliotecas do front),
§4 (REST `/v1`, cliente orval, RFC 9457, paginação por cursor), §6 (tenant no
claim), §8 (Vitest/Playwright). Layout §5.2, §3, §4, §6, §7.1, §7.4–§7.9,
§7.11, §8, §9, §10.

## Etapa 1 — Dados de exemplo e derivações

Objetivo: ter a situação de cada item sem gravar estado derivado (layout §10) e
os números do produto (3 itens, 14 dias) num lugar só.

Arquivos: `frontend/src/data/demo.ts` (novo) — `useDemo`, `PESSOAS`,
`LIMITE_ITENS`, `PRAZO_PADRAO_DIAS`, `HOJE_DEMO`, `situacaoDoEquipamento`,
`emprestimoDoItem`, `emprestimosDe`, `temAtraso`; `frontend/src/lib/format.ts`
(`formatarData`, `somarDias`, `estaAtrasado`).

Verificação: CA-02 e CA-05.

## Etapa 2 — Rota e barra

Objetivo: `/` abrir o Catálogo para os dois papéis, com a barra de §6 e sem
`tenant_id` no cliente (ADR-001 §6).

Arquivos: `frontend/src/App.tsx` (rota-pai protegida + `Outlet`),
`frontend/src/components/Nav.tsx`.

Verificação: CA-01.

## Etapa 3 — Cabeçalho, grade e card

Objetivo: reproduzir o §5.2 com as medidas do §3 (largura 1240px, padding
`36px 40px 64px`, grade `minmax(292px, 1fr)` com `gap: 16px`, card com padding
18px).

Arquivos: `frontend/src/pages/Catalogo.tsx` (novo), `frontend/src/index.css`
(`.page-head`, `.page-title`, `.page-lead`, `.card-item`, `.linha-detalhe`).

Verificação: CA-02, CA-03, CA-04.

## Etapa 4 — Situação no botão e na linha de detalhe

Objetivo: os rótulos do §7.4–§7.7 com a precedência da regra 8 e as quatro
frases de detalhe da regra 7.

Arquivos: `frontend/src/pages/Catalogo.tsx` (`estadoDoBotao`, `linhaDetalhe`),
`frontend/src/components/Pill.tsx`.

Verificação: CA-05 a CA-08 (observados no smoke), CA-09 e CA-10 nos casos
extremos (3 itens e atraso).

## Etapa 5 — Chips de filtro e busca

Objetivo: filtro exclusivo por situação (§7.9) e busca por nome + patrimônio,
case-insensitive, a cada tecla (§7.8).

Arquivos: `frontend/src/pages/Catalogo.tsx`, `frontend/src/index.css`
(`.chip`, `.empty`).

Verificação: CA-11 e CA-12 — **por leitura do código**: filtrar exige
interação, que o smoke não tem.

## Etapa 6 — Banner de atraso

Objetivo: avisar o bloqueio no topo do catálogo, com atalho para os próprios
empréstimos (§7.5).

Arquivos: `frontend/src/pages/Catalogo.tsx`, `frontend/src/index.css`
(`.banner`).

Verificação: CA-10 (observado no smoke, com empréstimo vencido).

## Etapa 7 — Modal de solicitar e toast

Objetivo: pedir o item sem sair da tela, com "Devolver até = hoje + 14 dias"
(§7.1, §5.6) e confirmação visível (§8).

Arquivos: `frontend/src/pages/Catalogo.tsx` (`confirmarSolicitacao`),
`frontend/src/components/Modal.tsx`, `frontend/src/store/toasts.ts`,
`frontend/src/components/ToastHost.tsx`.

Verificação: CA-13 — a data derivada foi conferida (`hoje + 14 = 14/09/2026`);
o clique de confirmar e o toast dependem de DOM.

## Pendências (não implementadas — precisam de decisão ou aprovação)

1. **Teste de tela com Vitest + jsdom** (CA-01 a CA-15): é o que cobre o que o
   smoke não alcança — chips, busca, clique do modal, toast e animação. Vitest é
   decisão do ADR-001 §8 e ainda não está no `package.json`: dependência nova se
   mostra antes e se espera. Mesma pendência da 001.
2. **Q2 da spec — respondida em 2026-09-28:** o PRD item 3 (solicitar
   empréstimo) fica nesta fatia. O recorte do `tasks.md` está fechado; o que
   falta para começar é só a aprovação da dependência nova da Tarefa 9.
3. **Q3 e Q4** (origem do dado e "hoje"): enquanto não houver resposta, a tela
   continua sobre os dados do §9 com a data congelada em 31/08/2026. Mexer em
   `HOJE_DEMO` sem decidir "hoje" seria implementar por suposição.
4. **Q5 a Q9** (contagem com paginação, lista grande, textos de vazio/toast,
   estados de rede, ordem dos cards): dependem da API e da resposta do time.
5. **Ponto de tensão do §7.11:** o catálogo revela quem está com o item, e
   esconder isso é mudar o layout — não é tarefa desta fatia.
6. **Limpeza sem CA:** trocar `useAuth((s) => s.usuario)!` por guarda explícita
   em `Catalogo.tsx`.

## Verificação (rules/checks.md)

- `cd frontend && npm run lint && npx tsc -b`
- `cd frontend && npm run build`
- `git status --short` — só os arquivos do escopo da tarefa.
