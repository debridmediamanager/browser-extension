#!/bin/bash

# Define the directory where the extension files are located
EXTENSION_DIR="$(pwd)/chrome"

cp -fr "$(pwd)/icons" "$EXTENSION_DIR"
cp -fr "$(pwd)/background.js" "$EXTENSION_DIR"
cp -fr "$(pwd)/content_script.js" "$EXTENSION_DIR"
cp -fr "$(pwd)/manifest.json" "$EXTENSION_DIR"
jq 'del(.applications)' "$EXTENSION_DIR/manifest.json" > "$EXTENSION_DIR/manifest.tmp.json" && mv "$EXTENSION_DIR/manifest.tmp.json" "$EXTENSION_DIR/manifest.json"

# Define the output directory for the packaged extension
OUTPUT_DIR="$EXTENSION_DIR/web-ext-artifacts"

# Package the extension
echo "Packaging the extension..."
./node_modules/.bin/web-ext build --overwrite-dest --source-dir="$EXTENSION_DIR" --artifacts-dir="$OUTPUT_DIR" --ignore-files="create_icons.sh logo.svg *.md"

echo "Extension package created in $OUTPUT_DIR"
