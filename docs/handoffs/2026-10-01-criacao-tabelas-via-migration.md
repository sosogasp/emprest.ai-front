# Handoff — implementação de 2026-10-01 (criação das tabelas via migration)

| campo | valor |
|---|---|
| fatia | nenhuma — infraestrutura de banco (schema + migration). Sem `spec.md`/`CA-xx`: declarado conforme `rules/checks.md` passo 5 |
| CA atendidos | nenhum critério numerado. Vínculo com o `docs/PRD.md` (itens 1–5) e `docs/layout.md` §7/§9 pelas entidades; ADR-001 §5/§6/§7 pela forma |
| commits | **nenhum** — nada foi commitado ainda |
| checks | **NÃO rodados**: `npm run lint`, `npm run test`, `npm run build` e `npx prisma migrate reset` não executaram (ver "O que tentei e não funcionou"). O `prisma migrate deploy` contra o Supabase **não foi aplicado** |

## Onde parei

O backend saiu do zero e tem o **esqueleto NestJS + Prisma** completo, com o
`schema.prisma` dos cinco models (`Tenant`, `Usuario`, `Membro`, `Equipamento`,
`Emprestimo`) e a migration inicial escrita à mão em
`backend/prisma/migrations/20261001000000_init_esquema_emprestimo/migration.sql`,
com o DDL das tabelas/enums/FKs, o índice único parcial de empréstimo aberto e
todo o bloco de RLS (funções auxiliares + `ENABLE ROW LEVEL SECURITY` + policies).
O `prisma` 7.10.0 está instalado e o `node -e` do CLI respondeu, com os engines
presentes.
O que **não** existe: as tabelas ainda **não** foram criadas no banco. O
`prisma generate` e o `prisma migrate deploy` não chegaram a rodar — o terminal do
agente travou (ficou preso num `cmd.exe` aninhado disparado pelo `prisma.cmd`) e
não voltou a responder, então `lint`/`test`/`build` também não foram executados.

## Decisões não óbvias

- **Prisma fixado em 7.10.0** (não `latest`): a dist-tag `latest` do pacote `prisma`
  publica um **RC** (`8.0.0-rc.19`), enquanto `@prisma/client@latest` é `7.10.0`.
  Fixar em 7.10.0 nos dois evita CLI e client fora de sincronia.
- **RLS ancorado em `auth.uid()` + `membros`**, não em claim de JWT: o guard que
  resolveria `tenant_id` do claim ainda não existe, então as policies usam
  `auth.uid()` e funções `SECURITY DEFINER` (`auth_tem_tenant`, `auth_e_operacoes`,
  `auth_ve_usuario`) para ler `membros` sem recursão de RLS.
- **Devolução modelada como `status` + `devolvido_em`** na própria `emprestimos`,
  não como tabela separada — é a leitura direta de "empréstimos em aberto".
- **Um empréstimo aberto por equipamento** virou índice único parcial
  (`WHERE status = 'ABERTO'`), porque o Prisma não modela índice parcial.
- **Seed** (`prisma/seed.ts`) cria o tenant `suporte_ti` de forma idempotente
  (`upsert` por `slug`), conforme ADR-001 §5.

## O que tentei e não funcionou

- Subir Postgres local pelo Docker: o daemon estava parado no início; depois subiu
  (`29.3.0`), mas o rumo mudou para Supabase a seu pedido, então não foi usado.
- `prisma migrate dev`: exigiria *shadow database*, que o Supabase (Hobby) não
  fornece; por isso o caminho é `prisma migrate deploy` (não roda `migrate reset`).
- **Terminal travado**: depois de um `npm install` de 4 minutos, chamar
  `node_modules\.bin\prisma.cmd` (`.cmd` → `cmd.exe`) deixou o shell sem reportar
  conclusão. `prisma -v` funcionou uma vez; `prisma generate` (e tudo depois dele)
  não foi observado. `exit`, `taskkill`, `echo` e comandos via `node` **direto**
  não voltaram a executar. Sintoma: "Command completion could not be observed".
- Por causa disso, `_gen.txt` (saída do `generate`) nunca foi criado e não há como
  confirmar o resultado do `generate` — trate como **não executado**.

## Próximo passo exato

Rodar, de um terminal novo (não o do agente, que ficou preso), a partir de
`backend/`:

1. `npx prisma generate`
2. `npx prisma migrate deploy`  *(usa `DIRECT_DATABASE_URL` para aplicar no Supabase)*
3. `npx prisma migrate status`  *(confirma que não há migration pendente)*
4. `npm run lint` · `npm run test` · `npm run build`

Depois disso, o passo 2 do `rules/checks.md` (reset do zero) só é possível contra
um banco **local** — no Supabase nunca se roda `migrate reset`.

## Arquivos relevantes

- backend/package.json, backend/tsconfig.json, backend/tsconfig.build.json,
  backend/nest-cli.json, backend/eslint.config.mjs, backend/.prettierrc
- backend/prisma/schema.prisma
- backend/prisma/migrations/migration_lock.toml
- backend/prisma/migrations/20261001000000_init_esquema_emprestimo/migration.sql
- backend/prisma/seed.ts
- backend/src/main.ts, backend/src/app.module.ts,
  backend/src/prisma/prisma.module.ts, backend/src/prisma/prisma.service.ts
- backend/.env.example, backend/.gitignore
- backend/_npm_dev.txt, backend/_ver.txt, backend/_v2.txt (temporários; ignorados por `_*.txt`)
