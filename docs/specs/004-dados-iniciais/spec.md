# 004 — Dados iniciais

## Objetivo
Preparar a carga repetível de 12 equipamentos com fotos e a conta de correção.

## Vínculo
PRD v1 itens 1 e 2, layout §§5.1–5.2 e ADR-001 (persistência, autenticação e isolamento por tenant).

## Regras
- Usar os patrimônios, nomes, categorias e buscas da lista da prática. Seguir o briefing de dados para situação: TI-0004 e TI-0007 em manutenção, inclusive TI-0010 entre os dez disponíveis.
- Usar exclusivamente a API do Pixabay, conforme orientação do professor em aula. Manter origem, autor e licença por foto, com revisão visual para pessoas, marcas, logotipos, textos e telas com conteúdo.
- A preparação e a verificação acontecem localmente. O responsável humano executa os uploads e a carga do deploy, com credenciais fora do repositório.
- A conta indicada no briefing é exclusiva do professor. A carga cria zero empréstimos e preserva o histórico existente.

## Critérios de aceitação
- CA-01 — O tenant de correção contém os 12 patrimônios com os dados prescritos e as duas situações de manutenção acordadas.
- CA-02 — Cada patrimônio tem uma foto distinta de 800×600, visualmente aprovada, com origem, autor e licença registrados. As 12 URLs finais abrem sem autenticação.
- CA-03 — Duas execuções da carga mantêm as mesmas identidades de equipamento e conta, as mesmas chaves de armazenamento e zero novos empréstimos. A reexecução preserva empréstimos existentes.
- CA-04 — A conta do professor autentica pelo login existente e começa com zero empréstimos. Testes que criam empréstimos usam uma conta separada.

## Fora de escopo
Tela de catálogo, cadastro por interface e importação de planilha. O tenant de produção será informado pelo responsável no momento da execução.

## Contrato afetado
Modelo de equipamento, referência à foto e manifesto da carga, além do fluxo de provisionamento existente.

## Dívida de processo
A referência escrita ao Pexels fica substituída pela decisão registrada acima. A escolha de ferramenta de imagem depende das dependências permitidas pelo ADR.

## Como sei que funcionou
Evidências de revisão visual, checagem de dimensões e duplicidade, carga local repetida, verificação do login e confirmação de produção pelo responsável. O verificador registra o resultado por CA.
