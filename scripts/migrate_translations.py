import argparse
import json
import re
from pathlib import Path

import yaml


def extract_translation_keys(file_path):
    with open(file_path, 'r') as file:
        content = file.read()
    
    # Regular expression to find t() function calls
    pattern = r"t\(['\"](.+?)['\"]\)"
    keys = re.findall(pattern, content)
    print(f"Extracted {len(keys)} translation keys from {file_path}")
    print("First 10 extracted keys:", keys[:10])
    return keys

def get_nested_dict_value(dictionary, keys):
    for key in keys:
        if key in dictionary:
            dictionary = dictionary[key]
        else:
            return None
    return dictionary

def set_nested_dict_value(dictionary, keys, value):
    for key in keys[:-1]:
        dictionary = dictionary.setdefault(key, {})
    dictionary[keys[-1]] = value

def print_yaml_structure(yaml_data, prefix=''):
    for key, value in yaml_data.items():
        if isinstance(value, dict):
            print(f"{prefix}{key}:")
            print_yaml_structure(value, prefix + '  ')
        else:
            print(f"{prefix}{key}: {value}")

def migrate_translations(component_path, yaml_folder, json_folder):
    print(f"Starting migration process...")
    print(f"Component path: {component_path}")
    print(f"YAML folder: {yaml_folder}")
    print(f"JSON folder: {json_folder}")

    # Extract keys from React component
    keys = extract_translation_keys(component_path)

    # Process all YAML files in the folder
    yaml_files = list(Path(yaml_folder).glob('*.yml')) + list(Path(yaml_folder).glob('*.yaml'))
    print(f"Found {len(yaml_files)} YAML files in {yaml_folder}")

    if not yaml_files:
        print("No YAML files found. Please check the YAML folder path.")
        return

    for yaml_file in yaml_files:
        lang_code = yaml_file.stem  # Get language code from filename
        json_path = Path(json_folder) / f"{lang_code}.json"

        print(f"\nProcessing {yaml_file}...")

        # Load YAML file
        try:
            with open(yaml_file, 'r') as yf:
                yaml_data = yaml.safe_load(yf)
            print(f"Loaded YAML file: {yaml_file}")
            
            print("\nYAML structure (first 10 keys):")
            print_yaml_structure({k: yaml_data[k] for k in list(yaml_data.keys())[:10]})
        except Exception as e:
            print(f"Error loading YAML file {yaml_file}: {str(e)}")
            continue

        # Load JSON file or create an empty dictionary if the file is empty or doesn't exist
        try:
            with open(json_path, 'r') as json_file:
                content = json_file.read().strip()
                json_data = json.loads(content) if content else {}
            print(f"Loaded existing JSON file: {json_path}")
        except (FileNotFoundError, json.JSONDecodeError):
            json_data = {}
            print(f"Created new JSON data for: {json_path}")

        # Migrate translations
        migrations_count = 0
        for key in keys:
            yaml_value = get_nested_dict_value(yaml_data[lang_code], key.split('.'))
            print(f"Checking key: {key}, Value: {yaml_value}")
            
            if yaml_value is not None:
                set_nested_dict_value(json_data, key.split('.'), yaml_value)
                migrations_count += 1

        print(f"Migrated {migrations_count} translations for {lang_code}")

        # Save updated JSON file
        if migrations_count > 0:
            try:
                with open(json_path, 'w') as json_file:
                    json.dump(json_data, json_file, indent=2, ensure_ascii=False)
                print(f"Saved updated JSON file: {json_path}")
            except Exception as e:
                print(f"Error saving JSON file {json_path}: {str(e)}")
        else:
            print(f"No translations migrated for {lang_code}. JSON file not created.")

        print(f"Migration complete for {lang_code}.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Migrate translations from YAML to JSON")
    parser.add_argument("component_path", help="Path to the React component file")
    parser.add_argument("yaml_folder", help="Path to the folder containing YAML locale files")
    parser.add_argument("json_folder", help="Path to the folder for output JSON locale files")
    
    args = parser.parse_args()

    migrate_translations(args.component_path, args.yaml_folder, args.json_folder)
