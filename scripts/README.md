# Translation Management Scripts

This folder contains tools for managing translations for a React application.

## Main Script: translation_manager.py

This script combines multiple functionalities for managing translations.

### Installation

Run the script with the following command:

```
python3 -m venv .env
source .env/bin/activate
pip install -r requirements.txt
```

To get AI translations, you also need:

```
export ANTHROPIC_API_KEY="your api key"
```

### Usage

Options:

- `--source_path PATH`: Path to source file or directory to scan for translations
- `--json_folder_path PATH`: Path to the folder for JSON locale files
- `--list-in-source`: List all translation keys in the source files
- `--list-in-json`: List all translation keys and values from JSON files
- `--rename-key OLD_KEY NEW_KEY`: Rename a translation key in source and JSON files
- `--check-translations`: Check if all translation keys exist in all language files (TAP format)
- `--remove-orphan-keys`: Remove keys from JSON files that don't exist in source files
- `--fill-up-translations`: Fill up missing translations using English as source
- `--log-level LEVEL`: Set the logging level (choices: DEBUG, INFO, WARNING, ERROR, CRITICAL; default: INFO)

### Examples

1. List translation keys in source files:

   ```bash
   python translation_manager.py --source_path ../src/components --list-in-source
   ```

2. List translation keys and values in JSON files:

   ```bash
   python translation_manager.py --json_folder_path ../public/locales --list-in-json
   ```

3. Rename a translation key:

   ```bash
   python translation_manager.py --source_path ../src/components --json_folder_path ../public/locales --rename-key "old.key" "new.key"
   ```

4. Check translation completeness:

   ```bash
   python translation_manager.py --source_path ../src/components --json_folder_path ../public/locales --check-translations | grep 'not ok'
   ```

5. Remove orphaned keys from JSON files:

   ```bash
   python translation_manager.py --source_path ../src/components --json_folder_path ../public/locales --remove-orphan-keys
   ```

6. Fill up missing translations using English as source:

   ```bash
   python translation_manager.py --json_folder_path ../public/locales --fill-up-translations
   ```

7. Run with debug logging to see detailed information:
   ```bash
   python translation_manager.py --source_path ../src/components --json_folder_path ../public/locales --check-translations --log-level DEBUG
   ```

## Adding a new language

1. Seed the file

Look up the ISO code for the new language, for example Russian is `ru`, and add a new file with an empty translation:

```
echo {} > ../public/locales/ru.json
```

2. Fill up translations and check

Use translation manager as documented above. First run --fill-up-translations, then --check-translations.

3. Add new language to the app

Add a new entry to `LANGUAGE_OPTIONS` in the file `src/i18n.js`. We keep languages sorted by ISO code.


4. Check with native speaker

Show the new translation to someone who knows the language well. If their contribution is substantial, offer to list them as a translator in `src/components/about/ProjectPage.js`. 
