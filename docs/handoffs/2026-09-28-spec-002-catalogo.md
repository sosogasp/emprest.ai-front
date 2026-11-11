# Handoff — implementação de 2026-09-28

| campo | valor |
|---|---|
| fatia | `docs/specs/002-catalogo/` (spec, plano e tarefas escritos nesta sessão; o código do protótipo é de `4abc059`) |
| CA atendidos | CA-01…CA-15 documentados; CA-02 a CA-10 observados em smoke; CA-13 parcial; CA-11, CA-12 e CA-14 por leitura |
| commits | nenhum nesta sessão — `frontend` está em `adc37f1` e `docs/specs/002-catalogo/` ainda está untracked |
| checks | `npm run lint` → LINT=0 · `npx tsc -b` → TSC=0 · `npm run build` → `✓ built in 1.77s` (aviso de chunk > 500 kB, não é erro) · smoke de render do catálogo → `SMOKE OK`, 0 falhas |

## Onde parei

`docs/specs/002-catalogo/` existe com `spec.md` (15 regras, CA-01…CA-15 e 9
perguntas abertas), `plan.md` (7 etapas + 6 pendências) e `tasks.md` (tarefas 1–8
`[x]` desde `4abc059`; 9–15 `[ ]`). Nada em `src/` foi alterado nesta sessão: a
tela do catálogo já existia, e o que fiz foi conferir o comportamento dela contra
o layout (§5.2, §3, §7) e registrar a spec que faltava. O que ainda não existe:
teste versionado (Vitest não está instalado) e a ligação com a API — a tela
continua sobre os dados de exemplo do §9.

## Decisões não óbvias

- "Home" foi lido como o Catálogo do §5.2 (rota `/`): o layout não tem tela com
  esse nome e a aba do §6 se chama "Catálogo". Se o time quer outra tela, é a Q1
  da spec — registrada, não implementada.
- O recorte da fatia ficou **aberto** (Q2): o PRD item 3 (solicitar) entrou nesta
  spec porque o botão é do card (§7.1), mas quem decide se ele vira a 003 é o
  time — separar deixaria o catálogo com seis rótulos de botão sem nenhum
  funcionar.
- `HOJE_DEMO = 2026-08-31` (§9) é protótipo, não regra; `LIMITE_ITENS` e
  `PRAZO_PADRAO_DIAS` é que vêm do PRD. Ficou registrado para ninguém "consertar"
  a data sem decidir antes o que é "hoje" (Q4).
- O smoke de render precisou de shim local do `getInitialState` do zustand (ver
  abaixo). O app é SPA (ADR-001 §2), então o *server snapshot* do zustand não é
  problema de produção — é limite do smoke.

## O que tentei e não funcionou

- `vite build --ssr` do smoke direto: quebra em `emprestimosDe(usuario.id, …)` com
  `usuario: null`, porque no zustand v5 o `renderToString` usa `getInitialState`
  como server snapshot — `setState` antes do render não aparece no SSR. Só
  funcionou com um shim que devolve o estado atual nesse snapshot (shim apagado
  depois; o teste com jsdom não vai precisar dele).
- `npx esbuild` para montar o smoke: não existe em `node_modules/.bin` (é
  dependência transitiva). O caminho que funciona é `vite build --ssr` com um
  config temporário que faz o alias de `zustand`.
- Dev server não serve como evidência desta tela: `GET /` devolve o `index.html`
  da SPA para qualquer rota, então 200 não diz nada sobre o catálogo.
- Comando de shell com aspas aninhadas e `Substring` no console desta máquina
  deixa o pwsh em prompt de continuação e a execução pendura. Comando simples, em
  passos.

## Próximo passo exato

Aprovar a Tarefa 9 do `docs/specs/002-catalogo/tasks.md` — instalar `vitest` +
`jsdom` e escrever `frontend/src/pages/Catalogo.test.tsx` cobrindo CA-01…CA-14 —
porque dependência nova não entra sem o ok. Em paralelo, levar a Q2 da spec ao
time (o PRD item 3 fica na 002 ou vira a 003?), que é o que define o resto do
`tasks.md`.

## Arquivos relevantes

- frontend/docs/specs/002-catalogo/spec.md
- frontend/docs/specs/002-catalogo/plan.md
- frontend/docs/specs/002-catalogo/tasks.md
- frontend/src/pages/Catalogo.tsx
- frontend/src/data/demo.ts
- frontend/src/components/Nav.tsx
- frontend/src/components/Pill.tsx
- frontend/src/components/Modal.tsx
- frontend/docs/layout.md (§5.2, §3, §4, §6, §7, §8, §9, §10)
- frontend/docs/PRD.md
- frontend/docs/specs/001-login/spec.md (CA-06 e a dívida de processo)
- frontend/docs/handoffs/2026-09-28-regras-spec-flow-e-handoff.md
