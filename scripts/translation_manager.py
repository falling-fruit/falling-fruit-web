#!/usr/bin/env python
import argparse
import json
import os
import sys
import re
from pathlib import Path
import yaml
from colored import Fore,  Style

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent / 'lib'))
from source_dir import SourceDirectory
from translation import (
    Translation, LocaleFile, YamlLocaleFile, JsonLocaleFile, 
    SortedJsonEncoder, print_colored_dict
)


class TranslationManager:
    def __init__(self, source_path, yaml_folder_path, json_folder_path, yaml_key_renames_path=None, mobile_json_folder_path=None, mobile_key_renames_path=None):
        self.source_directory = SourceDirectory(source_path) if source_path else None
        self.yaml_folder_path = Path(yaml_folder_path) if yaml_folder_path else None
        self.json_folder_path = Path(json_folder_path) if json_folder_path else None
        self.mobile_json_folder_path = Path(mobile_json_folder_path) if mobile_json_folder_path else None
        self.yaml_key_renames_path = Path(yaml_key_renames_path) if yaml_key_renames_path else None
        self.mobile_key_renames_path = Path(mobile_key_renames_path) if mobile_key_renames_path else None
        self.yaml_key_renames = self.load_key_renames(self.yaml_key_renames_path)
        self.mobile_key_renames = self.load_key_renames(self.mobile_key_renames_path)

    def load_key_renames(self, renames_path):
        """Load key renames from TSV file"""
        renames = {}
        if renames_path and renames_path.exists():
            with open(renames_path, 'r') as f:
                for line in f:
                    old_key, new_key = line.strip().split('\t')
                    renames[old_key] = new_key
        return renames

    def append_key_rename(self, old_key: str, new_key: str, is_mobile=False):
        """Append a key rename to the TSV file"""
        renames_path = self.mobile_key_renames_path if is_mobile else self.yaml_key_renames_path
        renames_dict = self.mobile_key_renames if is_mobile else self.yaml_key_renames
        
        if not renames_path:
            return
        
        with open(renames_path, 'a') as f:
            f.write(f"{old_key}\t{new_key}\n")
        renames_dict[old_key] = new_key

    def migrate_translations(self):
        if not self.source_directory or not self.source_directory.components:
            print("Error: No source files with translations found. Skipping migration.")
            return
        if not self.yaml_folder_path.exists():
            print(f"Error: YAML folder '{self.yaml_folder_path}' does not exist.")
            return
        if not self.json_folder_path.exists():
            print(f"Creating JSON folder: {self.json_folder_path}")
            self.json_folder_path.mkdir(parents=True, exist_ok=True)

        yaml_files = list(self.yaml_folder_path.glob('*.yml')) + list(self.yaml_folder_path.glob('*.yaml'))
        if not yaml_files:
            print(f"No YAML files found in {self.yaml_folder_path}")
            return

        for yaml_file in yaml_files:
            lang_code = Path(yaml_file).stem
            json_file = self.json_folder_path / f"{lang_code}.json"
            if json_file.exists():
                yaml_added = 0
                mobile_added = 0
                edited_keys = 0
                missing_keys = 0
                
                all_keys = self.source_directory.get_all_keys()
        
                # Load translations using factory methods
                yaml_translation = Translation.from_yaml_file(yaml_file, self.yaml_key_renames)
                json_translation = Translation.from_json_file(json_file)
                
                # Load mobile translations if available
                mobile_json_file = self.mobile_json_folder_path / f"{lang_code}.json" if self.mobile_json_folder_path else None
                if mobile_json_file and mobile_json_file.exists():
                    mobile_translation = Translation.from_json_file(mobile_json_file, self.mobile_key_renames)
                else:
                    mobile_translation = Translation()

                for key in all_keys:
                    value = yaml_translation.get(key)
                    if value is not None:
                        existing_value = json_translation.get(key)
                        if existing_value is None:
                            yaml_added += 1
                        elif existing_value != value:
                            edited_keys += 1
                        json_translation.set(key, value)
                    elif json_translation.get(key) is None:
                        # Try to get value from mobile translations
                        mobile_value = mobile_translation.get(key)
                        if mobile_value is not None:
                            json_translation.set(key, mobile_value)
                            mobile_added += 1
                        else:
                            missing_keys += 1

                json_translation.save_as_json(json_file)
                print(f"{yaml_file} -> {json_file} added {yaml_added} from YAML, {mobile_added} from mobile, edited {edited_keys} keys, missing {missing_keys} keys. Checked: {len(all_keys)} keys")
            else:
                print(f"{yaml_file} skipped: no {json_file}")



    def list_component_keys(self):
        if not self.source_directory or not self.source_directory.components:
            print("Error: No source files with translations found.")
            return

        all_keys = self.source_directory.list_component_keys()
        
        if not all_keys:
            print("No translation keys found in any components.")
            return

        # Print sorted keys
        for file_path, key in all_keys:
            print(f"{file_path}\t{key}")

    def preview_migration(self, language):
        """Preview migration for a specific language without writing files"""
        if not self.source_directory or not self.source_directory.components:
            print("Error: No source files with translations found.", file=sys.stderr)
            return
        if not self.yaml_folder_path.exists():
            print(f"Error: YAML folder '{self.yaml_folder_path}' does not exist.", file=sys.stderr)
            return
        if not self.mobile_json_folder_path:
            print("Error: Mobile JSON folder path is required for preview", file=sys.stderr)
            return

        yaml_file = next((f for f in self.yaml_folder_path.glob(f'{language}.*') 
                         if f.suffix in ['.yml', '.yaml']), None)
        if not yaml_file:
            print(f"Error: No YAML file found for language {language}", file=sys.stderr)
            return

        # Load translations using factory methods
        yaml_translation = Translation.from_yaml_file(yaml_file, self.yaml_key_renames)
        
        json_file = self.json_folder_path / f"{language}.json"
        mobile_json_file = self.mobile_json_folder_path / f"{language}.json" if self.mobile_json_folder_path else None
        
        json_translation = Translation.from_json_file(json_file) if json_file.exists() else Translation()
        
        mobile_translation = Translation.from_json_file(mobile_json_file, self.mobile_key_renames) if mobile_json_file and mobile_json_file.exists() else Translation()

        # Get all keys from components and existing JSON
        component_keys = self.source_directory.get_all_keys()

        # First handle all component keys
        for key in component_keys:
            value = yaml_translation.get(key)
            existing_value = json_translation.get(key)
            if value is not None:
                # Color existing translations dark blue
                if isinstance(value, list):
                    colored_value = [f"{Fore.dark_blue}{v}{Style.reset}" for v in value]
                else:
                    colored_value = f"{Fore.dark_blue}{value}{Style.reset}"
                json_translation.set(key, colored_value)
            elif mobile_translation.get(key) is not None:
                # Color mobile translations cyan
                mobile_value = mobile_translation.get(key)
                if isinstance(mobile_value, list):
                    colored_value = [f"{Fore.cyan}{v}{Style.reset}" for v in mobile_value]
                else:
                    colored_value = f"{Fore.cyan}{mobile_value}{Style.reset}"
                json_translation.set(key, colored_value)
            elif existing_value is not None:
                # Color existing values green
                if isinstance(existing_value, list):
                    colored_value = [f"{Fore.green}{v}{Style.reset}" for v in existing_value]
                else:
                    colored_value = f"{Fore.green}{existing_value}{Style.reset}"
                print(key, colored_value)
                json_translation.set(key, colored_value)
            else:
                # Color seeded translations red
                colored_value = f"{Fore.red}{key}{Style.reset}"
                json_translation.set(key, colored_value)  # Seed missing keys

        # Then handle any keys in JSON that aren't in components
        for key, value in json_translation.entries.items():
            if key not in component_keys:
                # Color orphaned keys magenta
                colored_value = f"{Fore.magenta}{value}{Style.reset}"
                json_translation.set(key, colored_value)

        # Print the colored nested dictionary
        print("{")
        print_colored_dict(json_translation.to_nested_dict(), 1)
        print("}")

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
            print(f"Error: Key '{old_key}' not found in source files or English JSON")
            return False
        if not key_in_source:
            print(f"Error: Key '{old_key}' not found in source files")
            return False
        if not key_in_english:
            print(f"Error: Key '{old_key}' not found in English JSON")
            return False

        # Check if key exists in YAML and add to renames if needed
        yaml_has_key = False
        yaml_file_with_key = None
        if self.yaml_folder_path and self.yaml_folder_path.exists():
            yaml_files = list(self.yaml_folder_path.glob('*.yml')) + list(self.yaml_folder_path.glob('*.yaml'))
            for yaml_file in yaml_files:
                yaml_translation = Translation.from_yaml_file(yaml_file, self.yaml_key_renames)
                if yaml_translation.get(old_key) is not None:
                    yaml_has_key = True
                    yaml_file_with_key = yaml_file
                    break
        
        if yaml_has_key:
            if self.yaml_key_renames_path:
                self.append_key_rename(old_key, new_key)
                print(f"Info: '{old_key}' exists in YAML file {yaml_file_with_key}")
            else:
                print(f"Error: '{old_key}' exists in YAML file {yaml_file_with_key} but no renames file. Aborting")
                return False

        # Check if key exists in mobile JSON and add to renames if needed
        mobile_has_key = False
        mobile_file_with_key = None
        if self.mobile_json_folder_path and self.mobile_json_folder_path.exists():
            for json_file in self.mobile_json_folder_path.glob('*.json'):
                mobile_translation = Translation.from_json_file(json_file)
                if mobile_translation.get(old_key) is not None:
                    mobile_has_key = True
                    mobile_file_with_key = json_file
                    break

        if mobile_has_key:
            if self.mobile_key_renames_path:
                self.append_key_rename(old_key, new_key, is_mobile=True)
                print(f"Info: '{old_key}' exists in mobile JSON file {mobile_file_with_key}")
            else:
                print(f"Error: '{old_key}' exists in mobile JSON file {mobile_file_with_key} but no renames file. Aborting")
                return False

        # Rename in source files
        source_files_changed = self.source_directory.rename_key(old_key, new_key)
        print(f"Updated key in {source_files_changed} source files")

        # Rename in JSON files
        json_files_changed = 0
        if self.json_folder_path and self.json_folder_path.exists():
            for json_file in self.json_folder_path.glob('*.json'):
                translation = Translation.from_json_file(json_file)
                value = translation.get(old_key)
                if value is not None:
                    print(f"Renaming key in JSON file: {json_file}")
                    print(f"  Old value: {value}")
                    translation.set(new_key, value)
                    # Remove old key
                    translation.entries.pop(old_key, None)
                    # Save using Translation methods
                    translation.save_as_json(json_file)
                    json_files_changed += 1
        print(f"Updated key in {json_files_changed} JSON files")

        return True

    def list_json_keys(self):
        if not self.json_folder_path or not self.json_folder_path.exists():
            print("Error: JSON folder does not exist.")
            return

        json_files = list(self.json_folder_path.glob('*.json'))
        if not json_files:
            print(f"No JSON files found in {self.json_folder_path}")
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
                
    def check_translations(self):
        """Check if all translation keys exist in all language files (TAP format)"""
        if not self.source_directory or not self.source_directory.components:
            print("Error: No source files with translations found.")
            return
            
        if not self.json_folder_path or not self.json_folder_path.exists():
            print("Error: JSON folder does not exist.")
            return
            
        json_files = list(self.json_folder_path.glob('*.json'))
        if not json_files:
            print(f"No JSON files found in {self.json_folder_path}")
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
        
        # Print TAP header - one test per key, with subtests for each language
        print(f"1..{len(all_keys)}")
        
        # Group keys by source file for better organization
        key_to_files = {}
        for component in self.source_directory.components:
            for key in component.keys:
                if key not in key_to_files:
                    key_to_files[key] = []
                key_to_files[key].append(str(component.file_path))
        
        # Check each key in each language using subtests
        for test_number, key in enumerate(sorted(all_keys), 1):
            # Print key and source files as comments
            source_files = key_to_files.get(key, ["unknown"])
            
            # Count missing translations for this key
            missing_count = 0
            for lang in sorted(languages):
                translation = translations[lang]
                value = translation.get(key)
                
                if value is None:
                    missing_count += 1
            
            source_files_str = ", ".join(source_files)
            if missing_count == 0:
                print(f"ok {test_number} - '{key}' # {source_files_str}")
            else:
                print(f"not ok {test_number} - '{key}' # {source_files_str}")
            
            # Print subtests for each language
            for subtest_number, lang in enumerate(sorted(languages), 1):
                translation = translations[lang]
                value = translation.get(key)
                
                if value is not None:
                    print(f"    ok {subtest_number} - {lang}")
                else:
                    print(f"    not ok {subtest_number} - {lang}")


def main():
    parser = argparse.ArgumentParser(description="Manage translations")
    parser.add_argument("--source_path", help="Path to source file or directory to scan for translations")
    parser.add_argument("--original_site_yaml_folder_path", help="Path to the folder containing YAML locale files")
    parser.add_argument("--new_site_json_folder_path", help="Path to the folder for output JSON locale files")
    parser.add_argument("--mobile-site-json-folder-path", help="Path to the folder containing mobile site JSON locale files")
    parser.add_argument("--original-site-yaml-key-renames-path", help="Path to TSV file mapping original YAML keys to new keys")
    parser.add_argument("--mobile-site-key-renames-path", help="Path to TSV file mapping mobile site JSON keys to new keys")
    parser.add_argument("--migrate", action="store_true", help="Migrate translations from YAML to JSON")
    parser.add_argument("--list-in-source", action="store_true", help="List all translation keys in the component file")
    parser.add_argument("--list-in-json", action="store_true", help="List all translation keys and values from JSON files")
    parser.add_argument("--preview-migrate", metavar="LANG", help="Preview migration for a language code without writing files")
    parser.add_argument("--rename-key", nargs=2, metavar=('OLD_KEY', 'NEW_KEY'), 
                        help="Rename a translation key in source and JSON files")
    parser.add_argument("--check-translations", action="store_true", 
                        help="Check if all translation keys exist in all language files (TAP format)")
    
    args = parser.parse_args()

    if args.migrate and (not args.original_site_yaml_folder_path or not args.new_site_json_folder_path or not args.source_path):
        print("Error: --source_path, --original_site_yaml_folder_path, and --new_site_json_folder_path must be specified for migration.")
        parser.print_help()
        return


    if args.list_in_source and not args.source_path:
        print("Error: --source_path must be specified for --list-in-source")
        parser.print_help()
        return

    if args.list_in_json and not args.new_site_json_folder_path:
        print("Error: --new_site_json_folder_path must be specified for --list-in-json")
        parser.print_help()
        return
        
    if args.check_translations and (not args.source_path or not args.new_site_json_folder_path):
        print("Error: --source_path and --new_site_json_folder_path must be specified for --check-translations")
        parser.print_help()
        return

    manager = TranslationManager(args.source_path, args.original_site_yaml_folder_path, args.new_site_json_folder_path,
                               args.original_site_yaml_key_renames_path, args.mobile_site_json_folder_path,
                               args.mobile_site_key_renames_path)


    if args.rename_key:
        if not args.source_path or not args.new_site_json_folder_path:
            print("Error: --source_path and --new_site_json_folder_path must be specified for --rename-key")
            parser.print_help()
            return
        old_key, new_key = args.rename_key
        manager.rename_key(old_key, new_key)
    elif args.preview_migrate:
        if not args.original_site_yaml_folder_path or not args.source_path or not args.mobile_site_json_folder_path:
            print("Error: --source_path, --original_site_yaml_folder_path, and --mobile-site-json-folder-path must be specified for --preview-migrate")
            parser.print_help()
            return
        manager.preview_migration(args.preview_migrate)
    elif args.migrate:
        manager.migrate_translations()

    if args.list_in_source:
        manager.list_component_keys()

    if args.list_in_json:
        manager.list_json_keys()
        
    if args.check_translations:
        manager.check_translations()

    if not (args.rename_key or args.preview_migrate or args.migrate or args.list_in_source or args.list_in_json or args.check_translations):
        print("No action specified. Use --rename_key {old_key} {new_key} --preview-migrate {language}, --migrate, --list-in-source, --list-in-json, --check-translations.")
        parser.print_help()

if __name__ == "__main__":
    main()
