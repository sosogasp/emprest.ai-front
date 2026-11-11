# Spec — Login e sessão

**Status:** implementada (código escrito antes desta spec — ver "Dívida de
processo")
**Fonte:** `docs/PRD.md` (item 1 de "O que precisa existir na primeira versão"
e seção "Quem usa") · `docs/layout.md` §5.1, §6, §7.11, §9, §10 ·
`docs/adr/001-stack.md` §2, §4, §7

## Objetivo

Uma pessoa entra com e-mail e senha corporativos e passa a ver as telas do seu
papel — Colaborador ou Operações — sem que ninguém precise anotar quem pegou
qual equipamento numa planilha.

## Vínculo

- **PRD:** item 1 ("Login. Cada pessoa vê os próprios empréstimos"); seção
  "Quem usa" (Colaborador, Operações).
- **ADRs que restringem:**
  - ADR-001 §2 — React + Vite, TypeScript `strict`, React Router (data APIs),
    Zustand para estado de cliente, React Hook Form + `zodResolver`.
  - ADR-001 §7 — provedor é Supabase Auth com e-mail e senha; cadastro fechado,
    só por convite; sessão no navegador gerenciada pelo `supabase-js`
    (token no header); autorização primária é do backend (guards + CASL), o
    front não é fonte da verdade.
  - ADR-001 §4 — API REST em `/v1`, erros em RFC 9457, cliente gerado por
    orval (nunca escrito à mão).
  - ADR-001 §5 e §6 — o tenant vem do claim do JWT, nunca do corpo do request.
  - ADR-001 §8 — teste unitário no frontend é Vitest; E2E é Playwright.
- **Layout:** §5.1 (a tela), §6 (entradas e destino de cada papel), §7.11
  (escopo por pessoa), §9 (dados de exemplo), §10 (controles de protótipo).

## Regras

1. Autenticação é por e-mail e senha no Supabase Auth, via `supabase-js`. Do
   Supabase o front usa **apenas a sessão** — nenhum dado de empréstimo é lido
   do banco pelo navegador.
2. Cadastro é fechado (ADR-001 §7). A tela de Login não oferece "criar conta",
   cadastro social nem qualquer caminho de autocadastro.
3. Dois papéis: Colaborador e Operações (layout §6). "Entrar" leva o
   Colaborador ao Catálogo (`/`); "Entrar como Operações →" leva a
   `/operacoes`.
4. A sessão é a única coisa que destrava rota interna: sem usuário na store,
   qualquer rota interna redireciona para `/login`; `/operacoes` e
   `/equipamentos` exigem papel Operações e caem no Catálogo para os demais
   (layout §6, §7.11).
5. A store de auth guarda exatamente `id`, `nome`, `iniciais` e `papel` — o
   suficiente para a barra de navegação (iniciais, etiqueta de papel, nome e
   "Sair" — layout §6).
6. Validação de formato roda no cliente antes de chamar o Supabase: e-mail e
   senha obrigatórios, e-mail no formato `algo@algo.algo` (ADR-001 §2:
   `zodResolver`).
7. Credencial inválida não cria sessão e não navega: o motivo aparece na
   própria tela.
8. Fidelidade visual do §5.1 é regra, não preferência. Grade `1.05fr 0.95fr`,
   altura mínima 820px. Coluna esquerda: `linear-gradient(160deg,#1b1f2e,
   #161826 60%)` + brilho radial de 520px em `rgba(47,184,172,0.16)`
   deslocado `left:-160px; top:120px`; marca no topo; título de 44px em duas
   linhas; lead de 16px em 60% de opacidade; faixa de três estatísticas
   (`3 itens por pessoa`, `14 dias de prazo`, `0 linhas para preencher`) acima
   de uma borda superior; rodapé "Operações · TI interno" em 12px/40%. Coluna
   direita: coluna de 340px centralizada verticalmente, H2 "Entrar", lead
   "Use o e-mail corporativo." (14px/55%), campo E-mail, campo Senha, botão
   primário `btn-block` (40px), botão ghost "Entrar como Operações →", nota
   "Cada pessoa vê apenas os próprios empréstimos".
9. Sem `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` o app não quebra: cai em
   demonstração. Esse caminho é controle de protótipo (§10) e por isso fica
   **fora** do bloco que reproduz o §5.1, separado por régua e rotulado
   "Protótipo".
10. O recorte de dados por pessoa continua valendo nas telas internas
    (§7.11). Esta spec garante apenas que nenhuma delas abre sem sessão e que
    as telas de balcão não abrem para Colaborador; o recorte em si é das specs
    002–005.

## Critérios de aceitação

- CA-01 · e-mail e senha válidos criam sessão e levam o Colaborador ao
  Catálogo (`/`)
- CA-02 · "Entrar como Operações →" entra com papel Operações e leva a
  `/operacoes`
- CA-03 · credencial recusada pelo Supabase: nenhuma sessão criada, nenhuma
  navegação, motivo visível na tela
- CA-04 · e-mail vazio, sem "@" ou sem ponto depois do "@": envio bloqueado,
  mensagem junto ao campo E-mail, nenhuma chamada ao Supabase
- CA-05 · senha vazia: envio bloqueado, mensagem junto ao campo Senha
- CA-06 · sem sessão, `/`, `/meus`, `/operacoes` e `/equipamentos`
  redirecionam para `/login`; com sessão, `/` mostra o Catálogo
- CA-07 · Colaborador em `/operacoes` ou `/equipamentos` cai no Catálogo e
  nunca vê a tabela de balcão
- CA-08 · a barra de navegação mostra iniciais, nome e etiqueta de papel
  vindos da store; "Sair" volta para `/login`
- CA-09 · a tela reproduz o §5.1 medido: grade `1.05fr 0.95fr`,
  `min-height: 820px`, brilho de 520px em `left:-160px; top:120px`, coluna
  direita de 340px, título em duas linhas, lead de 16px a 60%, três
  estatísticas e rodapé em 12px/40%
- CA-10 · sem as variáveis do Supabase, a entrada de demonstração funciona
  (Ana Ribeiro · Colaborador, dados do §9) e a tela avisa que o Supabase não
  está configurado
- CA-11 · nenhuma chave secreta no navegador: o client é criado só com a
  `anon key` pública e nenhum dado de empréstimo vem do Supabase
- CA-12 · `npm run lint` e `npx tsc -b` passam no frontend (`rules/checks.md`)

## Fora de escopo / não decidido

Perguntas que o PRD e o layout **não** respondem — registradas e aguardando o
time; nenhuma delas foi implementada por suposição:

- **Q1.** De onde vêm `nome`, `iniciais` e `papel` depois do login?
  (memberships + API `/v1`? claim do JWT? `user_metadata` do Supabase?) Hoje o
  nome é derivado do e-mail e o papel entra fixo como Colaborador.
- **Q2.** A sessão deve sobreviver a um F5, e `/login` deve pular quem já tem
  sessão? (`supabase-js` persiste o token; quem reidrata a store é decisão não
  tomada — hoje a store vive só em memória.)
- **Q3.** Texto exato das mensagens de erro (credencial e campo).
- **Q4.** "Esqueci a senha" e troca de senha: não estão no §5.1 e o cadastro é
  fechado — quem opera o reset?
- **Q5.** Limite de tentativas / bloqueio por excesso de erros.
- **Q6.** Sessão em múltiplas abas e expiração silenciosa.
- **Q7.** O modo demonstração (`entrarDemo`) sobrevive à chegada da API, ou sai
  junto com o protótipo (§10)?
- **Q8.** "Sair" deve revogar sessão no Supabase (`signOut`) ou basta limpar a
  store? Hoje só limpa a store.

Fora da v1 (do PRD): reserva com data futura, notificação por e-mail,
importação da planilha.

Fora **desta** spec: as telas Catálogo, Meus empréstimos, Operações e
Equipamentos (specs 002–005) e o provisionamento de usuário/convite, que o
ADR-001 §7 deixa explicitamente para outra decisão.

## Contrato afetado

- **Rotas do front:** `/login` (pública) e `/`, `/meus`, `/operacoes`,
  `/equipamentos` (protegidas) — layout §6. Não muda sem nova spec: o destino
  pós-login de cada papel.
- **Variáveis de ambiente do front:** `VITE_SUPABASE_URL`,
  `VITE_SUPABASE_ANON_KEY` (`.env.example`). `VITE_API_URL` está no exemplo mas
  ainda não é usada por esta tela.
- **Store de cliente:** `useAuth` com `usuario | entrar | entrarDemo | sair` e
  `Usuario = { id, nome, iniciais, papel }`.
- **O que NÃO pode mudar:** o front não manda `tenant_id` em corpo nem query
  (ADR-001 §6) e não escreve cliente HTTP à mão para o backend (ADR-001 §4);
  quando a API existir, o token segue no header `Authorization` validado por
  JWKS (§7).

## Dívida de processo

Esta tela foi codada antes de a spec existir: a cadeia
**spec → plan → tasks → commit** foi invertida nesta primeira entrega. O
diretório `docs/specs/` não existia no repositório e `rules/restrictions.md`
ainda dizia que a spec era `docs/PRD.md`/`docs/layout.md`. Fica registrado, e
da spec 002 em diante a ordem volta ao procedimento.

## Como sei que funcionou

CA-01 a CA-10 foram observados em smoke test de render (SSR) e no dev server
(`GET /login → 200`); CA-12 nos checks do `rules/checks.md`. O teste versionado
no repositório ainda não existe — Vitest está decidido no ADR-001 §8 e a
instalação é tarefa pendente em `tasks.md`. CA-11 é verificado por leitura de
`src/lib/supabase.ts` (client só com a anon key, nenhum dado do Supabase).
