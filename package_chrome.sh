#!/bin/bash

# Define the directory where the extension files are located
EXTENSION_DIR="$(pwd)/chrome"

cp -r "$(pwd)/icons" "$EXTENSION_DIR"
cp -r "$(pwd)/background.js" "$EXTENSION_DIR"
cp -r "$(pwd)/content_script.js" "$EXTENSION_DIR"

# Define the output directory for the packaged extension
OUTPUT_DIR="$EXTENSION_DIR/web-ext-artifacts"

# Package the extension
echo "Packaging the extension..."
web-ext build --source-dir="$EXTENSION_DIR" --artifacts-dir="$OUTPUT_DIR" --ignore-files="create_icons.sh logo.svg *.md"

echo "Extension package created in $OUTPUT_DIR"
