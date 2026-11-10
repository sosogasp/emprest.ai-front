# Handoff — skill de imagens e lote Pixabay

Spec 004, CA-02 (preparação local). Frontend cb8d9f6, backend a7bfaeb na primeira rodada. Sem alteração de banco ou upload.

## Onde parei
As 12 imagens finais 800×600 estão em docs/specs/004-dados-iniciais/imagens/, com manifesto de IDs, hashes, créditos e transformações. O lote passou pela validação local e por revisão visual. Sete testes sintéticos passaram: Ran 7 tests / OK.

Frontend: lint sem erros e quatro avisos no cliente gerado; typecheck passou; Tests 3 passed; build built in 1.24s, com aviso de tamanho de bundle.
Backend: lint, typecheck e build passaram; Test Suites 3 passed; Tests 20 passed. A primeira execução restrita falhou por EACCES no loopback; a reexecução com conexão local permitida passou.

Primeira rodada do verificador registrado, em contexto novo e sandbox somente leitura:

| CA | Resultado | Evidência e pendência |
|---|---|---|
| CA-01 | SEM EVIDÊNCIA | O manifesto não comprova carga no banco nem situação dos equipamentos |
| CA-02 | SEM EVIDÊNCIA | Preparação local sustentada; URLs públicas ainda ausentes |
| CA-03 | SEM EVIDÊNCIA | Reexecução de imagens não comprova idempotência da carga no banco |
| CA-04 | SEM EVIDÊNCIA | Login e conta docente ainda não comprovados |

O verificador pediu staging do lote, validação da transformação, validação da data e correção da nota visual de TI-0007. As correções usam pasta temporária com publicação só após validação, reprodução do recorte a partir do original, data ISO e nota de revisão efetivamente realizada. A rodada seguinte deve confirmar as correções.

## Decisões não óbvias
A responsável substituiu Pexels por Pixabay e autorizou Pillow. Em 2026-11-10 permitiu caracteres de teclado e rótulos técnicos usuais, mantendo as demais restrições.
O agente escolheu recortar TI-0007 para excluir a faixa com logotipo e os objetos laterais; a saída mostra a tela vazia e a moldura. Coordenadas e justificativa estão no manifesto. A seleção é stock e não comprova medidas físicas dos equipamentos.
Onze exemplos de rejeições verificadas estão em references/revisao.json, sem alegar contagem total dos resultados da API.
A preparação idêntica preserva arquivos e manifesto; seleção alterada exige uma nova pasta de saída.

## O que tentei e não funcionou
A API recusou o cliente padrão de Python com HTTP 403 / 1010. O pedido identificado como emprest.ai-equipment-preparation/1.0 funcionou. Chave e URL autenticado nunca foram registrados.
A inspeção inicial encontrou pessoas, marcas e telas com conteúdo em muitos resultados. Fotos com esses elementos foram excluídas ou, no caso de TI-0007, recortadas e novamente inspecionadas.
Um rerun com a nota antiga foi recusado após a proteção de imutabilidade; a seleção revisada reproduziu o lote correto.

## Próximo passo exato
Conferir a segunda rodada do verificador e entregar as instruções de upload humano em references/operacao.md. A spec 004 continua pendente de URLs públicas, carga e conta do professor.

## Arquivos relevantes
- .agents/skills/imagens-equipamentos/SKILL.md
- .agents/skills/imagens-equipamentos/scripts/test_workflow.py
- .agents/skills/imagens-equipamentos/references/operacao.md
- .agents/skills/imagens-equipamentos/references/selecoes.json
- .agents/skills/imagens-equipamentos/references/revisao.json
- docs/specs/004-dados-iniciais/imagens/manifest.json