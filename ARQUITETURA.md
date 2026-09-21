# Arquitetura do Projeto

## Estrutura de Pastas

```
lån/
├── backend/       # API (NestJS)
├── frontend/      # SPA (React + Vite)
├── docs/          # Documentação
└── .gitignore
```

## Backend (`/backend`)

- **Framework:** NestJS (Node.js LTS)
- **ORM:** Prisma (PostgreSQL)
- **Auth:** Supabase Auth (JWT)
- **Arquivo de ambiente:** `.env`
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY` _(secreto)_
  - `DATABASE_URL` _(pooler)_
  - `DIRECT_DATABASE_URL` _(migrations)_

## Frontend (`/frontend`)

- **Framework:** React + Vite (TypeScript strict)
- **UI:** Tailwind CSS + shadcn/ui
- **Auth:** supabase-js (client-side session)
- **Client API:** Gerado via Orval (OpenAPI)
- **Arquivo de ambiente:** `.env`
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY` _(público)_
  - `VITE_API_URL`

## Fluxo de Autenticação

1. Frontend usa `anon_key` via `supabase-js`
2. Usuário autentica → recebe JWT
3. Frontend envia JWT no header `Authorization`
4. Backend valida JWT via JWKS do Supabase