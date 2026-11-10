---
name: imagens-equipamentos
description: Preparar e revisar fotos de equipamentos do emprest.ai pela API Pixabay antes da carga inicial.
---

# Imagens de equipamentos

Use a lista da spec 004 e a decisão do professor que substitui Pexels por Pixabay. Antes de buscar imagens, consulte a documentação oficial da API e a licença vigente em https://pixabay.com/api/docs/ e https://pixabay.com/service/license-summary/.

Receba a chave via variável de ambiente, sem registrá-la em arquivos, logs ou histórico. Prepare as imagens localmente. Credenciais do Supabase de produção não fazem parte deste fluxo.

Mantenha um manifesto por patrimônio com ID da foto, página original, autor, licença consultada, arquivo local e hash do arquivo. Rejeite ID ou conteúdo repetido entre equipamentos.

Revise cada imagem para rejeitar pessoas, marcas, logos legíveis, texto e telas com conteúdo. Registre quem revisou, resultado e motivo de rejeição. Metadados da API não substituem essa revisão.

Entregue cada imagem em 800×600. Verifique as dimensões reais após a transformação. Use apenas ferramentas permitidas nos ADRs e rules. Se nenhuma ferramenta existente resolver, apresente a alternativa para decisão antes de instalar dependências.

A saída ainda precisa de validação automatizada das dimensões e duplicidade. Não declare o lote aprovado até que essas verificações e a revisão visual estejam registradas.

O responsável humano faz o upload ao bucket público com chaves estáveis por patrimônio e executa a carga. O agente prepara arquivos e instruções. Verifique depois as URLs públicas fornecidas pelo responsável, sem autenticação.
