"""CA-02 regressions using synthetic images only. Run with Python unittest."""
import json
from pathlib import Path
import tempfile
import unittest

from PIL import Image
from pixabay import validate
from prepare import prepare


class ImageWorkflowTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory(dir=Path.cwd())
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        self.cache = self.root / 'cache'
        self.originals = self.root / 'originals'
        self.output = self.root / 'output'
        self.cache.mkdir()
        self.originals.mkdir()
        self.selection = self.root / 'selection.json'
        rows, hits = [], []
        for number in range(1, 13):
            Image.new('RGB', (1000, 700), (number * 19, number * 11, number * 7)).save(
                self.originals / f'{number}.jpg')
            rows.append({
                'patrimonio': f'TI-{number:04d}', 'pixabay_id': number,
                'review': {'approved': True, 'reviewer': 'synthetic test',
                           'date': '2026-11-10', 'notes': 'Synthetic fixture only'},
            })
            hits.append({'id': number, 'pageURL': f'https://pixabay.com/photos/synthetic-{number}/',
                         'user': 'synthetic'})
        self.selection.write_text(json.dumps(rows), encoding='utf-8')
        (self.cache / 'results.json').write_text(json.dumps({'hits': hits}), encoding='utf-8')

    def build(self):
        prepare(self.selection, self.cache, self.originals, self.output)

    def invalid_manifest(self, change):
        self.build()
        rows = json.loads((self.output / 'manifest.json').read_text(encoding='utf-8'))
        change(rows)
        path = self.output / 'invalid.json'
        path.write_text(json.dumps(rows), encoding='utf-8')
        with self.assertRaises(ValueError):
            validate(path, self.originals)

    def test_ca02_rerun_is_identical(self):
        self.build()
        before = (self.output / 'manifest.json').read_bytes()
        self.build()
        self.assertEqual(before, (self.output / 'manifest.json').read_bytes())
        self.assertEqual(12, len(list(self.output.glob('*.png'))))

    def test_ca02_duplicate_id_is_rejected(self):
        self.invalid_manifest(lambda rows: rows[1].update(pixabay_id=rows[0]['pixabay_id']))

    def test_ca02_missing_review_is_rejected(self):
        self.invalid_manifest(lambda rows: rows[0]['review'].update(approved=False))

    def test_ca02_invalid_date_is_rejected(self):
        self.invalid_manifest(lambda rows: rows[0]['review'].update(date='yesterday'))

    def test_ca02_crop_must_reproduce_pixels(self):
        self.invalid_manifest(lambda rows: rows[0]['transform'].update(crop=[0, 0, 500, 500]))

    def test_ca02_invalid_dimensions_are_rejected(self):
        self.build()
        rows = json.loads((self.output / 'manifest.json').read_text(encoding='utf-8'))
        Image.new('RGB', (799, 600), 'white').save(self.output / rows[0]['file'])
        with self.assertRaises(ValueError):
            validate(self.output / 'manifest.json', self.originals)

    def test_ca02_failed_run_preserves_previous_batch(self):
        self.build()
        before = (self.output / 'manifest.json').read_bytes()
        (self.originals / '12.jpg').unlink()
        with self.assertRaises(FileNotFoundError):
            self.build()
        self.assertEqual(before, (self.output / 'manifest.json').read_bytes())
        self.assertEqual(12, len(list(self.output.glob('*.png'))))
        self.assertEqual([], list(self.root.glob('.imagens-*')))


if __name__ == '__main__':
    unittest.main()
