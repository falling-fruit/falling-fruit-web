# Translation Management Scripts

This repository contains scripts for managing translations for a React application.

## Main Script: translation_manager.py

This script combines multiple functionalities for managing translations.

### Prerequisites

- Python 3.6 or higher
- `pyyaml` library

### Installation

1. Ensure you have Python 3.6+ installed.
2. Install required packages:
   ```
   pip install pyyaml
   ```

### Usage

Run the script with the following command:

```
python scripts/translation_manager.py [OPTIONS]
```

Options:

- `--component_path PATH`: Path to the React component file
- `--yaml_folder PATH`: Path to the folder containing YAML locale files
- `--json_folder PATH`: Path to the folder for output JSON locale files
- `--migrate`: Migrate translations from YAML to JSON
- `--remove-params`: Remove locale parameters from non-English JSON files
- `--replace-placeholders`: Replace %{...} placeholders with {{...}}

### Examples

1. Migrate translations:

   ```
   python scripts/translation_manager.py --component_path src/components/about/ProjectPage.js --yaml_folder config/locales --json_folder public/locales --migrate
   ```

2. Remove locale parameters:

   ```
   python scripts/translation_manager.py --json_folder public/locales --remove-params
   ```

3. Replace placeholders:
   ```
   python scripts/translation_manager.py --json_folder public/locales --replace-placeholders
   ```

## Other Scripts

### extractTranslationKeys.js

This script is designed to be run in a browser console to extract translation keys from a webpage with i18n_viz enabled.

## Notes

- Always backup your files before running these scripts.
- Ensure you have the necessary permissions to read from and write to the specified directories.
