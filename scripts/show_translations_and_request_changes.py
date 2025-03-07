#!/usr/bin/env python3

import sys
import json
import argparse
from pathlib import Path

# Add lib directory to path
sys.path.insert(0, str(Path(__file__).parent / 'lib'))
from translation import Translation
from translation_filler import fill_up_translation

def main():
    parser = argparse.ArgumentParser(description='Request translation changes from Claude')
    parser.add_argument('source', help='Path to the source language JSON file')
    parser.add_argument('target', help='Path to the translations JSON file')
    
    args = parser.parse_args()
    
    source_translation = Translation.from_json_file(args.source)
    target_translation = Translation.from_json_file(args.target)
    result_translation = fill_up_translation(source_translation, target_translation)

    print(json.dumps(result_translation.to_nested_dict(), indent=2))

if __name__ == "__main__":
    main()
