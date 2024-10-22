import argparse
import json
import os
import re


def replace_placeholders(folder_path):
    for filename in os.listdir(folder_path):
        if filename.endswith('.json'):
            file_path = os.path.join(folder_path, filename)
            with open(file_path, 'r', encoding='utf-8') as file:
                content = file.read()

            # Replace %{...} with {{...}}
            updated_content = re.sub(r'%\{(\w+)\}', r'{{\1}}', content)

            if content != updated_content:
                with open(file_path, 'w', encoding='utf-8') as file:
                    file.write(updated_content)
                print(f"Updated: {filename}")
            else:
                print(f"No changes needed: {filename}")

# Usage
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Replace placeholders in JSON translation files")
    parser.add_argument("folder_path", help="Path to the folder containing JSON translation files")
    args = parser.parse_args()

    replace_placeholders(args.folder_path)
