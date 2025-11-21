#!/usr/bin/env python
import argparse
import json
import os
import sys
import re
import logging
from pathlib import Path

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent / 'lib'))
from source_dir import SourceDirectory
from translation import (
    Translation, print_colored_dict
)
from tap_stream import TapStream
from translation_filler import fill_up_translation

logger = logging.getLogger(__name__)


class TranslationManager:
    def __init__(self, source_path, json_folder_path):
        self.source_directory = SourceDirectory(source_path) if source_path else None
        self.json_folder_path = Path(json_folder_path) if json_folder_path else None



    def list_component_keys(self):
        if not self.source_directory or not self.source_directory.components:
            logger.error("No source files with translations found.")
            return

        all_keys = self.source_directory.list_component_keys()
        
        if not all_keys:
            logger.info("No translation keys found in any components.")
            return

        # Print sorted keys
        for file_path, key in all_keys:
            print(f"{file_path}\t{key}")

    def rename_key(self, old_key: str, new_key: str):
        """Rename a translation key in source files and JSON files"""
        # First verify the old key exists in both source AND English JSON
        key_in_source = old_key in self.source_directory.get_all_keys()

        key_in_english = False
        en_json_path = self.json_folder_path / "en.json"
        if en_json_path.exists():
            en_translation = Translation.from_json_file(en_json_path)
            if en_translation.get(old_key) is not None:
                key_in_english = True

        if not key_in_source and not key_in_english:
            logger.error(f"Key '{old_key}' not found in source files or English JSON")
            return False
        if not key_in_source:
            logger.error(f"Key '{old_key}' not found in source files")
            return False
        if not key_in_english:
            logger.error(f"Key '{old_key}' not found in English JSON")
            return False

        # Rename in source files
        source_files_changed = self.source_directory.rename_key(old_key, new_key)
        logger.info(f"Updated key in {source_files_changed} source files")

        # Rename in JSON files
        json_files_changed = 0
        if self.json_folder_path and self.json_folder_path.exists():
            for json_file in self.json_folder_path.glob('*.json'):
                translation = Translation.from_json_file(json_file)
                value = translation.get(old_key)
                if value is not None:
                    logger.info(f"Renaming key in JSON file: {json_file}")
                    logger.debug(f"  Old value: {value}")
                    translation.set(new_key, value)
                    # Remove old key
                    translation.entries.pop(old_key, None)
                    # Save using Translation methods
                    translation.save_as_json(json_file)
                    json_files_changed += 1
        logger.info(f"Updated key in {json_files_changed} JSON files")

        return True

    def list_json_keys(self):
        if not self.json_folder_path or not self.json_folder_path.exists():
            logger.error("JSON folder does not exist.")
            return

        json_files = list(self.json_folder_path.glob('*.json'))
        if not json_files:
            logger.warning(f"No JSON files found in {self.json_folder_path}")
            return

        def traverse_dict(d, prefix=""):
            items = []
            for k, v in sorted(d.items()):
                current_key = f"{prefix}.{k}" if prefix else k
                if isinstance(v, dict):
                    items.extend(traverse_dict(v, current_key))
                else:
                    items.append((current_key, str(v)))
            return items

        for json_file in sorted(json_files):
            translation = Translation.from_json_file(json_file)
            nested_dict = translation.to_nested_dict()
            all_keys = traverse_dict(nested_dict)
            for key, value in all_keys:
                # Replace newlines with spaces in the value for TSV compatibility
                value = value.replace('\n', ' ').replace('\r', '')
                print(f"{json_file}\t{key}\t{value}")
                
    def remove_orphan_keys(self):
        """Remove keys from JSON files that don't exist in source files"""
        if not self.source_directory or not self.source_directory.components:
            logger.error("No source files with translations found.")
            return
            
        if not self.json_folder_path or not self.json_folder_path.exists():
            logger.error("JSON folder does not exist.")
            return
            
        json_files = list(self.json_folder_path.glob('*.json'))
        if not json_files:
            logger.warning(f"No JSON files found in {self.json_folder_path}")
            return
            
        # Get all keys from source files
        all_keys = self.source_directory.get_all_keys()
        
        # Process each JSON file
        for json_file in json_files:
            translation = Translation.from_json_file(json_file)
            orphan_keys = []
            
            # Find orphan keys
            for key in list(translation.entries.keys()):
                if key not in all_keys:
                    orphan_keys.append(key)
                    translation.entries.pop(key)
            
            # Save the file if orphan keys were removed
            if orphan_keys:
                translation.save_as_json(json_file)
                logger.info(f"{json_file.name}: Removed {len(orphan_keys)} orphan keys: {', '.join(orphan_keys)}")
            else:
                logger.info(f"{json_file.name}: No orphan keys found")
    

    def check_translations(self):
        """Check if all translation keys exist in all language files (TAP format)"""
        if not self.source_directory or not self.source_directory.components:
            logger.error("No source files with translations found.")
            return
            
        if not self.json_folder_path or not self.json_folder_path.exists():
            logger.error("JSON folder does not exist.")
            return
            
        json_files = list(self.json_folder_path.glob('*.json'))
        if not json_files:
            logger.warning(f"No JSON files found in {self.json_folder_path}")
            return
            
        # Get all keys from source files
        all_keys = self.source_directory.get_all_keys()
        
        # Get all language codes from JSON files
        languages = [json_file.stem for json_file in json_files]
        
        # Load all translations
        translations = {}
        for lang in languages:
            json_file = self.json_folder_path / f"{lang}.json"
            translations[lang] = Translation.from_json_file(json_file)
        
        # Group keys by source file for better organization
        key_to_files = {}
        for component in self.source_directory.components:
            for key in component.keys:
                if key not in key_to_files:
                    key_to_files[key] = []
                key_to_files[key].append(str(component.file_path))
        
        # Create TAP stream and run checks
        tap = TapStream()
        tap.check_translations_tap(all_keys, key_to_files, translations, languages)
        
    def fill_up_translations(self):
        """Fill up missing translations in all language files using English as source"""
        if not self.json_folder_path or not self.json_folder_path.exists():
            logger.error("JSON folder does not exist.")
            return
            
        json_files = list(self.json_folder_path.glob('*.json'))
        if not json_files:
            logger.warning(f"No JSON files found in {self.json_folder_path}")
            return
            
        # Get English translation as source
        en_json_path = self.json_folder_path / "en.json"
        if not en_json_path.exists():
            logger.error("English translation file (en.json) not found.")
            return
            
        source_translation = Translation.from_json_file(en_json_path)
        
        # Process each non-English JSON file
        for json_file in json_files:
            if json_file.stem == "en":
                continue
                
            logger.info(f"Processing {json_file.name}...")
            target_translation = Translation.from_json_file(json_file)
            
            # Extract language code from filename (e.g., "ru" from "ru.json")
            language_code = json_file.stem
            
            # Fill up translations
            result_translation = fill_up_translation(source_translation, target_translation, language_code)
            
            # Save the result
            result_translation.save_as_json(json_file)
            logger.info(f"Updated {json_file.name}")


def main():
    parser = argparse.ArgumentParser(description="Manage translations")
    parser.add_argument("--source_path", help="Path to source file or directory to scan for translations")
    parser.add_argument("--json_folder_path", help="Path to the folder for JSON locale files")
    parser.add_argument("--list-in-source", action="store_true", help="List all translation keys in the component file")
    parser.add_argument("--list-in-json", action="store_true", help="List all translation keys and values from JSON files")
    parser.add_argument("--rename-key", nargs=2, metavar=('OLD_KEY', 'NEW_KEY'), 
                        help="Rename a translation key in source and JSON files")
    parser.add_argument("--check-translations", action="store_true", 
                        help="Check if all translation keys exist in all language files and template variables match (TAP format)")
    parser.add_argument("--remove-orphan-keys", action="store_true",
                        help="Remove keys from JSON files that don't exist in source files")
    parser.add_argument("--fill-up-translations", action="store_true",
                        help="Fill up missing translations in all language files using English as source")
    parser.add_argument("--log-level", default="INFO", 
                        choices=["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"],
                        help="Set the logging level (default: INFO)")
    
    args = parser.parse_args()

    # Configure logging
    logging.basicConfig(
        level=getattr(logging, args.log_level),
        format='%(asctime)s %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )

    if args.list_in_source and not args.source_path:
        logger.error("--source_path must be specified for --list-in-source")
        parser.print_help()
        return

    if args.list_in_json and not args.json_folder_path:
        logger.error("--json_folder_path must be specified for --list-in-json")
        parser.print_help()
        return
        
    if args.check_translations and (not args.source_path or not args.json_folder_path):
        logger.error("--source_path and --json_folder_path must be specified for --check-translations")
        parser.print_help()
        return
        
    if args.remove_orphan_keys and (not args.source_path or not args.json_folder_path):
        logger.error("--source_path and --json_folder_path must be specified for --remove-orphan-keys")
        parser.print_help()
        return
        
    if args.fill_up_translations and not args.json_folder_path:
        logger.error("--json_folder_path must be specified for --fill-up-translations")
        parser.print_help()
        return

    manager = TranslationManager(args.source_path, args.json_folder_path)

    if args.rename_key:
        if not args.source_path or not args.json_folder_path:
            logger.error("--source_path and --json_folder_path must be specified for --rename-key")
            parser.print_help()
            return
        old_key, new_key = args.rename_key
        manager.rename_key(old_key, new_key)

    if args.list_in_source:
        manager.list_component_keys()

    if args.list_in_json:
        manager.list_json_keys()
        
    if args.check_translations:
        manager.check_translations()
        
    if args.remove_orphan_keys:
        manager.remove_orphan_keys()
        
    if args.fill_up_translations:
        manager.fill_up_translations()

    if not (args.rename_key or args.list_in_source or args.list_in_json or 
            args.check_translations or args.remove_orphan_keys or args.fill_up_translations):
        logger.warning("No action specified. Use --rename_key {old_key} {new_key}, --list-in-source, --list-in-json, --check-translations, --remove-orphan-keys, --fill-up-translations.")
        parser.print_help()

if __name__ == "__main__":
    main()
