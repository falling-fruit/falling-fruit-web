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
        self.json_folder = Path(json_folder)

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
            json_locale = JsonLocaleFile(json_file)

            for key in self.component.keys:
                value = self.get_nested_value(yaml_locale.data.get(yaml_locale.lang_code, {}), key.split('.'))
                if value is not None:
                    self.set_nested_value(json_locale.data, key.split('.'), value)

            json_locale.save_data()
            print(f"Migrated translations for {yaml_locale.lang_code}")

    def remove_locale_params(self):
        json_files = list(self.json_folder.glob('*.json'))
        for json_file in json_files:
            json_locale = JsonLocaleFile(json_file)
            self.remove_locale_params_recursive(json_locale.data)
            json_locale.save_data()
            print(f"Removed locale parameters from {json_locale.lang_code}")

    def remove_locale_params_recursive(self, data):
        if isinstance(data, dict):
            for key, value in data.items():
                if isinstance(value, str):
                    data[key] = re.sub(r'\?locale=[a-z]{2}', '', value)
                else:
                    self.remove_locale_params_recursive(value)
        elif isinstance(data, list):
            for i, item in enumerate(data):
                if isinstance(item, str):
                    data[i] = re.sub(r'\?locale=[a-z]{2}', '', item)
                else:
                    self.remove_locale_params_recursive(item)

    def replace_placeholders(self):
        json_files = list(self.json_folder.glob('*.json'))
        for json_file in json_files:
            with open(json_file, 'r', encoding='utf-8') as file:
                content = file.read()

            # Replace %{...} with {{...}}
            updated_content = re.sub(r'%\{(\w+)\}', r'{{\1}}', content)

            if content != updated_content:
                with open(json_file, 'w', encoding='utf-8') as file:
                    file.write(updated_content)
                print(f"Updated: {json_file.name}")
            else:
                print(f"No changes needed: {json_file.name}")

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
    parser.add_argument("--remove-params", action="store_true", help="Remove locale parameters from all JSON files")
    parser.add_argument("--replace-placeholders", action="store_true", help="Replace %{...} with {{...}}")
    
    args = parser.parse_args()

    if args.migrate and (not args.yaml_folder or not args.json_folder or not args.component_path):
        print("Error: --component_path, --yaml_folder, and --json_folder must be specified for migration.")
        parser.print_help()
        return

    if not args.json_folder:
        print("Error: --json_folder must be specified.")
        parser.print_help()
        return

    manager = TranslationManager(args.component_path, args.yaml_folder, args.json_folder)

    if args.migrate:
        manager.migrate_translations()

    if args.remove_params:
        manager.remove_locale_params()

    if args.replace_placeholders:
        manager.replace_placeholders()

    if not any([args.migrate, args.remove_params, args.replace_placeholders]):
        print("No action specified. Use --migrate, --remove-params, or --replace-placeholders.")
        parser.print_help()

if __name__ == "__main__":
    main()
