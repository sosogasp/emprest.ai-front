# Entrega da prática — emprest.ai

Estado: revisão final registrada; conferência visual autenticada do catálogo após publicação permanece pendente. Este relatório distingue implementação, testes locais e comprovação em produção.

## Links
- Frontend: https://github.com/sosogasp/emprest.ai-front
- Backend: https://github.com/sosogasp/emprest.ai-back
- Aplicação: https://emprest-ai-front.vercel.app
- Evidências das fotos: frontend/docs/specs/004-dados-iniciais/verificacao-publica.json

## 1. Conflitos: o que foi pedido contra o que já existia

| Pedido | Contrariava o quê | Decisão e motivo | Registro e evidência |
|---|---|---|---|
| Usar Pexels | Orientação posterior do professor, relatada pela responsável | Usar exclusivamente Pixabay, seguindo a orientação atualizada | Spec 004, manifesto de imagens e skill imagens-equipamentos |
| TI-0010 em manutenção na lista da skill | Briefing de dados iniciais define somente TI-0004 e TI-0007 em manutenção | Seguir o briefing de dados iniciais, como decidiu a responsável | backend/prisma/dados/equipamentos.json; eb16a2a e 5b389f9 |
| Cinco empréstimos simultâneos | PRD original e código com limite de três | A responsável inicialmente aprovou cinco, mas a mudança não chegou ao código. Ao constatar isso, decidiu seguir o PRD original e manter três. O quarto pedido é recusado | PRD, spec 005 CA-03, backend/src/modules/catalogo/catalogo.service.ts e frontend/src/data/emprestimos.ts; e3b7e4c |
| Prazo de 14 dias úteis | PRD original e implementação anterior em dias corridos | A responsável aprovou o prazo do briefing com exclusão de sábados e domingos. Calendário de feriados foi adiado por decisão explícita | PRD, spec 005 CA-02 e testes calendario.spec.ts / format.test.ts |
| Instalar sharp | Regra exige aprovação para dependências | Usar Pillow já instalado, com autorização explícita, para a preparação local | Skill e spec 004 |
| Senha escrita no seed | Regras de segredos | A responsável informa a senha no painel Auth. O código de vínculo usa a conta existente | backend/scripts/vincular.cjs e roteiro de provisionamento |
| Catálogo sem crédito | Contrato das fotos e atribuição da origem | Mostrar Fotos: Pixabay com link no catálogo | frontend/src/pages/Catalogo.tsx |
| Verificador corrigir testes | Independência exigida do verificador | Somente o agente principal corrige. O verificador devolve evidências por CA | agents/verificador-spec.md, configuração do harness e rules/spec-flow.md |

## 1b. Lacunas: o que foi pedido de forma incompleta

| Spec | Lacuna e alternativas | Decisão | Motivo e evidência |
|---|---|---|---|
| 004 | Nome inferido do e-mail ou fornecido explicitamente | Nome informado pela responsável no provisionamento | Evitar repetir a dedução de nome já questionada no projeto |
| 004 | Papel do professor: colaborador ou operações | OPERACOES, pois a responsável pediu ambos os acessos | A matriz existente concede empréstimos e gestão a Operações; backend/src/modules/acesso/permissoes.ts |
| 004 | Texto em teclados e rótulos técnicos | Permitidos pela responsável; permanecem as restrições a pessoas, marcas legíveis, texto promocional e conteúdo em telas | Spec 004 e referências da skill |
| 005 | Feriados e data-base do prazo | Somente fins de semana excluídos; contagem começa no dia seguinte; data-base de São Paulo já existente no sistema | Spec 005 e funções de calendário |
| 004 | Reexecução com dados e empréstimos existentes | Upsert por tenant/patrimônio, preservando IDs e histórico, sem apagar equipamentos adicionais | Transação e testes reais em PostgreSQL |

## 2. Onde o agente tentou decidir por você

O agente sugeriu manter TI-0010 em manutenção. A responsável escolheu a regra do briefing de dados iniciais, deixando esse patrimônio disponível.

Ao preparar a conta docente, o agente ampliou o trabalho para mudanças e testes que a responsável considerou excessivos. Essas alterações extras foram removidas. O papel Operações já atende ao acesso combinado solicitado.

O recorte de TI-0007 foi escolhido pelo agente para excluir a faixa com logotipo. As coordenadas e a revisão visual da saída estão registradas no manifesto, permitindo conferir essa escolha.

## 3. Uma decisão que merece (ou não) um ADR

A autorização de Testcontainers executa a estratégia de testes já prevista no ADR-001, portanto não altera a matriz de ferramentas. A versão 11.14.0 foi fixada para o Node 22.13.1 instalado. A versão mais recente consultada exigia um Node mais novo.

A interpretação dos feriados e o limite de itens são decisões de produto registradas no PRD e na spec. O agente não escreveu um ADR em nome da responsável.

## 4. A skill imagens-equipamentos

SKILL.md contém o fluxo e as restrições. references/ registra operação, seleções e exemplos de rejeições. Os scripts buscam pela API, mantêm cache de 24 horas, baixam fotos selecionadas, normalizam PNG e validam o lote.

Código verifica 12 patrimônios, IDs e hashes distintos, dimensões 800×600, decodificação, créditos, revisão registrada e reprodução dos recortes a partir dos originais. Pessoas, marcas e conteúdo visual foram inspecionados nas imagens. Onze rejeições verificadas estão registradas em references/revisao.json, sem alegar contagem de todos os resultados encontrados.

Os scripts da skill preparam arquivos locais. A responsável executou o upload. As 12 URLs públicas responderam HTTP 200 e corresponderam byte a byte ao manifesto, registrado em bb86c24.

## 5. O subagente verificador

O perfil Codex usa sandbox somente leitura e contexto novo. Recebe spec, revisões dos dois repositórios e evidências sanitizadas. Lê os arquivos relevantes em vez de herdar as conclusões do implementador.

rules/spec-flow.md torna sua rodada obrigatória antes de encerrar uma spec ou integrar a branch. O perfil proíbe credenciais, conectores, scripts de projeto, rede e escritas em produção. A responsável executa as operações de banco e Storage.

A análise conjunta de frontend e backend identifica o contrato REST, o cliente gerado e a interface. O resultado é uma tabela por CA com revisão identificada.

## 6. O verificador em ação

- Erro plantado: d6565fc repete o ID Pixabay 123 em dois patrimônios.
- Reversão: 1ae9472 remove a fixture.
- O perfil registrado reprovou CA-02 e confirmou a ausência da fixture após a reversão.
- A primeira tentativa recebeu um caminho incompleto e retornou ausência de evidência; a repetição com o caminho completo identificou a duplicidade.
- A revisão das imagens encontrou melhorias em staging, transformação, data e nota visual. O principal corrigiu em 4c1b43a; a segunda rodada confirmou as correções.
- A revisão da carga local não encontrou defeito de correção. A responsável posteriormente informou que a carga em produção funcionou.

### Última tabela registrada da spec 004
| CA | Resultado na rodada | Evidência |
|---|---|---|
| CA-01 | SEM EVIDÊNCIA de produção na rodada | Carga local verificada; depois a responsável relatou execução bem-sucedida |
| CA-02 | APROVADO | 12 imagens públicas, manifesto e hashes |
| CA-03 | SEM EVIDÊNCIA completa do ambiente final | Testes de reexecução, empréstimos, isolamento e concorrência passaram localmente |
| CA-04 | Confirmação final pendente | Login docente e zero empréstimos dependem de conferência pela responsável |

Os relatos humanos não são apresentados como leitura independente do banco pelo agente.

### Revisão independente de 11/11/2026
Revisões: frontend 340955c e backend 1286eb9. Rodada somente leitura: testes foram relatados pelo implementador, não executados pelo revisor.

| Spec / CA | Resultado | Evidência e pendência |
|---|---|---|
| 005 CA-01 | SEM EVIDÊNCIA final | Fotos/crédito e indisponibilidade cobertos pelo código e testes; falta conferir catálogo autenticado no ambiente final |
| 005 CA-02 | APROVADO | Calendário, empréstimo transacional e disponibilidade cobertos |
| 005 CA-03 | APROVADO | Limite três, atraso e concorrência cobertos |
| 005 CA-04 | APROVADO | Solicitações simultâneas do mesmo item produzem exatamente um empréstimo |
| 005 CA-05 | APROVADO | Consulta própria e isolamento por tenant cobertos |
| 004 CA-01 | SEM EVIDÊNCIA final | Relato de carga bem-sucedida; conferência completa do tenant pendente |
| 004 CA-02 | APROVADO | Manifesto e verificação pública das fotos |
| 004 CA-03 | SEM EVIDÊNCIA final | Reexecução local coberta; repetição no ambiente final pendente |
| 004 CA-04 | SEM EVIDÊNCIA final | Login docente e zero empréstimos pendentes |

Resultado: NÃO PRONTA. O revisor encontrou o build de deploy executando migrations, seed e vínculo de contas automaticamente. A publicação foi pausada, pois isso contraria a execução humana exigida pela prática; a correção da configuração depende de aprovação. Também apontou rótulos sem “úteis” (corrigidos depois da revisão) e a necessidade de documentar o nome explícito no provisionamento. Alterações posteriores exigem nova rodada antes de integrar.

Verificações locais: backend com 34 testes em 7 suítes; frontend com 7 testes em 3 arquivos; lint, typecheck e build sem erros. Os quatro avisos de lint do cliente gerado e o aviso de bundle permanecem registrados.

## 7. Uma regra sua que esta prática pôs à prova

A exigência de aprovação para dependências impediu instalar sharp automaticamente e exigiu autorização para Testcontainers. A independência do verificador também impediu aplicar o atalho de deixar o revisor corrigir o que ele mesmo avaliava.

As rules ainda afirmavam que nenhum runner estava instalado, embora o projeto já usasse Jest e Vitest. A revisão atualizou essa informação e incluiu o teste do frontend nos checks obrigatórios, preservando a matriz do ADR-001.

A nova dependência de testes apresentou limitações de versão do Node e leitura de arquivos no OneDrive. Os testes foram executados numa cópia com os mesmos arquivos e lockfile fora da pasta sincronizada, sem configuração de produção. A auditoria registrou 49 avisos de dependências versus 43 na base anterior, incluindo avisos moderados na pilha de testes. A remediação geral desses avisos ficou fora desta prática.

## 8. O que ficou de fora e o que faria diferente

- A responsável confirmou em 11/11/2026 o login docente, zero empréstimos e a carga repetida com os mesmos 12 registros. São relatos humanos, sem leitura independente de produção pelo agente.
- As operações manuais de produção são de responsabilidade da responsável. A revisão descobriu que o build existente também realizava escritas automaticamente; a publicação está pausada até resolver essa divergência, sem alegar conformidade histórica do pipeline.
- Feriados estaduais e municipais ficam para uma etapa posterior.
- A criação de equipamentos pela interface não inclui seleção e preparação de novas fotos nesta entrega.
- Há quatro avisos de lint no cliente gerado e um aviso de tamanho do bundle.
- Alguns documentos antigos já estavam fora do controle de versão quando esta continuação começou. Foram importados como referências existentes para o pacote e o repositório; isso não comprova que foram escritos antes do código antigo.
- ADR-003 já existia como proposta e continua pendente de aceite formal. A interface segue o layout vigente, sem tratar essa proposta como uma decisão aprovada.
- As pendências serão mantidas visíveis no pacote final. A spec só será marcada pronta quando todos os CAs tiverem evidência.

## Atualização final — 11/11/2026
A responsável confirmou os dois checks solicitados: login docente com zero empréstimos e duas cargas mantendo os mesmos 12 registros. Isso atende à evidência humana solicitada para 004 CA-01, CA-03 e CA-04; as linhas anteriores preservam o resultado histórico da rodada. A responsável aprovou explicitamente remover migrations, seed e vínculo do build. `backend/scripts/deploy.cjs` agora executa somente Prisma generate e Nest build; os comandos manuais permanecem disponíveis. Não houve execução de escrita remota pelo agente para essa correção.
A confirmação do catálogo autenticado com as 12 fotos após publicação (005 CA-01) ainda deve ser feita. A entrega inclui essa pendência, sem declarar a spec 005 pronta. Os checks locais passaram (34 testes backend e 7 frontend), e a alteração do build foi validada sem credenciais de produção.
