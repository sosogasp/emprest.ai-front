"""Build a deterministic local batch from reviewed API selections and downloads."""
import argparse
import hashlib
import json
from pathlib import Path
from tempfile import TemporaryDirectory

from pixabay import ASSETS, LICENSE, normalize, validate


def build(selections, cache, originals, output):
    rows = json.loads(selections.read_text(encoding='utf-8'))
    if len(rows) != 12 or {row['patrimonio'] for row in rows} != ASSETS:
        raise ValueError('Selecione os 12 patrimônios, sem repetição.')
    ids = [row['pixabay_id'] for row in rows]
    if len(set(ids)) != 12:
        raise ValueError('Cada equipamento precisa de uma foto distinta.')
    hits = {}
    for cached in sorted(cache.glob('*.json')):
        for hit in json.loads(cached.read_text(encoding='utf-8'))['hits']:
            hits[hit['id']] = hit
    records = []
    # Validate review decisions before writing any batch files.
    for row in rows:
        review = row.get('review', {})
        if (review.get('approved') is not True or not review.get('reviewer')
                or not review.get('date') or not review.get('notes')):
            raise ValueError('Todas as seleções precisam de revisão visual registrada.')
        if row['pixabay_id'] not in hits:
            raise ValueError('ID selecionado não consta dos resultados da API.')
    output.mkdir(parents=True, exist_ok=True)
    for row in sorted(rows, key=lambda row: row['patrimonio']):
        asset = row['patrimonio']
        hit = hits[row['pixabay_id']]
        encoded = normalize(originals / f'{hit["id"]}.jpg', row.get('crop'))
        digest = hashlib.sha256(encoded).hexdigest()
        target = output / f'{asset}-{digest}.png'
        target.write_bytes(encoded)
        records.append({
            'patrimonio': asset, 'pixabay_id': hit['id'], 'source': hit['pageURL'],
            'author': hit['user'], 'license': LICENSE, 'file': target.name,
            'sha256': digest,
            'storage_key': f'equipamentos/{asset}.png', 'review': row['review'],
            'transform': {'crop': row.get('crop'), 'size': [800, 600], 'fit': 'pad'},
        })
    manifest = output / 'manifest.json'
    temporary = manifest.with_suffix('.tmp')
    temporary.write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding='utf-8')
    validate(temporary, originals)
    temporary.replace(manifest)


def prepare(selections, cache, originals, output):
    output.parent.mkdir(parents=True, exist_ok=True)
    with TemporaryDirectory(prefix='.imagens-', dir=output.parent) as temporary:
        stage = Path(temporary) / 'lote'
        build(selections, cache, originals, stage)
        if output.exists():
            validate(output / 'manifest.json', originals)
            if (output / 'manifest.json').read_bytes() != (stage / 'manifest.json').read_bytes():
                raise ValueError('Seleção alterada: use uma nova pasta para preservar o lote anterior.')
        else:
            stage.rename(output)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    for name in ('selections', 'cache', 'originals', 'output'):
        parser.add_argument(name, type=Path)
    args = parser.parse_args()
    try:
        prepare(args.selections, args.cache, args.originals, args.output)
    except (ValueError, OSError, KeyError, TypeError):
        parser.exit(1, 'Lote não aprovado. Confira seleções, cache e arquivos locais.\n')
