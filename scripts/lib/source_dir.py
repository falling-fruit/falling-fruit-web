import re
from pathlib import Path

class Component:
    def __init__(self, file_path):
        self.file_path = Path(file_path)
        self.keys = []
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


class SourceDirectory:
    def __init__(self, path):
        self.path = Path(path) if path else None
        self.components = []
        if self.path:
            self.scan_source_files()

    def scan_source_files(self):
        """Scan the source directory for files with translation keys"""
        if not self.path:
            return
            
        if self.path.is_file():
            component = Component(self.path)
            if component.keys:  # Only add components that have translation keys
                self.components.append(component)
        else:
            for file_path in self.path.rglob('*'):
                if file_path.is_file():
                    component = Component(file_path)
                    if component.keys:  # Only add components that have translation keys
                        self.components.append(component)
        
        return self.components

    def list_component_keys(self):
        """List all translation keys found in components"""
        all_keys = []
        for component in self.components:
            for key in component.keys:
                all_keys.append((str(component.file_path), key))
        
        return sorted(all_keys)
    
    def get_all_keys(self):
        """Return a set of all unique translation keys"""
        all_keys = set()
        for component in self.components:
            all_keys.update(component.keys)
        return all_keys
    
    def rename_key(self, old_key, new_key):
        """Rename a translation key in all source files"""
        files_changed = 0
        for component in self.components:
            if old_key in component.keys:
                component.rename_key_in_file(old_key, new_key)
                files_changed += 1
        return files_changed
