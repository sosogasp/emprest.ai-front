# Tarefas — 002 Catálogo (a tela inicial)

Uma tarefa por vez, cada uma citando o CA que atende e cabendo num commit.
`[x]` feito · `[ ]` pendente.

As tarefas 1 a 8 descrevem o que já está em pé desde o scaffold `4abc059` — elas
foram escritas depois do código (ver "Dívida de processo" na spec) e a evidência
está na seção "Como sei que funcionou".

## Tarefa 1 — Dados de exemplo e derivações (CA-02, CA-05)

- [x] `frontend/src/data/demo.ts` com `useDemo`, `PESSOAS`, `LIMITE_ITENS = 3`,
      `PRAZO_PADRAO_DIAS = 14`, `HOJE_DEMO` e as derivações
      `situacaoDoEquipamento`, `emprestimoDoItem`, `emprestimosDe`, `temAtraso`.
- Commit: `4abc059`

## Tarefa 2 — Rota e barra (CA-01)

- [x] `frontend/src/App.tsx`: `/` como index da rota protegida, com `Nav` e
      `Outlet`; `frontend/src/components/Nav.tsx` com as abas de §6.
- Commit: `4abc059`

## Tarefa 3 — Cabeçalho, grade e card (CA-02, CA-03, CA-04)

- [x] `frontend/src/pages/Catalogo.tsx`: H1, lead "X de Y", busca de 260px,
      grade `repeat(auto-fill, minmax(292px, 1fr))` com `gap: 16px`, conteúdo em
      `max-width: 1240px` e padding `36px 40px 64px`; card com kicker, nome,
      patrimônio, pill, linha de detalhe e botão `btn-block`.
- Commit: `4abc059`

## Tarefa 4 — Situação no botão e na linha de detalhe (CA-05 a CA-08)

- [x] `estadoDoBotao` com a precedência manutenção → emprestado → comigo →
      atraso → limite → solicitar, e `linhaDetalhe` com as quatro frases.
- Commit: `4abc059`

## Tarefa 5 — Chips de filtro e busca (CA-11, CA-12)

- [x] Quatro chips exclusivos com o ativo em `rgba(47,184,172,0.10)`; busca por
      nome + patrimônio, case-insensitive, com estado vazio próprio.
- Commit: `4abc059`

## Tarefa 6 — Banner de atraso (CA-10)

- [x] Banner no topo do catálogo com atalho para os próprios empréstimos,
      condicionado a `temAtraso(usuario.id, emprestimos)`.
- Commit: `4abc059`

## Tarefa 7 — Modal de solicitar (CA-13)

- [x] `Modal` de 420px com o equipamento e "Devolver até = hoje + 14 dias";
      confirmar chama `solicitar` e mostra o toast; fechar não muda o estado.
- Commit: `4abc059`

## Tarefa 8 — Animação dos cards (CA-14)

- [x] `fadeUp .25s ease both` em `.card-item`, sem animação em número, tabela ou
      navegação (§8).
- Commit: `4abc059`

---

## Pendentes — dependem de resposta do time ou de aprovação

- [ ] **Tarefa 9 — Teste de tela com Vitest + jsdom (CA-01 a CA-15).** Cobre o
      que o smoke não alcança: chips, busca, clique do modal, toast e animação.
      Vitest é decisão do ADR-001 §8, mas não está no `package.json`: instalar
      dependência nova exige mostrar antes e esperar. Mesma pendência da 001.
      Commit previsto: `test: cobre o catálogo (CA-01..CA-15)`
- [x] **Tarefa 10 — Q2 da spec: decidida em 2026-09-28.** O PRD item 3
      (solicitar empréstimo) fica nesta fatia, com o modal do §7.1 — é o que
      sustenta o CA-13. Sem commit: é decisão, registrada na spec (regra 16).
- [ ] **Tarefa 11 — Q3 da spec:** decidir o recurso e o formato do dado
      (`/v1/equipamentos` + empréstimos, ou situação resolvida no payload) e
      trocar `useDemo` pelo cliente gerado via TanStack Query.
- [ ] **Tarefa 12 — Q4 da spec:** substituir `HOJE_DEMO` pela fonte de "hoje"
      decidida pelo time (afeta CA-05, CA-09, CA-10 e CA-13).
- [ ] **Tarefa 13 — Q5 e Q6 da spec:** definir o que a contagem conta e o que a
      tela faz quando a lista vier paginada por cursor.
- [ ] **Tarefa 14 — Q7 e Q8 da spec:** fechar os textos de estado vazio e toast
      e os estados de carga/erro da tela.
- [ ] **Tarefa 15 — Limpeza, sem CA:** trocar `useAuth((s) => s.usuario)!` por
      guarda explícita em `Catalogo.tsx`.
