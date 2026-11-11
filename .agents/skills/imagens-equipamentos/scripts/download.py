"""Download one manually selected Pixabay API hit. No storage credentials required."""
import argparse
import json
from pathlib import Path
import urllib.error
import urllib.parse
import urllib.request

parser = argparse.ArgumentParser()
parser.add_argument('cache', type=Path)
parser.add_argument('photo_id', type=int)
parser.add_argument('output', type=Path)
args = parser.parse_args()
try:
    result = json.loads(args.cache.read_text(encoding='utf-8'))
    hit = next(hit for hit in result['hits'] if hit['id'] == args.photo_id)
    url = urllib.parse.urlparse(hit['largeImageURL'])
    if url.scheme != 'https' or url.hostname not in {'pixabay.com', 'cdn.pixabay.com'}:
        raise ValueError('Origem inesperada.')
    request = urllib.request.Request(url.geturl(), headers={
        'User-Agent': 'emprest.ai-equipment-preparation/1.0',
    })
    with urllib.request.urlopen(request, timeout=30) as response:
        data = response.read(20_000_001)
    if len(data) > 20_000_000:
        raise ValueError('Imagem excede 20 MB.')
    args.output.parent.mkdir(parents=True, exist_ok=True)
    temporary = args.output.with_suffix('.tmp')
    temporary.write_bytes(data)
    temporary.replace(args.output)
except (OSError, ValueError, KeyError, StopIteration):
    parser.exit(1, 'Falha no download. Confira o ID selecionado e o cache localmente.\n')
