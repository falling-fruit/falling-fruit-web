import argparse
import json
import os
import re
from pathlib import Path

import yaml


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
        pattern = r"\bt\(['\"](.+?)['\"]\)"
        self.keys = re.findall(pattern, content)
        for key in self.keys:
            self.key_locations[key] = str(self.file_path)
        return self.keys

class LocaleFile:
    def __init__(self, file_path):
        self.file_path = Path(file_path)
        self.lang_code = self.file_path.stem
        self.data = self.load_data()

    def load_data(self):
        raise NotImplementedError

    def save_data(self):
        raise NotImplementedError

class YamlLocaleFile(LocaleFile):
    def load_data(self):
        with open(self.file_path, 'r') as file:
            return yaml.safe_load(file)

    def save_data(self):
        with open(self.file_path, 'w') as file:
            yaml.dump(self.data, file, allow_unicode=True)

class JsonLocaleFile(LocaleFile):
    def load_data(self):
        if not self.file_path.exists():
            return {}  # Return an empty dictionary if the file doesn't exist
        with open(self.file_path, 'r') as file:
            return json.load(file)

    def save_data(self):
        self.file_path.parent.mkdir(parents=True, exist_ok=True)  # Ensure the directory exists
        with open(self.file_path, 'w') as file:
            json.dump(self.data, file, indent=2, ensure_ascii=False)

class TranslationManager:
    def __init__(self, source_path, yaml_folder, json_folder):
        self.source_path = Path(source_path) if source_path else None
        self.components = []
        if self.source_path:
            if self.source_path.is_file():
                self.components.append(Component(self.source_path))
            else:
                self.scan_source_files()
        self.yaml_folder = Path(yaml_folder) if yaml_folder else None
        self.json_folder = Path(json_folder) if json_folder else None

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
        if not self.yaml_folder.exists():
            print(f"Error: YAML folder '{self.yaml_folder}' does not exist.")
            return
        if not self.json_folder.exists():
            print(f"Creating JSON folder: {self.json_folder}")
            self.json_folder.mkdir(parents=True, exist_ok=True)

        yaml_files = list(self.yaml_folder.glob('*.yml')) + list(self.yaml_folder.glob('*.yaml'))
        if not yaml_files:
            print(f"No YAML files found in {self.yaml_folder}")
            return

        for yaml_file in yaml_files:
            yaml_locale = YamlLocaleFile(yaml_file)
            json_file = self.json_folder / f"{yaml_locale.lang_code}.json"
            if json_file.exists():
                json_locale = JsonLocaleFile(json_file)

                added_keys = 0
                edited_keys = 0
                
                all_keys = set()
                for component in self.components:
                    all_keys.update(component.keys)
        
                for key in all_keys:
                    value = self.get_nested_value(yaml_locale.data.get(yaml_locale.lang_code, {}), key.split('.'))
                    if value is not None:
                        # Clean up the value before setting
                        if isinstance(value, str):
                            # Remove locale parameters
                            value = re.sub(r'\?locale=[a-z]{2}', '', value)
                            # Replace %{...} with {{...}}
                            value = re.sub(r'%\{(\w+)\}', r'{{\1}}', value)
                            
                        existing_value = self.get_nested_value(json_locale.data, key.split('.'))
                        if existing_value is None:
                            added_keys += 1
                        elif existing_value != value:
                            edited_keys += 1
                        self.set_nested_value(json_locale.data, key.split('.'), value)

                json_locale.save_data()
                print(f"{yaml_file} -> {json_file} added {added_keys} keys, edited {edited_keys} keys")
            else:
                print(f"{yaml_file} skipped: no {json_file}")


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

    @staticmethod
    def get_nested_value(dictionary, keys):
        for key in keys:
            if key in dictionary:
                dictionary = dictionary[key]
            else:
                return None
        return dictionary

    @staticmethod
    def set_nested_value(dictionary, keys, value):
        for key in keys[:-1]:
            dictionary = dictionary.setdefault(key, {})
        dictionary[keys[-1]] = value

def main():
    parser = argparse.ArgumentParser(description="Manage translations")
    parser.add_argument("--source_path", help="Path to source file or directory to scan for translations")
    parser.add_argument("--component_path", help="Alias for --source_path (deprecated)", dest="source_path")
    parser.add_argument("--yaml_folder", help="Path to the folder containing YAML locale files")
    parser.add_argument("--json_folder", help="Path to the folder for output JSON locale files")
    parser.add_argument("--migrate", action="store_true", help="Migrate translations from YAML to JSON")
    parser.add_argument("--list-in-component", action="store_true", help="List all translation keys in the component file")
    
    args = parser.parse_args()

    if args.migrate and (not args.yaml_folder or not args.json_folder or not args.source_path):
        print("Error: --source_path, --yaml_folder, and --json_folder must be specified for migration.")
        parser.print_help()
        return


    if args.list_in_component and not args.source_path:
        print("Error: --source_path must be specified for --list-in-component")
        parser.print_help()
        return

    manager = TranslationManager(args.source_path, args.yaml_folder, args.json_folder)

    if args.migrate:
        manager.migrate_translations()

    if args.list_in_component:
        manager.list_component_keys()
    elif not args.migrate:
        print("No action specified. Use --migrate or --list-in-component.")
        parser.print_help()

if __name__ == "__main__":
    main()
