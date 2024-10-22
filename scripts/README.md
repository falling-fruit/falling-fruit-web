# Translation Migration Script

This script migrates translations from YAML files to JSON files for use in a React application.

## Prerequisites

- Python 3.6 or higher
- `virtualenv` (optional, but recommended)

## Setup

1. Create a virtual environment (optional):

   ```
   python -m venv venv
   ```

2. Activate the virtual environment:

   - On Windows:
     ```
     venv\Scripts\activate
     ```
   - On macOS and Linux:
     ```
     source venv/bin/activate
     ```

3. Install required packages:
   ```
   pip install pyyaml
   ```

## Usage

Run the script with the following command:

```
python migrate_translations.py <component_path> <yaml_folder> <json_folder>
```

Arguments:

- `<component_path>`: Path to the React component file (e.g., `src/components/about/ProjectPage.js`)
- `<yaml_folder>`: Path to the folder containing YAML locale files
- `<json_folder>`: Path to the folder for output JSON locale files

Example:

```
python migrate_translations.py src/components/about/ProjectPage.js locales/yaml locales/json
```

This command will:

1. Extract translation keys from the specified React component
2. Read YAML files from the `locales/yaml` folder
3. Migrate translations to JSON format
4. Save the resulting JSON files in the `locales/json` folder

## Notes

- Ensure that your YAML files are named with the appropriate language codes (e.g., `en.yml`, `fr.yml`)
- The script will create or update JSON files with the same language codes in the specified output folder
- If a translation key exists in the React component but not in the YAML file, it will be skipped
- The script will print progress and any errors encountered during the migration process

## Placeholder Replacement Script

This script replaces `%{...}` placeholders with `{{...}}` in JSON translation files.

### Usage

1. Ensure you have Python 3.6 or higher installed.

2. Run the script with the following command:

   ```
   python replace_placeholders.py <folder_path>
   ```

   Replace `<folder_path>` with the path to your JSON translation files directory.

   Example:

   ```
   python scripts/replace_placeholders.py ./public/locales
   ```

### What it does

- Scans all JSON files in the specified folder
- Replaces `%{placeholder}` with `{{placeholder}}`
- Updates files only if changes are made
- Prints progress information

### Notes

- This script is useful for updating older translation files to a new placeholder format
- Always backup your files before running this script
- The script assumes UTF-8 encoding for JSON files
