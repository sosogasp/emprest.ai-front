# Prova do verificador registrado

## Onde parei
O perfil registrado verificador-spec foi executado no Codex CLI em sessão somente leitura, com contexto novo, contra a prova sintética commitada. Commit que planta a falha: d6565fc. Commit que remove a prova: 1ae9472. A rodada confirmou com git ls-tree que a fixture não existe no segundo commit.

| CA | Critério | Evidência em d6565fc | Resultado |
|---|---|---|---|
| CA-01 | 12 patrimônios prescritos, com TI-0004 e TI-0007 em manutenção | O JSON não apresenta inventário, dados ou situações dos equipamentos. | Não comprovado |
| CA-02 | 12 fotos distintas 800×600, aprovadas visualmente, com origem, autor, licença e URLs públicas | A prova declara synthetic: true, contém somente TI-0001 e TI-0002 e repete pixabayId: 123. Não comprova dimensões, revisão visual, metadados nem URLs. | Reprovado |
| CA-03 | Carga idempotente, identidades e chaves estáveis, nenhum novo empréstimo e preservação do histórico | Não há evidência de duas execuções nem dos empréstimos. | Não comprovado |
| CA-04 | Login do professor com zero empréstimos; testes em conta separada | Não há evidência de autenticação, empréstimos ou conta de teste. | Não comprovado |

Veredito geral retornado: REPROVADO. A prova demonstra a rejeição da falha plantada, não a conclusão da spec 004. O formato textual dos resultados retornados difere dos rótulos prescritos no perfil.

## Decisões não óbvias
O erro foi plantado em arquivo sintético isolado, preservando o código e os dados reais da aplicação. O perfil operou em sandbox read-only.

## O que tentei e não funcionou
A primeira rodada recebeu um caminho incompleto e rejeitou por ausência de evidência. Uma tentativa de desativar o conector Notion por configuração foi rejeitada pelo carregador de configuração. A rodada final usou os caminhos completos e confirmou o defeito. O CLI exibiu avisos de autenticação do Notion durante inicialização; a revisão não usou conectores.

## Próximo passo exato
Completar a skill .agents/skills/imagens-equipamentos/SKILL.md com verificação local de dimensões, duplicidade e manifesto, depois de conferir a documentação oficial e as ferramentas autorizadas.

## Arquivos relevantes
- .codex/agents/verificador-spec.toml
- agents/verificador-spec.md
- docs/specs/004-dados-iniciais/spec.md
- .agents/skills/imagens-equipamentos/SKILL.md
