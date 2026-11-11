# 2026-09-28 — Proposta do ADR-002 (biblioteca de teste de componente)

Fatia: `docs/specs/002-catalogo/`, Tarefa 9. **Tarefa sem `CA-xx`**: nenhum
critério de aceitação da 002 muda — o catálogo continua o de `4abc059` — e
nada foi instalado. O que esta tarefa entrega é a regra coerente e a decisão
que falta, pronta para ser tomada por quem decide.

Checks em `frontend/` depois das edições:

- `npm run lint` → sem saída, `LINT_EXIT=0`
- `npx tsc -b` → sem saída, `TSC_EXIT=0`
- `npm run build` → `✓ built in 1.41s`, `BUILD_EXIT=0`
- `git status --short` → `M rules/tests.md` e este handoff. Fora do escopo e
  já conhecidos de antes: `M src/pages/Login.tsx` (outra tarefa) e
  `docs/specs/` + handoffs antigos ainda untracked.

Commit: backend `<hash-backend>` (espelho de `rules/tests.md`), frontend
`<hash-frontend>` (`rules/tests.md` + este handoff).

## Onde parei

`rules/tests.md` (as duas cópias) não carrega mais o "Ponto não decidido"
dentro do passo 2: a regra agora diz o que é durável — biblioteca de teste
fora do ADR-001 não entra sem decisão do time registrada em ADR — e o fato de
a decisão faltar continua lá como procedimento, não como dúvida. O
`ADR-002` **não foi escrito** e nenhuma dependência foi instalada: os dois
dependem da decisão do time (`rules/restrictions.md`, "Autoridade"). A
Tarefa 9 da 002 segue `[ ]`.

## Decisões não óbvias

1. **Não escrevi o ADR.** Criar arquivo é ação livre no contrato de operação,
   mas escolher biblioteca fora do ADR-001 é proibido: `rules/restrictions.md`
   diz "Não escreva ADR. Se encontrar uma decisão que precisa de um, descreva
   a decisão e as alternativas, e PARE. Quem decide é o time." O texto pronto
   está na seção "Próximo passo exato" — a decisão é uma linha de resposta.
2. **Tirei o ponto em aberto de dentro da regra.** Um arquivo de `rules/` que
   admite não saber a resposta é dívida (é o mesmo passo 9 deste arquivo: regra
   desatualizada é dívida). O que a regra precisa carregar é a proibição de
   instalar sem decisão, e é isso que ficou.
3. **Fatos verificados hoje contra o registro npm** (`npm view`, 2026-09-28),
   porque RTL × React 19 é o ponto que queima escolha de biblioteca:
   - `@testing-library/react` **16.3.3** — peers `react`/`react-dom`
     `^18.0.0 || ^19.0.0` (o projeto tem React `19.3.0`) **e
     `@testing-library/dom ^10` como peer**: a base de consulta tem de ser
     instalada explicitamente, ela não vem junto.
   - `@testing-library/dom` **10.4.2** — encaixa no peer `^10`.
   - `@testing-library/jest-dom` **7.0.1** — peers `vitest >= 0.32` e
     `@testing-library/dom >=10 <11`, os dois satisfeitos; o pacote exporta
     `@testing-library/jest-dom/vitest` (confirmado no `exports` dele).
   - `vitest` **5.0.2** — peers `vite ^6.4.0 || ^7.0.0 || ^8.0.0` (o projeto
     tem `vite ^8.3.0`) e `jsdom` como peer **opcional**; engines
     `node ^22.12.0 || ^24.0.0 || >=26.0.0`.
   - `jsdom` **30.1.1** — engines `^22.22.2 || ^24.15.0 || >=26.0.0`, e esta
     máquina está em **Node v22.13.1**: fora da faixa. O maior `jsdom` que
     cobre o Node instalado é o **29.1.1** (`^20.19.0 || ^22.13.0 || >=24.0.0`);
     27 e 28 pedem `^22.12.0` e 24–26 pedem `>=18`, todos servem. `canvas` é
     peer opcional do `jsdom` e não se instala.
   - Consequência para a decisão: ou o ADR pinna `jsdom@^29`, ou a decisão
     inclui subir o Node para `>= 22.22.2`. `vitest` e `jsdom` são
     devDependencies: a faixa de engine morde a máquina e o CI, nunca o bundle
     que a Vercel publica.
4. **`@testing-library/user-event` fica de fora da primeira linha.** O
   `fireEvent` que vem com a RTL cobre clique e `change` dos CAs da 002 (chips,
   busca, confirmar do modal); `user-event` (14.6.7 hoje) entra por ADR novo se
   algum caso exigir teclado e foco reais.
5. **Import explícito de `describe`/`it`/`expect` do `vitest`**, sem
   `globals: true`: o `tsconfig.app.json` já inclui `src` inteiro e não precisa
   de `types`, e o `eslint.config.js` não precisa de globals de teste.

## O que tentei e não funcionou

- **Escrever o `ADR-002` nesta sessão:** barrado por `rules/restrictions.md`
  ("Autoridade"). Não insisti: é proibição, não conveniência — e "pode ir" não
  revoga o que está nesse arquivo.
- **Achar "quem renderiza o componente" já decidido em algum lugar:** não
  existe. O ADR-001 §8 (linhas 159–175) só tem runner, Testcontainers,
  supertest, Playwright, isolamento de tenant e a meta de cobertura; a 002
  citava `jsdom` sem biblioteca de render; `rules/qualidade-codigo.md` fala do
  Vitest como algo que ainda vai ser instalado.
- **Instalar sem decidir** (`npm i -D vitest jsdom …`): além de proibido antes
  da decisão, o `jsdom` mais recente (30.1.1) recusaria a faixa de engine desta
  máquina (Node 22.13.1). A proposta pinna `jsdom@^29` por isso.
- **Gravar a proposta em `docs/adr/` da cópia da raiz do workspace:** não, ali
  não é versionado (`rules/spec-flow.md`) — ADR só existe no `docs/` do front.
- Nota de ambiente: em uma das rodadas o `Set-Location` não persistiu dentro do
  mesmo comando do terminal e os caminhos relativos resolveram na raiz do
  workspace. Ao editar e conferir, use caminho absoluto.

## Próximo passo exato

Com a decisão do time em mãos (uma linha de resposta basta), fazer duas coisas
nesta ordem:

1. Criar `frontend/docs/adr/002-biblioteca-de-teste-de-componente.md` com o
   texto abaixo, trocando `AAAA-MM-DD` pela data da decisão. Quem decide é o
   time; o agente transcreve.
2. Executar a Tarefa 9 de `docs/specs/002-catalogo/tasks.md`:

```powershell
npm i -D vitest@^5 jsdom@^29 "@testing-library/react@^16" "@testing-library/dom@^10" "@testing-library/jest-dom@^7"
```

Depois disso: `vite.config.ts` com `test: { environment: 'jsdom', setupFiles:
['./src/test/setup.ts'] }` (importando `defineConfig` de `vitest/config`),
`src/test/setup.ts` com `import '@testing-library/jest-dom/vitest'`,
`src/pages/Catalogo.test.tsx` com um caso por `CA-xx` citado no nome do caso
(`rules/tests.md`, passo 5), e `package.json` com `"test": "vitest run"` — o
passo 1 do `rules/checks.md` e a Verificação do `rules/qualidade-codigo.md`
passam a incluir `npm run test`, dívida que já está anotada nos dois.

### Texto pronto do ADR-002

```markdown
# ADR-002: Biblioteca de teste de componente

## Status

Aceito em AAAA-MM-DD.

---

## Contexto

O ADR-001 §8 decidiu o runner do front (Vitest) e nada sobre quem renderiza o
componente em teste, nem sobre o ambiente de DOM. As regras proíbem o agente
de escolher biblioteca fora do ADR-001 (`rules/restrictions.md`), então a
decisão ficou parada — e a Tarefa 9 da 002 com ela.

Este ADR fecha só o que falta para o teste de componente: não mexe em nenhuma
linha do ADR-001 §8 (Jest no backend, Testcontainers, supertest, Playwright,
isolamento de tenant, cobertura sem percentual).

---

## 1. Decisão

| Item | Escolha |
|---|---|
| Runner | Vitest (ADR-001 §8) |
| Ambiente de DOM | `jsdom` |
| Render do React e consulta | `@testing-library/react` |
| Base de consulta | `@testing-library/dom` (peer; instalado explícito) |
| Matchers de DOM | `@testing-library/jest-dom`, via `@testing-library/jest-dom/vitest` |
| Interação | `fireEvent` do próprio RTL |
| Forma da consulta | papel e nome acessível (`getByRole`), não classe nem `querySelector` |
| Configuração | `vite.config.ts`: `environment: 'jsdom'` e `setupFiles` |

- **`@testing-library/react`** — é quem renderiza o React no DOM de teste e
  consulta o resultado pelo que o usuário vê; escrever isso à mão é recriar
  `render`, `act` e os seletores em cada arquivo de teste.
- **`@testing-library/dom` explícito** — é peer da RTL, não dependência dela:
  sem instalar, a RTL não sobe.
- **`jsdom`** — é o ambiente que o Vitest documenta para componente React e o
  que a Tarefa 9 da 002 já citava; `happy-dom` é mais rápido, mas implementa
  menos da API de DOM, e o teste aqui prova DOM (portal, classe da animação,
  foco).
- **`jsdom@^29`, não `^30`** — `jsdom` 30.1.1 exige Node
  `^22.22.2 || ^24.15.0 || >=26.0.0` e o ambiente tem Node 22.13.1; o 29.1.1
  exige `^22.13.0` e serve. Voltar ao 30 é subir o Node: decisão de ambiente,
  não de teste.
- **`jest-dom` pelo caminho `/vitest`** — é o que ensina o matcher ao `expect`
  do Vitest (`toBeInTheDocument`, `toHaveClass`), num `setupFiles` só.
- **`fireEvent`, não `user-event`** — clique e `change` dos CAs desta v1 o
  `fireEvent` cobre; `user-event` entraria por ADR novo, quando um caso exigir
  teclado e foco reais.
- **Import explícito de `describe`/`it`/`expect`** — `globals: true` obrigaria a
  mexer no `tsconfig.app.json` e nos globals do ESLint; importar é uma linha e
  não mexe na config de build do app.

---

## Alternativas descartadas

| Alternativa | Motivo de descarte |
|---|---|
| `@testing-library/user-event` no lugar do `fireEvent` | o que os CAs pedem o `fireEvent` cobre; seria mais uma dependência para manter sem caso que a exija |
| `happy-dom` no lugar do `jsdom` | implementa menos da API de DOM; trocar por velocidade é assunto de ADR novo |
| Playwright ou `@vitest/browser` para componente | é a camada mais cara do projeto (ADR-001 §8 põe Playwright no E2E) |
| `renderToStaticMarkup` + asserção no HTML | sem consulta por papel e nome acessível, o teste acopla ao markup e quebra a cada ajuste de classe |
| Cypress Component Testing | fora da matriz do ADR-001 §8 |
| `@vitest/coverage-v8` | a meta do ADR-001 §8 é sem percentual; relatório sem meta é número que ninguém lê |

---

## Consequências

### Fica mais fácil

- Provar o que o smoke não alcança: chips, busca, clique do modal, toast e
  animação (002, "Como sei que funcionou").
- A Tarefa 9 da 002 deixa de ser bloqueio de decisão e vira execução, com o
  mesmo setup servindo as fatias seguintes.
- Teste que consulta por papel empurra a tela para markup acessível.

### Fica mais difícil

- Cinco dependências de teste passam a ter atualização e auditoria — Vitest e
  `jsdom` já eram dívida do ADR-001 §8, não novidade deste ADR.
- A faixa de engine amarra o `jsdom` no 29 enquanto o Node não subir para
  `>= 22.22.2`, na máquina e no CI.
- Componente sem rótulo acessível vira teste impossível de escrever: o conserto
  é na tela, não no teste.

---

## O que este ADR NÃO decide

- Qualquer linha do ADR-001 §8 que não seja o teste de componente do front.
- Mock de rede, fixture e dublê de `supabase-js`.
- Como a animação e o CSS são provados além do que `rules/tests.md` já diz.
- Percentual, meta e relatório de cobertura.
- Quando o teste entra no GitHub Actions (ADR-001 §9).
```

## Arquivos relevantes

- `frontend/rules/tests.md` — passo 2 e primeiro item do "Não faça"
- `backend/rules/tests.md` — espelho byte-idêntico
- `frontend/rules/restrictions.md` — "Autoridade": o que barrou o ADR hoje
- `frontend/docs/adr/001-stack.md` §8 (linhas 159–175) — o que já está decidido
- `frontend/docs/specs/002-catalogo/tasks.md` — Tarefa 9, ainda `[ ]`
- `frontend/docs/specs/002-catalogo/spec.md` — "Dívida de processo" e CAs
- `frontend/package.json`, `vite.config.ts`, `tsconfig.app.json`, `eslint.config.js`
- `frontend/docs/handoffs/2026-09-28-contrato-de-operacao.md` — contrato vigente
