# Preparação local de imagens

Documentação consultada em 2026-11-10
- https://pixabay.com/api/docs/
- https://pixabay.com/service/license-summary/

A API exige cache de 24 horas e proíbe hotlink permanente. A tela de catálogo deve mostrar Fotos: Pixabay com link, conforme a spec aprovada. Pillow já estava instalado e foi autorizado pela responsável.

## Credenciais
A chave vem exclusivamente de PIXABAY_API_KEY no processo local. A responsável a mantém no backend/.env ignorado pelo Git. Carregue somente essa variável para a busca. Não inclua a chave em comandos, arquivos versionados ou logs.

## Seleção e download
Use a pasta scripts desta skill como referência para os caminhos abaixo.

python scripts/pixabay.py search "hdmi cable" --cache CAMINHO_LOCAL/cache
python scripts/pixabay.py lookup 1827 --cache CAMINHO_LOCAL/cache
python scripts/download.py CAMINHO_CACHE_JSON 1827 CAMINHO_LOCAL/originais/1827.jpg

A busca armazena resultados por 24 horas. O download usa um ID presente no resultado da API. Os URLs temporários de download podem expirar e exigem atualização do resultado após a janela do cache. A chave e o URL da requisição autenticada ficam fora da saída.

## Revisão e transformação
references/selecoes.json registra as 12 seleções aprovadas visualmente. A responsável autorizou caracteres de teclado e rótulos técnicos usuais. Pessoas, marcas/logos legíveis, texto promocional e conteúdo em telas continuam proibidos.

TI-0007 usa um recorte registrado em pixels [350,160,900,480], escolhido pelo agente para excluir a faixa inferior com marca e os objetos laterais. O resultado mostra a tela e a moldura. A revisão visual incide sobre a saída, além da origem. Nenhum recorte é aplicado silenciosamente.

python scripts/prepare.py references/selecoes.json CAMINHO_LOCAL/cache CAMINHO_LOCAL/originais CAMINHO_LOCAL/lote
python scripts/pixabay.py validate CAMINHO_LOCAL/lote/manifest.json --originals CAMINHO_LOCAL/originais

prepare.py preserva a proporção com margens brancas em PNG 800×600. Os arquivos locais incluem o hash no nome. Prepara o lote inteiro em pasta temporária e só publica a pasta após validar. Repetir a mesma seleção preserva nomes, conteúdo e manifesto. Uma seleção diferente exige nova pasta de saída para preservar a anterior. Com --originals, o validador reproduz a transformação e compara os pixels normalizados pelo SHA-256.

## Manifesto e garantias
O manifesto contém exatamente TI-0001 a TI-0012, ID Pixabay, origem, autor, licença, transformação, SHA-256 e chave estável de armazenamento por patrimônio. review registra aprovação, responsável, data e observações.
O validador verifica patrimônios, IDs e arquivos distintos, dimensões, decodificação PNG, créditos, origem, chaves e registro da revisão. A avaliação do conteúdo visual exige inspeção das imagens.

## Publicação pelo responsável humano
O lote fica em docs/specs/004-dados-iniciais/imagens/ do repositório frontend. Para cada registro do manifesto, envie o arquivo indicado por file ao bucket público usando exatamente storage_key, por exemplo equipamentos/TI-0001.png. Reutilize a mesma chave em reexecuções, sem criar cópias numeradas.
O agente não executa upload. Estes scripts não possuem cliente Supabase, comando de publicação nem leitura de credenciais do deploy.
Depois do upload, confira as 12 URLs públicas sem login, repetindo a checagem de dimensões. A configuração do bucket e o carregamento dos dados são etapas distintas da preparação local.
## Regressões locais
python scripts/test_workflow.py
Sete casos sintéticos cobrem reexecução idêntica, ID repetido, revisão ausente, data inválida, recorte adulterado, dimensões inválidas e falha parcial preservando o lote anterior.
