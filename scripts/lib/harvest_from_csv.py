import csv
import json
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

KEEP_FIELDS = [
    'active', 'country', 'state', 'city',
    'name', 'name_url', 'subname', 'subname_url',
    'facebook', 'instagram', 'x',
]

TYPE_MAP = {
    'grow':       ['orchard_public', 'orchard_historic', 'garden_public', 'garden_private', 'seeds', 'plants'],
    'forage':     ['forage', 'glean_urban', 'glean_rural', 'dive'],
    'distribute': ['rescue', 'fridge', 'pantry', 'meals', 'trade'],
}


class HarvestCSV:
    def __init__(self, csv_path, output_path):
        self.csv_path = Path(csv_path)
        self.output_path = Path(output_path)

    def substitute(self, value):
        """Apply standard substitutions matching data.js HARVEST_SUBSTITUTIONS."""
        if value in ('', '-'):
            return None
        if value == 'TRUE':
            return True
        if value == 'FALSE':
            return False
        return value

    def process(self):
        """Read the organizations CSV and write harvest.json."""
        results = []
        with open(self.csv_path, newline='', encoding='utf-8') as f:
            for row in csv.DictReader(f):
                if self.substitute(row.get('include')) is not True:
                    continue
                obj = {field: self.substitute(row[field]) for field in KEEP_FIELDS if self.substitute(row.get(field, ''))}
                if self.substitute(row.get('donate')) is True:
                    obj['donate'] = True
                types = sorted(cat for cat, cols in TYPE_MAP.items() if any(self.substitute(row.get(c)) is True for c in cols))
                if types:
                    obj['type'] = types
                results.append(obj)

        self.output_path.write_text(json.dumps(results, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        logger.info(f'Wrote {len(results)} rows to {self.output_path}')
        return results
