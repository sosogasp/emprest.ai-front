"""Local Pixabay search and validation. No Supabase client or upload capability."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import struct
import time
import urllib.error
import urllib.parse
import urllib.request
from PIL import Image

LICENSE = "https://pixabay.com/service/license-summary/"
ASSETS = {f"TI-{number:04d}" for number in range(1, 13)}


def search(query, cache, order="popular", category=None, photo_id=None):
    cache.mkdir(parents=True, exist_ok=True)
    cache_query = query if order == "popular" else query + "|" + order
    if category:
        cache_query += "|" + category
    if photo_id is not None:
        cache_query = "id:" + str(photo_id)
    target = cache / (hashlib.sha256(cache_query.encode()).hexdigest() + ".json")
    if target.exists() and time.time() - target.stat().st_mtime < 86400:
        return target
    key = os.environ.get("PIXABAY_API_KEY")
    if not key:
        raise ValueError("Defina PIXABAY_API_KEY localmente. Não envie a chave ao chat.")
    parameters = {
        "key": key, "q": query, "image_type": "photo",
        "min_width": 800, "min_height": 600, "safesearch": "true", "per_page": 20,
        "order": order,
    }
    if category:
        parameters['category'] = category
    if photo_id is not None:
        parameters.pop('q')
        parameters['id'] = photo_id
    params = urllib.parse.urlencode(parameters)
    try:
        request = urllib.request.Request("https://pixabay.com/api/?" + params,
                                         headers={"User-Agent": "emprest.ai-equipment-preparation/1.0"})
        with urllib.request.urlopen(request, timeout=30) as response:
            result = json.load(response)
    except (urllib.error.URLError, ValueError):
        raise ValueError("Falha na API Pixabay. Confira conexão, chave e limite localmente.") from None
    # Only persist metadata required for selection, never the request URL or API key.
    hits = [{field: hit.get(field) for field in (
        "id", "pageURL", "user", "largeImageURL", "imageWidth", "imageHeight",
    )} for hit in result.get("hits", [])]
    temporary = target.with_suffix(".tmp")
    temporary.write_text(json.dumps({"query": query, "hits": hits}, ensure_ascii=False, indent=2),
                         encoding="utf-8")
    temporary.replace(target)
    return target


def validate(manifest):
    rows = json.loads(manifest.read_text(encoding="utf-8"))
    if not isinstance(rows, list) or len(rows) != 12:
        raise ValueError("O manifesto precisa conter exatamente 12 equipamentos.")
    if {row.get("patrimonio") for row in rows} != ASSETS:
        raise ValueError("Patrimônios ausentes, repetidos ou desconhecidos.")
    ids, hashes = set(), set()
    root = manifest.parent.resolve()
    for row in rows:
        asset = row["patrimonio"]
        photo_id = row.get("pixabay_id")
        if type(photo_id) is not int or photo_id <= 0 or photo_id in ids:
            raise ValueError(f"{asset}: ID Pixabay inválido ou repetido.")
        ids.add(photo_id)
        source = urllib.parse.urlparse(row.get("source", ""))
        if (source.scheme != "https" or source.hostname != "pixabay.com"
                or not re.search(rf"-{photo_id}/?$", source.path)):
            raise ValueError(f"{asset}: origem não corresponde ao ID Pixabay.")
        if not row.get("author") or row.get("license") != LICENSE:
            raise ValueError(f"{asset}: autor ou licença ausente.")
        if row.get("storage_key") != f"equipamentos/{asset}.png":
            raise ValueError(f"{asset}: chave de armazenamento deve ser estável por patrimônio.")
        image = (root / row.get("file", "")).resolve()
        if not image.is_relative_to(root) or image.suffix.lower() != ".png":
            raise ValueError(f"{asset}: arquivo PNG deve ficar junto ao manifesto.")
        data = image.read_bytes()
        if (len(data) < 24 or data[:8] != b"\x89PNG\r\n\x1a\n"
                or data[12:16] != b"IHDR" or struct.unpack(">II", data[16:24]) != (800, 600)):
            raise ValueError(f"{asset}: PNG precisa ter 800×600.")
        with Image.open(image) as decoded:
            decoded.verify()
        digest = hashlib.sha256(data).hexdigest()
        if digest != row.get("sha256") or digest in hashes:
            raise ValueError(f"{asset}: hash incorreto ou imagem repetida.")
        hashes.add(digest)
        review = row.get("review", {})
        if (review.get("approved") is not True or not review.get("reviewer")
                or not review.get("date") or not review.get("notes")):
            raise ValueError(f"{asset}: revisão visual não registrada.")
    print("12 arquivos locais validados. Publicação e URLs públicas ainda exigem conferência separada.")


def main():
    parser = argparse.ArgumentParser()
    commands = parser.add_subparsers(dest="command", required=True)
    lookup = commands.add_parser("search")
    lookup.add_argument("query")
    lookup.add_argument("--cache", type=Path, required=True)
    lookup.add_argument("--order", choices=("popular", "latest"), default="popular")
    by_id = commands.add_parser("lookup")
    by_id.add_argument("photo_id", type=int)
    by_id.add_argument("--cache", type=Path, required=True)
    check = commands.add_parser("validate")
    check.add_argument("manifest", type=Path)
    args = parser.parse_args()
    try:
        if args.command == "search":
            print(search(args.query, args.cache, args.order))
        elif args.command == "lookup":
            print(search("", args.cache, photo_id=args.photo_id))
        else:
            validate(args.manifest)
    except (ValueError, OSError, KeyError, TypeError) as error:
        parser.exit(1, str(error) + "\n")


if __name__ == "__main__":
    main()
