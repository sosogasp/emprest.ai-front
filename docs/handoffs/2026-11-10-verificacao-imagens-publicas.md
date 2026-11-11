# Handoff — verificação das imagens públicas

Spec 004, CA-02. Verificação de leitura após upload executado pela responsável.

## Onde parei
As 12 URLs públicas responderam HTTP 200 sem autenticação. Todas as imagens decodificam como PNG 800×600 e têm SHA-256 idêntico ao manifesto preparado. Evidência por patrimônio em docs/specs/004-dados-iniciais/verificacao-publica.json. Saída final: TI-0012 PASS 200 [800, 600]. Nenhuma escrita remota foi executada pelo agente.

## Decisões não óbvias
A URL fornecida pela responsável identifica bucket equipamentos e prefixo equipamentos/. As demais URLs foram construídas pelas chaves já registradas no manifesto.

## O que tentei e não funcionou
O ambiente restrito bloqueou as conexões de leitura. A verificação passou com acesso à rede autorizado.

## Próximo passo exato
Preparar a carga inicial e o provisionamento da conta previstos na spec 004. A próxima rodada do verificador deve incluir esta evidência pública; a spec completa continua pendente.

## Arquivos relevantes
- docs/specs/004-dados-iniciais/verificacao-publica.json
- docs/specs/004-dados-iniciais/imagens/manifest.json
- .agents/skills/imagens-equipamentos/references/operacao.md