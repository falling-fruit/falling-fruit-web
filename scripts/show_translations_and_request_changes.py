#!/usr/bin/env python3

import os
import sys
import json
import argparse
from anthropic import Anthropic

def read_json_file(filepath):
    """Read and return the contents of a JSON file."""
    try:
        with open(filepath, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error reading JSON file: {e}", file=sys.stderr)
        sys.exit(1)

def get_claude_response(client, source_content, target_content, query, keys_to_keep=None):
    """Get response from Claude about translation changes."""
    # Create copies to avoid modifying the originals
    source_copy = source_content.copy()
    target_copy = target_content.copy()
    
    # If keys_to_keep is provided, only keep those keys
    if keys_to_keep:
        # Create new dictionaries with only the keys to keep
        source_copy = {k: source_copy[k] for k in keys_to_keep if k in source_copy}
        target_copy = {k: target_copy[k] for k in keys_to_keep if k in target_copy}
    
    prompt = f"""Here are two JSON files:

Source (original language):
{json.dumps(source_copy, indent=2)}

Target (translations):
{json.dumps(target_copy, indent=2)}

Query about the translations:
{query}

Please provide your response as the complete modified version of the target JSON.
Only output the modified JSON, nothing else."""

    try:
        message = client.messages.create(
            model="claude-3-5-sonnet-latest",
            temperature=0,
            max_tokens=8192,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        return message
    except Exception as e:
        print(f"Error querying Claude: {e}", file=sys.stderr)
        sys.exit(1)

def request_changes(source_file, target_file, query, api_key=None):
    """
    Request translation changes from Claude and return the modified target JSON.
    
    Args:
        source_file: Path to the source language JSON file
        target_file: Path to the translations JSON file
        query: Query about desired changes
        api_key: Optional API key (defaults to ANTHROPIC_API_KEY env var)
        
    Returns:
        Modified target JSON content
    """
    # Get API key from environment if not provided
    api_key = api_key or os.getenv('ANTHROPIC_API_KEY')
    if not api_key:
        raise ValueError("API key must be provided or set in ANTHROPIC_API_KEY environment variable")
    
    # Read both files
    source_content = read_json_file(source_file)
    target_content = read_json_file(target_file)
    
    # Handle case where target_content might be None
    if target_content is None:
        target_content = {}
    
    # Analyze missing and present keys
    source_keys = set(source_content.keys())
    target_keys = set(target_content.keys())
    
    missing_keys = source_keys - target_keys
    present_keys = source_keys.intersection(target_keys)
    
    # Print diagnostics
    print(f"Translation status:", file=sys.stderr)
    print(f"  Total keys in source: {len(source_keys)}", file=sys.stderr)
    print(f"  Keys present in translation: {len(present_keys)} ({len(present_keys)/len(source_keys)*100:.1f}%)", file=sys.stderr)
    print(f"  Keys missing from translation: {len(missing_keys)} ({len(missing_keys)/len(source_keys)*100:.1f}%)", file=sys.stderr)
    
    # Create client
    client = Anthropic(api_key=api_key)
    
    # Find common keys between source and target
    common_keys = [k for k in source_content if k in target_content]
    
    # Keep only up to 5 common keys for context
    keys_to_keep = common_keys[:min(5, len(common_keys))]
    print(f"\nUsing these keys for context: {', '.join(keys_to_keep)}", file=sys.stderr)
    
    # Get response with reduced input
    response = get_claude_response(client, source_content, target_content, query, keys_to_keep)
    
    # Try to parse the response as JSON
    try:
        partial_json = json.loads(response.content[0].text.strip())
        
        # Add back all the keys from the original target that weren't included
        for key in target_content:
            if key not in keys_to_keep:
                partial_json[key] = target_content[key]
        
        # Check if any missing keys were added in the response
        newly_added_keys = set(partial_json.keys()) - set(target_content.keys())
        if newly_added_keys:
            print(f"\nNewly added translations:", file=sys.stderr)
            for key in sorted(newly_added_keys):
                print(f"  + {key}", file=sys.stderr)
        
        # Output the complete JSON to stdout
        print(json.dumps(partial_json, indent=2))
        return
    except json.JSONDecodeError:
        print("Failed to parse the response as JSON. Outputting the raw response:", file=sys.stderr)
        print(response.content[0].text.strip(), file=sys.stderr)

def main():
    parser = argparse.ArgumentParser(description='Request translation changes from Claude')
    parser.add_argument('source', help='Path to the source language JSON file')
    parser.add_argument('target', help='Path to the translations JSON file')
    parser.add_argument('query', help='Query about desired changes')
    
    args = parser.parse_args()
    
    request_changes(args.source, args.target, args.query)

if __name__ == "__main__":
    main()
