# Carga dos equipamentos — spec 004

## O que será carregado
Os 12 registros de prisma/dados/equipamentos.json no backend, com nome, categoria, patrimônio, manutenção e URL pública de imagem. TI-0004 e TI-0007 ficam em manutenção. TI-0010 fica disponível quando não há empréstimo aberto.
O script exige o slug do tenant existente. O seed anterior cria suporte_ti, usado pelo provisionamento existente. Confirme qual tenant atende a empresa antes de executar.
A carga faz upsert por tenant e patrimônio em uma transação. Reexecuções preservam os IDs e os empréstimos. Equipamentos antigos recebem os dados acordados e a imagem. Outras linhas do tenant permanecem no banco, portanto um inventário anterior pode ter mais de 12 itens no total.

## Migration
20261111001912_equipamento_imagem adiciona imagem_url TEXT opcional à tabela equipamentos. Os registros anteriores recebem NULL até serem atualizados pela carga. As políticas RLS existentes da tabela também abrangem essa coluna.
Aplique a migration antes de integrar a branch na main para publicar o backend em produção. Previews ligados ao mesmo banco também dependem dessa migration.

## Execução humana em produção
A prática determina que a responsável execute as escritas no Supabase. Os comandos seguintes são para o terminal da responsável, dentro de backend, com a branch da spec e as credenciais já configuradas em .env.

1. Aplicar as migrations pelo procedimento existente:
   node scripts/migrar.cjs
2. Gerar o cliente do Prisma:
   npm run prisma:generate
3. Carregar o tenant confirmado, substituindo SLUG_DO_TENANT pelo valor real:
   npm run seed:equipamentos -- SLUG_DO_TENANT
4. Conferir os patrimônios TI-0001 até TI-0012 no tenant, as duas manutenções e as URLs de imagem.
5. Repetir o comando da carga e conferir que os mesmos 12 patrimônios mantêm os IDs e que o histórico de empréstimos foi preservado.

Não inclua a senha do professor nesses arquivos. A carga dos equipamentos é independente do provisionamento da conta.

## Verificação local
Os testes em prisma/carregar-equipamentos.spec.ts usam Testcontainers com postgres:15 e restauram o banco descartável pelas migrations. A função auth.uid de teste existe somente na infraestrutura local que permite aplicar as políticas do Supabase.
npm run test -- --runInBand

Os casos cobrem dados e imagens, reexecução com empréstimo preexistente, isolamento de tenant, concorrência, tenant ausente e registro antigo sem imagem.