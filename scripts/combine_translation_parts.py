import json
import os
import argparse

def combine_files(file_list):
    combined_data = {}

    for file_path in file_list:
        print(file_path)
        with open(file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)

        # Extract the key from the filename
        filename = os.path.basename(file_path)
        key = filename.split("-")[1].split(".")[0]

        # Add the data to the combined dictionary
        combined_data[key] = data

    return combined_data

def main():
    parser = argparse.ArgumentParser(description="Combine JSON files into a single JSON object.")
    parser.add_argument('files', metavar='F', type=str, nargs='+', help='List of JSON files to combine')

    args = parser.parse_args()

    combined_result = combine_files(args.files)

    print(json.dumps(combined_result, indent=2))

if __name__ == "__main__":
    main()
