import argparse
import json
import os
import re
from pathlib import Path

import yaml


class Component:
    def __init__(self, file_path):
        self.file_path = Path(file_path)
        self.keys = self.extract_translation_keys()

    def extract_translation_keys(self):
        with open(self.file_path, 'r') as file:
            content = file.read()
        pattern = r"t\(['\"](.+?)['\"]\)"
        keys = re.findall(pattern, content)
        return keys

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
    def __init__(self, component_path, yaml_folder, json_folder):
        self.component = Component(component_path) if component_path else None
        self.yaml_folder = Path(yaml_folder) if yaml_folder else None
        self.json_folder = Path(json_folder) if json_folder else None

    def migrate_translations(self):
        if not self.component:
            print("Error: No component file provided. Skipping migration.")
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
                
                for key in self.component.keys:
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
        if not self.component:
            print("Error: No component file provided.")
            return
        if not self.component.keys:
            print("No translation keys found in component.")
            return
        for key in sorted(self.component.keys):
            print(f"{key}")

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
    parser.add_argument("--component_path", help="Path to the React component file")
    parser.add_argument("--yaml_folder", help="Path to the folder containing YAML locale files")
    parser.add_argument("--json_folder", help="Path to the folder for output JSON locale files")
    parser.add_argument("--migrate", action="store_true", help="Migrate translations from YAML to JSON")
    parser.add_argument("--list-in-component", action="store_true", help="List all translation keys in the component file")
    
    args = parser.parse_args()

    if args.migrate and (not args.yaml_folder or not args.json_folder or not args.component_path):
        print("Error: --component_path, --yaml_folder, and --json_folder must be specified for migration.")
        parser.print_help()
        return


    if args.list_in_component and not args.component_path:
        print("Error: --component_path must be specified for --list-in-component")
        parser.print_help()
        return

    manager = TranslationManager(args.component_path, args.yaml_folder, args.json_folder)

    if args.migrate:
        manager.migrate_translations()

    if args.list_in_component:
        manager.list_component_keys()
    elif not args.migrate:
        print("No action specified. Use --migrate or --list-in-component.")
        parser.print_help()

if __name__ == "__main__":
    main()
