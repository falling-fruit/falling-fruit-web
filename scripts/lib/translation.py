import json
import re
from pathlib import Path
import yaml

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

    def save_as_json(self, file_path):
        """Save translation data as JSON file"""
        path = Path(file_path)
        path.parent.mkdir(parents=True, exist_ok=True)
        encoder = SortedJsonEncoder(indent=2)
        with open(path, 'w') as file:
            json_str = encoder.encode(self.to_nested_dict())
            file.write(json_str)
            
    @classmethod
    def from_yaml_file(cls, file_path, key_renames=None):
        """Factory method to create Translation from YAML file"""
        yaml_locale = YamlLocaleFile(file_path)
        if key_renames:
            yaml_locale.key_renames = key_renames
        return yaml_locale.to_translation()
    
    @classmethod
    def from_json_file(cls, file_path, key_renames=None):
        """Factory method to create Translation from JSON file"""
        if not Path(file_path).exists():
            return cls()  # Return empty Translation if file doesn't exist
        json_locale = JsonLocaleFile(file_path)
        if key_renames:
            json_locale.key_renames = key_renames
        return json_locale.to_translation()

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
            # Check if all keys are consecutive integers starting from 0
            try:
                keys = [k for k in obj.keys()]
                if all(isinstance(k, (int, str)) for k in keys):
                    # Try to convert string keys to integers
                    numeric_keys = []
                    for k in keys:
                        if isinstance(k, str) and k.isdigit():
                            numeric_keys.append(int(k))
                        elif isinstance(k, int):
                            numeric_keys.append(k)
                    
                    # Check if all keys are numeric and consecutive starting from 0
                    if (len(numeric_keys) == len(keys) and 
                        sorted(numeric_keys) == list(range(len(numeric_keys)))):
                        # Convert to list
                        sorted_items = sorted([(int(k) if isinstance(k, str) else k, v) 
                                              for k, v in obj.items()], key=lambda x: x[0])
                        items = [v for _, v in sorted_items]
                        return self.encode(items, level)
            except (ValueError, TypeError):
                pass
                
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
