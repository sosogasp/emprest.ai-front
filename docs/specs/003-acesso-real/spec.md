# Spec — Acesso real e persistência

Solicitado e plano aprovado pela usuária em 19/10/2026: corrigir o login e a
tela inicial, usar autenticação real e dados salvos e publicar na Vercel.
Deriva do PRD itens 1–5 e do ADR-001. Complementa as fatias 001 e 002.

- CA-01: restaurar a sessão após F5, aguardar a inicialização e sincronizar
  expiração e logout; entrar e sair pelo Supabase, sem atalhos de protótipo.
- CA-02: a API valida assinatura, emissor, audiência e expiração do JWT com
  JWKS; resolve o tenant do claim e confirma o vínculo na tabela de membros.
  Nome e papel vêm do perfil e vínculo no banco. Não aceitar papel do formulário.
- CA-03: `/v1/me` retorna id, nome, iniciais e papel do membro autenticado;
  falta de autenticação resulta em 401 e falta de vínculo em 403.
- CA-04: catálogo e empréstimos vêm da API com paginação por cursor, estados
  de carga/erro e atualização após mutação; nenhum dado de exemplo em produção.
- CA-05: empréstimo é persistido atomicamente: item disponível no mesmo tenant,
  máximo de três abertos, prazo de 14 dias e bloqueio por atraso; servidor usa
  a data corrente de São Paulo. Devolução preserva histórico e é idempotente.
- CA-06: colaborador acessa apenas seus empréstimos; Operações acessa o tenant
  e cadastra equipamentos. Guard e CASL centralizam as permissões.
- CA-07: erros seguem Problem Details; OpenAPI gerado dos DTOs Zod alimenta o
  cliente Orval, consumido com TanStack Query. Não há acesso direto ao banco no front.
- CA-08: rotas diretas e recarregamento funcionam na Vercel; build e verificações
  passam antes da publicação. Nenhum segredo de backend é incluído no frontend.
- CA-09 (pedido posterior da usuária): depois de confirmar o backend funcionando,
  remover o mínimo fixo de 820px do login. A tela acompanha a altura da janela,
  mantém o formulário acessível e se adapta a celular sem overflow horizontal.

Provisionamento continua fechado por administrador: o sistema não cria usuários,
tenants ou vínculos automaticamente. Ausência de provisionamento é bloqueio
operacional explícito, nunca entrada como usuário ou tenant de demonstração.
