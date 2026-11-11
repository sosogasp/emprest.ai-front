# Revisão final — specs 004 e 005

Contexto: CA-01–CA-04 da 004 e CA-01–CA-05 da 005. Revisão independente em frontend 340955c / backend 1286eb9, somente leitura. Resultado: NÃO PRONTA. Tabela e motivos em ENTREGA.md.

## Onde parei
Fotos integradas no contrato REST e catálogo; limite permanece três; prazo calculado em 14 dias úteis. Últimos checks completos anteriores: backend “Tests: 34 passed, 34 total” (7 suítes), frontend “Tests 7 passed (7)” (3 arquivos); lint e typecheck sem erros, builds aprovados. Repetição atual do frontend aprovada: “Tests 7 passed (7)”, “built in 1.03s”; quatro avisos no cliente gerado e aviso de bundle. Repetição do backend aprovada: “Test Suites: 7 passed, 7 total”, “Tests: 34 passed, 34 total”; build sem erros.

O verificador aprovou 005 CA-02–CA-05 e 004 CA-02; os demais carecem de conferência do ambiente final. Os textos de Meus empréstimos, Equipamentos e layout foram alinhados para “dias úteis” após a rodada. O roteiro esclarece que full_name deve ser informado e o nome existente conferido manualmente, pois o script legado tem fallback de e-mail.

## Decisões não óbvias
A publicação foi pausada: scripts/deploy.cjs executa migrations, seed e vínculo de contas automaticamente. A regra da prática exige execução humana. Foi pedida aprovação para tornar o build exclusivamente geração de cliente e compilação; ainda não recebida. Não foi alterada configuração sem autorização.

## O que tentei e não funcionou
A instalação de dependências na pasta sincronizada apresentou falhas de leitura. A cópia local de testes usa o mesmo lockfile e fontes, sem credenciais de produção. A única diferença restante era uma asserção de tipo removida do teste de repositório; a cópia foi sincronizada e o teste correspondente passou novamente: “Tests: 4 passed, 4 total”.

## Próximo passo exato
Após a aprovação, retirar de backend/scripts/deploy.cjs as etapas de escrita, verificar o build, sincronizar a cópia local de testes e repetir a verificação independente com os hashes finais. Até lá não integrar nem publicar. Confirmar login docente/zero empréstimos, dupla carga e catálogo autenticado antes de marcar as specs prontas. O ZIP final deve excluir credenciais, caches, dependências e arquivos de build.

## Arquivos relevantes
- ENTREGA.md
- docs/specs/004-dados-iniciais/carga-equipamentos.md
- docs/specs/005-solicitar-emprestimo/spec.md
- docs/specs/005-solicitar-emprestimo/tasks.md
- ../backend/scripts/deploy.cjs
- src/pages/Catalogo.tsx
- src/pages/MeusEmprestimos.tsx
