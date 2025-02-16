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
        print(f"Error reading JSON file: {e}")
        sys.exit(1)

def get_claude_response(client, source_content, target_content, query):
    """Get response from Claude about translation changes."""
    prompt = f"""Here are two JSON files:

Source (original language):
{json.dumps(source_content, indent=2)}

Target (translations):
{json.dumps(target_content, indent=2)}

Query about the translations:
{query}

Please provide your response as the complete modified version of the target JSON.
Only output the modified JSON, nothing else."""

    try:
        message = client.messages.create(
            model="claude-3-5-sonnet-latest",
            temperature=0,
            max_tokens= 8192,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        return message
    except Exception as e:
        print(f"Error querying Claude: {e}")
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
    
    # Create client and get response
    client = Anthropic(api_key=api_key)
    response = get_claude_response(client, source_content, target_content, query)
    print(response.content[0].text.strip())

def main():
    parser = argparse.ArgumentParser(description='Request translation changes from Claude')
    parser.add_argument('source', help='Path to the source language JSON file')
    parser.add_argument('target', help='Path to the translations JSON file')
    parser.add_argument('query', help='Query about desired changes')
    
    args = parser.parse_args()
    
    try:
        request_changes(args.source, args.target, args.query)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
