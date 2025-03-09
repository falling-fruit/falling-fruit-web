import os
import sys
import json
from anthropic import Anthropic
from translation import Translation

def find_missing_keys(source, target):
    """Find missing keys in flat dictionaries."""
    return [key for key in source if key not in target]

def narrow_down_source_and_target(source_content, target_content):
    """
    Narrow down source and target dictionaries to a relevant subset for translation.
    Returns two dictionaries ready for Claude's prompt and the list of missing keys.
    """
    missing_keys = [key for key in source_content if key not in target_content]
    # Find common keys between source and target
    common_keys = [k for k in source_content if k in target_content]
    
    # Find the maximum number of parts in any missing key
    max_parts = 0
    for key in missing_keys:
        parts = key.split('.')
        max_parts = max(max_parts, len(parts))
    
    # Start with an empty set of related keys
    related_keys = set()
    
    # Iterate from max_parts-1 down to 0
    for num_matching_parts in range(max_parts-1, -1, -1):
        # For each common key, check if it matches any missing key with at least num_matching_parts
        for common_key in common_keys:
            # Skip keys we've already added
            if common_key in related_keys:
                continue
                
            common_parts = common_key.split('.')
            
            # Check against each missing key
            for missing_key in missing_keys:
                missing_parts = missing_key.split('.')
                
                # Check if we have at least num_matching_parts matching parts
                matches = 0
                for i in range(min(len(common_parts), len(missing_parts))):
                    if common_parts[i] == missing_parts[i]:
                        matches += 1
                    else:
                        break
                
                # If we have enough matching parts, add this key to our context
                if matches >= num_matching_parts:
                    related_keys.add(common_key)
                    break
        
        # If we have enough context keys, we can stop
        if len(related_keys) >= 5:
            break
    
    # Convert to list and limit to 5 keys if needed
    related_keys = list(related_keys)
    if len(related_keys) > 5:
        related_keys = related_keys[:5]
    
    # Create narrowed down dictionaries with only the keys to keep
    narrowed_source = {k: source_content[k] for k in related_keys if k in source_content}
    narrowed_target = {k: target_content[k] for k in related_keys if k in target_content}
    
    # Add missing keys to the source dictionary
    for key in missing_keys:
        if key in source_content:
            narrowed_source[key] = source_content[key]
    
    return narrowed_source, narrowed_target, missing_keys

def fill_up_gaps_in_content(source_content, target_content, missing_keys_list):
    # Get API key from environment if not provided
    api_key = os.getenv('ANTHROPIC_API_KEY')
    if not api_key:
        raise ValueError("API key must be set in ANTHROPIC_API_KEY environment variable")
    
    # Create client
    client = Anthropic(api_key=api_key)
    # Create the prompt for Claude
    prompt = f"""Here are two translation files:

Source (original language):
{json.dumps(source_content, indent=2)}

Target (translations):
{json.dumps(target_content, indent=2)}

Missing keys that need translation:
{json.dumps(missing_keys_list, indent=2)}

Read the source translation and fill out the gaps in the target translation by translating from source into target language. Be very careful to reply with complete file.

Please provide your response as the complete modified version of the target JSON.
Only output the modified JSON, nothing else."""

    # Get response from Claude
    message = client.messages.create(
        model="claude-3-5-sonnet-latest",
        temperature=0,
        max_tokens=8192,
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
    
    return json.loads(message.content[0].text.strip())

def fill_up_translation(source_translation, target_translation):
    
    # Read both files as flat dictionaries
    source_content = source_translation.entries
    target_content = target_translation.entries
    
    # Narrow down source and target content for the prompt
    narrowed_source, narrowed_target, missing_keys_list = narrow_down_source_and_target(
        source_content, target_content 
    )
    if not missing_keys_list:
        return target_translation
    
    # Fill up translations using Claude
    partial_json = fill_up_gaps_in_content(narrowed_source, narrowed_target, missing_keys_list)
    
    for key, value in partial_json.items():
        target_translation.set(key, value)
    
    return target_translation
