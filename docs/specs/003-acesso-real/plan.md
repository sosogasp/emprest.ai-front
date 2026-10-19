# Plano — Acesso real

Plano autorizado pela usuária em 19/10/2026, com prioridade de publicação às 9h BRT.

1. Corrigir sessão, identidade, logout, erros de login e remover entradas falsas.
2. Corrigir incompatibilidades de build mantendo as bibliotecas do ADR-001.
3. Implementar JWT/JWKS, contexto por request, perfil, catálogo e operações
   persistentes em Controller → Service → Repository; nenhuma migration destrutiva.
4. Exportar OpenAPI, gerar Orval e conectar as telas com TanStack Query.
5. Verificar isolamento, regras críticas, lint, tipos e build; registrar resultados.
6. Conferir acesso e configuração dos dois projetos Vercel, publicar e verificar
   as URLs. Se um serviço externo impedir, registrar o bloqueio sem alegar deploy.

Responsabilidades: store/auth mantém sessão; lib/sessao sincroniza Supabase;
DTOs definem contrato; guard autentica e fixa contexto; ability define permissões;
repository acessa Prisma; service aplica regras; hooks conectam dados às telas.
