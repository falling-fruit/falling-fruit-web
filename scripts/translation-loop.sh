#!/bin/bash
set -euo pipefail

SOURCE="public/locales/en.json"
WORK_DIR="work"

# Ensure work directory exists
mkdir -p "${WORK_DIR}"

# Function to check if we need to process a file
need_processing() {
  local source_file=$1
  local target_file=$2
  
  # If updated file doesn't exist or source is newer, we need processing
  if [ ! -f "$target_file" ] || [ "$source_file" -nt "$target_file" ]; then
    return 0  # true in bash
  else
    echo "Skipping $target_file (already exists and up to date)"
    return 1  # false in bash
  fi
}

# Extract English translations
jq -r '. |keys[]' "${SOURCE}" | while read -r key; do 
    jq ".[\"$key\"]" "${SOURCE}" > "${WORK_DIR}/en-${key}.json"
done 

# Extract page subkeys
jq -r '. |keys[]' "$WORK_DIR/en-pages.json" | while read -r key2; do 
    jq ".[\"$key2\"]" "$WORK_DIR/en-pages.json" > "${WORK_DIR}/en-pages-${key2}.json"
done 

for TARGET_LANG in ar de el es he it nl pt vi pl fr cn tw sv tr uk; do
  if [ "$TARGET_LANG" == 'cn' ]; then
    cp public/locales/zh-hans.json public/locales/cn.json
  elif [ "$TARGET_LANG" == 'tw' ]; then
    cp public/locales/zh-hant.json public/locales/tw.json
  fi
  jq -r '. |keys[]' "public/locales/en.json" | while read -r key; do
      EN_LINES=$(wc -l < "${WORK_DIR}/en-${key}.json")
      TARGET_KEY_FILE="${WORK_DIR}/${TARGET_LANG}-${key}.json"
      UPDATED_FILE="${WORK_DIR}/${TARGET_LANG}-${key}-updated.json"

      # Extract target translation
      jq ".[\"$key\"]" "public/locales/${TARGET_LANG}.json" > "$TARGET_KEY_FILE"
      if ! [ -s "$TARGET_KEY_FILE" ]; then
        echo {} > "$TARGET_KEY_FILE"
      fi

      if [ "$key" == 'pages' ]; then
        # Handle pages subkeys
        jq -r '. |keys[]' "${WORK_DIR}/en-pages.json" | while read -r subkey; do
          TARGET_SUBKEY_FILE="${WORK_DIR}/${TARGET_LANG}-pages-${subkey}.json"
          EN_SUBLINES=$(wc -l < "${WORK_DIR}/en-pages-${subkey}.json")
          
          jq ".[\"$subkey\"]" < "$TARGET_KEY_FILE" > "$TARGET_SUBKEY_FILE"
          if ! [ -s "$TARGET_SUBKEY_FILE" ]; then
            echo {} > "$TARGET_SUBKEY_FILE"
          fi
          
          UPDATED_SUBKEY_FILE="${WORK_DIR}/${TARGET_LANG}-pages-${subkey}-updated.json"
          
          if need_processing "${WORK_DIR}/en-pages-${subkey}.json" "$UPDATED_SUBKEY_FILE"; then
            TARGET_SUBLINES=$(wc -l < "$TARGET_SUBKEY_FILE")
            if [ "$TARGET_SUBLINES" -lt "$EN_SUBLINES" ]; then
              # Translate subkey section
              scripts/show_translations_and_request_changes.py \
                "${WORK_DIR}/en-pages-${subkey}.json" \
                "$TARGET_SUBKEY_FILE" \
                > "$UPDATED_SUBKEY_FILE"
            else
              cp $TARGET_SUBKEY_FILE "$UPDATED_SUBKEY_FILE"
            fi
          fi
        done
        
        # Recombine all pages sections
        jq -n 'reduce (inputs | {(input_filename | split("-")[-2]): .}) as $item ({}; . + $item)' \
            "${WORK_DIR}/${TARGET_LANG}-pages-"*-updated.json > "$UPDATED_FILE"
      else
        if need_processing "${WORK_DIR}/en-${key}.json" "$UPDATED_FILE"; then
          # Check if target has fewer lines than source
          TARGET_LINES=$(wc -l < "$TARGET_KEY_FILE")
          if [ "$TARGET_LINES" -lt "$EN_LINES" ]; then
              scripts/show_translations_and_request_changes.py \
                "${WORK_DIR}/en-${key}.json" \
                "$TARGET_KEY_FILE" \
                > "$UPDATED_FILE"
          else
            cp $TARGET_KEY_FILE $UPDATED_FILE
          fi
        fi
      fi
  done

  # Combine all updated translations
  jq -n 'reduce (inputs | {(input_filename | split("/")[-1] | split("-")[1] | split(".")[0]): .}) as $item ({}; . + $item)' \
      "${WORK_DIR}/${TARGET_LANG}"-*-updated.json > "${WORK_DIR}/${TARGET_LANG}.json"

  mv -v "${WORK_DIR}/${TARGET_LANG}.json" "public/locales/${TARGET_LANG}.json"
  if [ "$TARGET_LANG" == 'cn' ]; then
    mv -v public/locales/cn.json public/locales/zh-hans.json
  elif [ "$TARGET_LANG" == 'tw' ]; then
    mv -v public/locales/tw.json public/locales/zh-hant.json
  fi
done

