#!/usr/bin/env python
import argparse
import json
import os
import sys
import re
from pathlib import Path

import yaml
from colored import Fore,  Style


class Component:
    def __init__(self, file_path):
        self.file_path = Path(file_path)
        self.keys = []
        self.key_locations = {}  # Maps keys to their source files
        if self.is_source_file():
            self.extract_translation_keys()

    def is_source_file(self):
        return self.file_path.suffix.lower() in ['.js', '.jsx', '.ts', '.tsx']

    def extract_translation_keys(self):
        with open(self.file_path, 'r') as file:
            content = file.read()
        pattern = r"\bt\(['\"`](.+?)['\"`]"

        # Strip dynamic parts like ${i} from translation keys
        self.keys = [ re.sub(r'\.\${[^}]+}$', '', key) for key in re.findall(pattern, content)]
        for key in self.keys:
            self.key_locations[key] = str(self.file_path)
        return self.keys

    def rename_key_in_file(self, old_key, new_key):
        """Rename a translation key in the source file"""
        with open(self.file_path, 'r') as file:
            content = file.read()
        
        # Replace the key in t() calls, being careful with quote types
        for quote in ['"', "'", '`']:
            content = content.replace(f't({quote}{old_key}', 
                                    f't({quote}{new_key}')
        
        with open(self.file_path, 'w') as file:
            file.write(content)

class Translation:
    def __init__(self):
        self.entries = {}  # flat dictionary of dot-notation keys to values

    def set(self, key: str, value: str):
        """Set a value using dot notation key"""
        self.entries[key] = value

    def get(self, key: str) -> str:
        """Get a value using dot notation key"""
        return self.entries.get(key)


    def to_nested_dict(self) -> dict:
        """Convert flat dot-notation keys into nested dictionary structure"""
        result = {}
        for key, value in self.entries.items():
            keys = key.split('.')
            current = result
            for k in keys[:-1]:
                current = current.setdefault(k, {})
            if type(current) not in (type({}), type([])):
                raise ValueError(key, value, current, type(current))
            if type(current) == type([]):
                last_key = int(keys[-1])
            else:
                last_key = keys[-1]
            current[last_key] = value

        # Convert dict to array if all keys are sequential integers as strings
        def convert_sequential_dict(d):
            if isinstance(d, dict):
                # Check if all values are strings or all values are dicts
                all_strings = all(isinstance(v, str) for v in d.values())
                all_dicts = all(isinstance(v, dict) for v in d.values())
                
                # Check if keys are sequential integers starting from 0
                try:
                    keys = sorted(int(k) for k in d.keys())
                    is_sequential = keys == list(range(len(keys)))
                except ValueError:
                    is_sequential = False

                if is_sequential and all_strings:
                    # Convert to array
                    return [d[str(i)] for i in range(len(d))]
                elif all_dicts:
                    # Recursively process nested dicts
                    return {k: convert_sequential_dict(v) for k, v in d.items()}
                else:
                    return d
            return d

        return convert_sequential_dict(result)

    def save_as_json(self, file_path, encoder):
        """Save translation data as JSON file"""
        path = Path(file_path)
        path.parent.mkdir(parents=True, exist_ok=True)
        with open(path, 'w') as file:
            json_str = encoder.encode(self.to_nested_dict())
            file.write(json_str)

class LocaleFile:
    def __init__(self, file_path):
        self.file_path = Path(file_path)
        self.lang_code = self.file_path.stem
        self.data = self.load_data()

    def clean_value(self, value):
        raise NotImplementedError

    def load_data(self):
        raise NotImplementedError

    def to_translation(self) -> Translation:
        """Convert nested dictionary to Translation object"""
        translation = Translation()
        
        def flatten_dict(d, prefix=''):
            for key, value in d.items():
                full_key = f"{prefix}.{key}" if prefix else key
                if isinstance(value, dict):
                    flatten_dict(value, full_key)
                elif isinstance(value, list):
                    for i in range(0, len(value)):
                        translation.set(f"{full_key}.{i}", self.clean_value(value[i]))
                else:
                    translation.set(full_key, self.clean_value(value))
                    
        flatten_dict(self.data)
        if hasattr(self, 'key_renames'):
            for key, new_key in self.key_renames.items():
                v = translation.entries.pop(key, None)
                translation.set(new_key, v)

        return translation

class YamlLocaleFile(LocaleFile):
    def load_data(self):
        with open(self.file_path, 'r') as file:
            data = yaml.safe_load(file)
            # Get the language code subdict directly
            return data.get(self.lang_code, {})

    def clean_value(self, value):
        """Clean up YAML value for JSON format"""
        if isinstance(value, str):
            # Remove locale parameters
            value = re.sub(r'\?locale=[a-z]{2}', '', value)
            # Replace %{...} with {{...}}
            value = re.sub(r'%\{(\w+)\}', r'{{\1}}', value)
        return value

def print_colored_dict(d, indent=0):
    """Print a nested dictionary with proper indentation"""
    for key, value in sorted(d.items()):
        indent_str = "  " * indent
        if type(value) == type({}):
            print(f'{indent_str}"{key}": {{')
            print_colored_dict(value, indent + 1)
            print(f'{indent_str}}}{"," if indent > 0 else ""}')
        elif type(value) == type([]):
            print(f'{indent_str}"{key}": [')
            for i in range(0, len(value)):
                v = value[i]
                indent_str_1 = "  " * (indent + 1)
                print(f'{indent_str_1}"{v}"{"," if i < len(value) else ""}')

            print(f'{indent_str}]{"," if indent > 0 else ""}')
        else:
            is_last = key == list(sorted(d.keys()))[-1] and indent > 0
            print(f'{indent_str}"{key}": "{value}"{"" if is_last else ","}')

class SortedJsonEncoder(json.JSONEncoder):
    def default(self, obj):
        return super().default(obj)

    def encode(self, obj, level=0):
        indent = "  " * level
        next_indent = "  " * (level + 1)
        
        if isinstance(obj, dict):
            # Sort dictionary keys
            items = sorted(obj.items(), key=lambda x: x[0])
            if not items:
                return "{}"
            parts = [f"\n{next_indent}{json.dumps(k)}: {self.encode(v, level + 1)}" for k, v in items]
            return "{" + ",".join(parts) + f"\n{indent}}}"
        elif isinstance(obj, (list, tuple)):
            items = [self.encode(item, level + 1) for item in obj]
            if not items:
                return "[]"
            return "[\n" + next_indent + f",\n{next_indent}".join(items) + f"\n{indent}]"
        return json.dumps(obj, ensure_ascii=False)

class JsonLocaleFile(LocaleFile):
    def load_data(self):
        if not self.file_path.exists():
            return {}  # Return an empty dictionary if the file doesn't exist
        with open(self.file_path, 'r') as file:
            return json.load(file)

    def clean_value(self, value):
        return value

    def rename_key_if_needed(self, key):
        return key


class TranslationManager:
    def __init__(self, source_path, yaml_folder_path, json_folder_path, yaml_key_renames_path=None, mobile_json_folder_path=None, mobile_key_renames_path=None):
        self.source_path = Path(source_path) if source_path else None
        self.components = []
        if self.source_path:
            if self.source_path.is_file():
                self.components.append(Component(self.source_path))
            else:
                self.scan_source_files()
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

    def scan_source_files(self):
        for file_path in self.source_path.rglob('*'):
            if file_path.is_file():
                component = Component(file_path)
                if component.keys:  # Only add components that have translation keys
                    self.components.append(component)


    def migrate_translations(self):
        if not self.components:
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
            yaml_locale = YamlLocaleFile(yaml_file)
            yaml_locale.manager = self
            json_file = self.json_folder_path / f"{yaml_locale.lang_code}.json"
            if json_file.exists():
                json_locale = JsonLocaleFile(json_file)

                yaml_added = 0
                mobile_added = 0
                edited_keys = 0
                missing_keys = 0
                
                all_keys = set()
                for component in self.components:
                    all_keys.update(component.keys)
        
                # Convert YAML to Translation
                yaml_translation = yaml_locale.to_translation()
                json_translation = json_locale.to_translation()
                
                # Load mobile translations if available
                mobile_json_file = self.mobile_json_folder_path / f"{yaml_locale.lang_code}.json" if self.mobile_json_folder_path else None
                if mobile_json_file and mobile_json_file.exists():
                    mobile_locale = JsonLocaleFile(mobile_json_file)
                    mobile_locale.key_renames = self.mobile_key_renames
                    mobile_translation = mobile_locale.to_translation()
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
                        mobile_value = mobile_translation.get(key) if mobile_translation else None
                        if mobile_value is not None:
                            json_translation.set(key, mobile_value)
                            mobile_added += 1
                        else:
                            missing_keys += 1

                json_translation.save_as_json(json_file, SortedJsonEncoder(indent=2))
                print(f"{yaml_file} -> {json_file} added {yaml_added} from YAML, {mobile_added} from mobile, edited {edited_keys} keys, missing {missing_keys} keys. Checked: {len(all_keys)} keys")
            else:
                print(f"{yaml_file} skipped: no {json_file}")


    def components_to_translation(self) -> Translation:
        """Convert components' keys into a Translation object where values equal keys"""
        translation = Translation()
        for component in self.components:
            for key in component.keys:
                translation.set(key, key)
        return translation

    def list_component_keys(self):
        if not self.components:
            print("Error: No source files with translations found.")
            return

        all_keys = []
        for component in self.components:
            for key in component.keys:
                all_keys.append((component.key_locations[key], key))
        
        if not all_keys:
            print("No translation keys found in any components.")
            return

        # Sort by file path and then by key
        for file_path, key in sorted(all_keys):
            print(f"{file_path}\t{key}")

    def preview_migration(self, language):
        """Preview migration for a specific language without writing files"""
        if not self.components:
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

        yaml_locale = YamlLocaleFile(yaml_file)
        yaml_locale.key_renames = self.yaml_key_renames
        yaml_translation = yaml_locale.to_translation()
        
        json_file = self.json_folder_path / f"{yaml_locale.lang_code}.json"
        mobile_json_file = self.mobile_json_folder_path / f"{yaml_locale.lang_code}.json" if self.mobile_json_folder_path else None
        
        json_translation = JsonLocaleFile(json_file).to_translation() if json_file.exists() else Translation()

        
        if mobile_json_file and mobile_json_file.exists():
            mobile_locale = JsonLocaleFile(mobile_json_file)
            mobile_locale.key_renames = self.mobile_key_renames
            mobile_translation = mobile_locale.to_translation()
        else:
            mobile_translation = Translation()

        # Get all keys from components and existing JSON
        component_keys = set()
        for component in self.components:
            component_keys.update(component.keys)

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
        key_in_source = False
        for component in self.components:
            if old_key in component.keys:
                key_in_source = True
                break

        key_in_english = False
        en_json_path = self.json_folder_path / "en.json"
        if en_json_path.exists():
            en_locale = JsonLocaleFile(en_json_path)
            if en_locale.to_translation().get(old_key) is not None:
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
        if self.yaml_folder_path and self.yaml_folder_path.exists():
            yaml_files = list(self.yaml_folder_path.glob('*.yml')) + list(self.yaml_folder_path.glob('*.yaml'))
            for yaml_file in yaml_files:
                yaml_locale = YamlLocaleFile(yaml_file)
                yaml_locale.key_renames = self.yaml_key_renames
                if yaml_locale.to_translation().get(old_key) is not None:
                    yaml_has_key = True
                    break
        
        if yaml_has_key:
            if self.yaml_key_renames_path:
                self.append_key_rename(old_key, new_key)
                print(f"Info: '{old_key}' exists in YAML file {yaml_file}")
            else:
                print(f"Error: '{old_key}' exists in YAML file {yaml_file} but no renames file. Aborting")
                return False

        # Check if key exists in mobile JSON and add to renames if needed
        mobile_has_key = False
        if self.mobile_json_folder_path and self.mobile_json_folder_path.exists():
            for json_file in self.mobile_json_folder_path.glob('*.json'):
                mobile_locale = JsonLocaleFile(json_file)
                if mobile_locale.to_translation().get(old_key) is not None:
                    mobile_has_key = True
                    break

        if mobile_has_key:
            if self.mobile_key_renames_path:
                self.append_key_rename(old_key, new_key, is_mobile=True)
                print(f"Info: '{old_key}' exists in mobile JSON file {json_file}")
            else:
                print(f"Error: '{old_key}' exists in mobile JSON file {json_file} but no renames file. Aborting")
                return False

        # Rename in source files
        source_files_changed = 0
        for component in self.components:
            if old_key in component.keys:
                print(f"Renaming key in source file: {component.file_path}")
                component.rename_key_in_file(old_key, new_key)
                source_files_changed += 1
        print(f"Updated key in {source_files_changed} source files")

        # Rename in JSON files
        json_files_changed = 0
        if self.json_folder_path and self.json_folder_path.exists():
            for json_file in self.json_folder_path.glob('*.json'):
                json_locale = JsonLocaleFile(json_file)
                translation = json_locale.to_translation()
                value = translation.get(old_key)
                if value is not None:
                    print(f"Renaming key in JSON file: {json_file}")
                    print(f"  Old value: {value}")
                    translation.set(new_key, value)
                    # Remove old key
                    translation.entries.pop(old_key, None)
                    # Save using Translation methods
                    translation.save_as_json(json_file, SortedJsonEncoder(indent=2))
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
            json_locale = JsonLocaleFile(json_file)
            all_keys = traverse_dict(json_locale.data)
            for key, value in all_keys:
                # Replace newlines with spaces in the value for TSV compatibility
                value = value.replace('\n', ' ').replace('\r', '')
                print(f"{json_file}\t{key}\t{value}")


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
    parser.add_argument("--source-as-json", action="store_true", help="Output source translation keys as JSON to stdout")
    parser.add_argument("--preview-migrate", metavar="LANG", help="Preview migration for a language code without writing files")
    parser.add_argument("--rename-key", nargs=2, metavar=('OLD_KEY', 'NEW_KEY'), 
                        help="Rename a translation key in source and JSON files")
    
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

    if args.source_as_json:
        if not args.source_path:
            print("Error: --source_path must be specified for --source-as-json")
            parser.print_help()
            return
        translation = manager.components_to_translation()
        print(SortedJsonEncoder(indent=2).encode(translation.to_nested_dict()))

    if not (args.rename_key or args.preview_migrate or args.migrate or args.list_in_source or args.list_in_json or args.source_as_json):
        print("No action specified. Use --rename_key {old_key} {new_key} --preview-migrate {language}, --migrate, --list-in-source, --list-in-json, --source-as-json.")
        parser.print_help()

if __name__ == "__main__":
    main()
