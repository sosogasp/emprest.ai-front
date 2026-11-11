# Plano — Dados iniciais

1. Disponibilizar o verificador independente e a skill de imagens antes da carga. Registrar o teste com erro plantado e sua reversão. Conferir a documentação oficial do Pixabay, os créditos aplicáveis e as ferramentas autorizadas antes de definir a rotina em `imagens-equipamentos/`.
2. Preparar a lista e o manifesto de imagens. Verificar IDs de origem, duplicidade de arquivos, dimensões, créditos e aprovação visual antes de aceitar as fotos.
3. Em `backend/prisma/` e na rotina existente de provisionamento, preparar a persistência e a carga por tenant. Seguir ADR-001 para Prisma Migrate e login fechado. Ensaiar duas execuções locais e verificar que nenhuma cria ou remove empréstimos.
4. Entregar as instruções de execução e o handoff ao responsável humano. Conferir as URLs públicas e reunir evidências da carga e da conta para o verificador. Registrar as decisões e o resultado em `ENTREGA.md`.

## Conta docente — detalhamento da tarefa aprovada
Reutilizar scripts/vincular.cjs com nome explícito e modo que exige zero empréstimos. Preservar os chamados existentes de provisionar.cjs. A responsável cria ou localiza a conta no Auth pelo painel e executa o vínculo. Conferir paginação da busca, reexecução com mesmos IDs, papel OPERACOES com permissões de empréstimo e retomada após falha do claim. Testes usam identidades fictícias, Auth local simulado e PostgreSQL real por Testcontainers.
