#!/bin/bash

# Define the directory where the extension files are located
EXTENSION_DIR="$(pwd)/chrome"

cp -fr "$(pwd)/icons" "$EXTENSION_DIR"
./node_modules/.bin/terser "$(pwd)/content_script.js" -o "$EXTENSION_DIR/content_script.js"
cp -fr "$(pwd)/manifest.json" "$EXTENSION_DIR"

# Define the output directory for the packaged extension
OUTPUT_DIR="$EXTENSION_DIR/web-ext-artifacts"

# Package the extension
echo "Packaging the extension..."
./node_modules/.bin/web-ext build --overwrite-dest --source-dir="$EXTENSION_DIR" --artifacts-dir="$OUTPUT_DIR" --ignore-files="create_icons.sh logo.svg *.md"

echo "Extension package created in $OUTPUT_DIR"
