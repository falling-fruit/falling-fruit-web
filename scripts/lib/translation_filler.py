import os
import sys
import json
import logging
from anthropic import Anthropic
from translation import Translation
from iso639 import Lang
from iso639.exceptions import InvalidLanguageValue

logger = logging.getLogger(__name__)

def get_language_name(language_code):
    """Get the full language name from a language code, or return the code in uppercase if not found."""
    try:
        lang = Lang(language_code)
        return lang.name
    except InvalidLanguageValue:
        return language_code.upper()

def find_missing_keys(source, target):
    """Find missing keys in flat dictionaries."""
    return [key for key in source if key not in target]

def narrow_down_source_and_target(source_content, target_content, missing_keys):
    """
    Narrow down source and target dictionaries to a relevant subset for translation.
    Returns two dictionaries ready for Claude's prompt and the list of missing keys.
    """
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

def fill_up_gaps_in_content(source_content, target_content, missing_keys_list, language_code):
    # Get API key from environment if not provided
    api_key = os.getenv('ANTHROPIC_API_KEY')
    if not api_key:
        raise ValueError("API key must be set in ANTHROPIC_API_KEY environment variable")
    
    # Create client
    client = Anthropic(api_key=api_key)
    
    # Get the full language name
    language_name = get_language_name(language_code)
    
    # Check if target has any existing translations
    has_existing_translations = len(target_content) > 0
    
    if has_existing_translations:
        # Original prompt when we have existing translations to learn from
        prompt = f"""Here are two translation files:

Source (original language):
{json.dumps(source_content, indent=2)}

Target (translations):
{json.dumps(target_content, indent=2)}

Missing keys that need translation:
{json.dumps(missing_keys_list, indent=2)}

Read the source translation and fill out the gaps in the target translation by translating from source into target language. Be very careful to reply with complete file.

Please provide your response as the complete modified version of the target JSON.

Respond with ONLY valid JSON. Do not include code fences or commentary.
"""
    else:
        # New prompt when there are no existing translations
        prompt = f"""Here is a source translation file in English:

{json.dumps(source_content, indent=2)}

The following keys need to be translated to {language_name}:
{json.dumps(missing_keys_list, indent=2)}

Please translate these keys from English to {language_name}. Maintain the same JSON structure and key names.

Please provide your response as a JSON object containing the translated keys. Respond with ONLY valid JSON. Do not include code fences or commentary.

"""

    logger.debug(prompt)

    # Build the schema properties for the expected keys
    schema_properties = {}
    for key in missing_keys_list:
        schema_properties[key] = {"type": "string"}
    
    # Build the required keys list
    required_keys = missing_keys_list

    message = client.beta.messages.create(
        model="claude-sonnet-4-5-20250929",
        temperature=0,
        max_tokens=8192,
        betas=["structured-outputs-2025-11-13"],
        messages=[
            {"role": "user", "content": prompt}
        ],
        output_format={
            "type": "json_schema",
            "schema": {
                "type": "object",
                "properties": schema_properties,
                "required": required_keys,
                "additionalProperties": False
            }
        }
    )
    logger.debug(message.content)
    
    return json.loads(message.content[0].text.strip())

def fill_up_translation(source_translation, target_translation, language_code, batch_size=10):
    source_content = source_translation.entries
    target_content = target_translation.entries
    
    all_missing_keys = find_missing_keys(source_content, target_content)
    
    if not all_missing_keys:
        logger.debug("No missing keys found. Translation is complete.")
        return target_translation
    
    total_missing = len(all_missing_keys)
    language_name = get_language_name(language_code)
    logger.info(f"Found {total_missing} missing keys for {language_name} ({language_code}). Processing in batches of {batch_size}.")
    
    # Track successfully processed keys
    successfully_processed_keys = []
    
    # Process missing keys in batches using while loop
    batch_start = 0
    while batch_start < total_missing:
        batch_end = min(batch_start + batch_size, total_missing)
        batch_missing_keys = all_missing_keys[batch_start:batch_end]
        
        batch_num = (batch_start // batch_size) + 1
        total_batches = (total_missing + batch_size - 1) // batch_size
        logger.info(f"Processing batch {batch_num}/{total_batches} ({len(batch_missing_keys)} keys)")
        
        # Narrow down source and target content for this batch
        narrowed_source, narrowed_target, _ = narrow_down_source_and_target(
            source_content, target_content, batch_missing_keys
        )
        
        # Fill up translations using Claude for this batch
        partial_json = fill_up_gaps_in_content(narrowed_source, narrowed_target, batch_missing_keys, language_code)
        
        # Update target translation with new translations
        for key, value in partial_json.items():
            if key in batch_missing_keys:
                logger.info(f"Filling up key: {key}")
                target_translation.set(key, value)
                # Update target_content so subsequent batches see this translation
                target_content[key] = value
        
        logger.info(f"Batch {batch_num}/{total_batches} completed successfully")
        
        # Move to next batch
        batch_start = batch_end
    
    # Final summary
    remaining_missing = find_missing_keys(source_content, target_translation.entries)
    if remaining_missing:
        logger.warning(f"Translation completed with {len(remaining_missing)} keys still missing")
    else:
        logger.info("All translations completed successfully!")
    
    return target_translation
