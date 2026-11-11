# Handoff — implementação de 2026-10-01 (ADR-003 de design system)

| campo | valor |
|---|---|
| fatia | nenhuma — `docs/layout.md` convertido em ADR, sem `CA-xx` |
| CA atendidos | nenhum; tarefa sem critério numerado, declarado conforme `rules/checks.md` passo 5 |
| commits | nenhum ainda — `frontend/docs/adr/003-design-system.md` untracked; a cópia na raiz `docs/adr/` não é versionada |
| checks | `npm run lint` → `LINT_EXIT=0` · `npx tsc -b` → `TSC_EXIT=0` · `npm run build` → `✓ built in 1.50s`, `BUILD_EXIT=0` |

## Onde parei

`docs/layout.md` virou `frontend/docs/adr/003-design-system.md` (espelhado na cópia de
`docs/` da raiz, byte a byte igual — SHA-256 conferido), no formato do ADR-001:
Status, Contexto, decisões 1–12, "Alternativas descartadas", "Consequências" e
"O que este ADR NÃO decide". Nenhum arquivo de código mudou, e `docs/layout.md`
continua no lugar (é fonte da spec, `rules/spec-flow.md`). O ADR nasce
**Proposto** — o aceite é do time.

## Decisões não óbvias

- **Número 003, não 002.** O 002 está reservado para a biblioteca de teste de
  componente (handoff `2026-09-28-proposta-adr-002-biblioteca-de-teste.md`).
  Decisão do dono nesta sessão, depois de o agente apontar
  `rules/restrictions.md` ("Autoridade": não escrever ADR).
- **Reconciliação com o ADR-001 §2.** O `layout.md` nasceu como protótipo com
  `styles.css` do Nocturne + estilos inline; o ADR-003 declara os dois como
  **referência de desenho**, e o alvo como Tailwind CSS + shadcn/ui (ADR-001 §2).
  Sem isso, o ADR brigaria com a stack já decidida.
- **§7 do layout virou "como aparece na tela".** As 11 regras são de produto
  (PRD); no ADR ficou só o efeito visual (rótulo, cor, habilitação do controle).
  A fonte do comportamento continua sendo o `docs/PRD.md`.
- **§9 (dados de exemplo) e §10 (notas de protótipo) entraram marcados como
  não-decisão** — são apoio de desenho e podem mudar sem rever o ADR (também
  listados no "O que este ADR NÃO decide").

## O que tentei e não funcionou

- Escrever o ADR direto foi barrado de propósito: `rules/restrictions.md`
  ("Autoridade") proíbe o agente de escrever ADR e manda parar. O arquivo só foi
  criado depois da decisão do dono (número 003).

## Próximo passo exato

Revisar e aceitar `frontend/docs/adr/003-design-system.md` (trocar Status "Proposto" →
"Aceito") e commitar `git add docs` no `frontend/`. Opcional: citar o novo ADR
na lista de "Documentação" do `AGENTS.md` e no desenho de pastas do
`ARQUITETURA.md`, hoje só com o 001.

## Arquivos relevantes

- frontend/docs/adr/003-design-system.md (novo)
- docs/adr/003-design-system.md (cópia não versionada)
- frontend/docs/adr/001-stack.md (§2 — a stack de UI)
- frontend/docs/layout.md (fonte)
- frontend/docs/handoffs/2026-09-28-proposta-adr-002-biblioteca-de-teste.md (o nº 002 reservado)
- frontend/rules/restrictions.md ("Autoridade")
