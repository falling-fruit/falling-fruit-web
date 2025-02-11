#!/usr/bin/env python3

import os
import sys
import argparse
from anthropic import Anthropic

def read_file(filepath):
    """Read and return the contents of a file."""
    try:
        with open(filepath, 'r') as f:
            return f.read()
    except Exception as e:
        print(f"Error reading file: {e}")
        sys.exit(1)

def get_claude_response(client, file_content, question, mode="yes_no"):
    """Get raw response from Claude."""
    base_prompt = f"""Here is the content of a source code file:

{file_content}

{question}"""

    if mode == "yes_no":
        prompt = base_prompt + "\n\nAnswer with ONLY a single word: 'yes' or 'no'."
    else:  # list mode
        prompt = base_prompt + "\n\nProvide your answer as a list with one item per line. Do not include any other text."

    try:
        message = client.messages.create(
            model="claude-3-5-sonnet-latest",
            max_tokens=100,
            temperature=0,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        return message
    except Exception as e:
        print(f"Error querying Claude: {e}")
        sys.exit(1)

def interpret_response(response, mode="yes_no"):
    """Interpret Claude's response based on mode."""
    if mode == "yes_no":
        response_text = response[0].text.strip().lower()
        if response_text in ['yes', 'no']:
            return [response_text]
        else:
            print(f"Not a yes/no response: {response}")
            sys.exit(1)
    else:  # list mode
        return [line.strip() for line in response.content[0].text.strip().split('\n') if line.strip()]

def query(filepath, question, mode="yes_no", api_key=None):
    """
    Query Claude about a source code file and return the response object.
    
    Args:
        filepath: Path to the source code file
        question: Question to ask about the code
        mode: Either "yes_no" or "list" for response type
        api_key: Optional API key (defaults to ANTHROPIC_API_KEY env var)
        
    Returns:
        The raw response object from Claude
    """
    # Get API key from environment if not provided
    api_key = api_key or os.getenv('ANTHROPIC_API_KEY')
    if not api_key:
        raise ValueError("API key must be provided or set in ANTHROPIC_API_KEY environment variable")
    
    # Read the file
    file_content = read_file(filepath)
    
    # Create client and get response
    client = Anthropic(api_key=api_key)
    return get_claude_response(client, file_content, question, mode)

def main():
    parser = argparse.ArgumentParser(description='Query Claude about a source code file')
    parser.add_argument('file', help='Path to the source code file')
    parser.add_argument('question', help='Question to ask about the code')
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument('--answer-yes-no', action='store_true', help='Get a yes/no answer')
    group.add_argument('--produce-list', action='store_true', help='Get a list of results')
    
    args = parser.parse_args()
    
    try:
        mode = "yes_no" if args.answer_yes_no else "list"
        print(f"{args.file}\tQUERY\t{args.question}")
        response = query(args.file, args.question, mode)
        results = interpret_response(response, mode)
        for result in results:
            print(f"{args.file}\tRESULT\t{result}")
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
