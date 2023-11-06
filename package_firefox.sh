#!/bin/bash

# Define the directory where the extension files are located
EXTENSION_DIR="$(pwd)/firefox"

cp -fr "$(pwd)/icons" "$EXTENSION_DIR"
cp -fr "$(pwd)/background.js" "$EXTENSION_DIR"
cp -fr "$(pwd)/content_script.js" "$EXTENSION_DIR"

# Define the output directory for the packaged extension
OUTPUT_DIR="$EXTENSION_DIR/web-ext-artifacts"

# Package the extension
echo "Packaging the extension..."
web-ext build --overwrite-dest --source-dir="$EXTENSION_DIR" --artifacts-dir="$OUTPUT_DIR" --ignore-files="create_icons.sh logo.svg *.md"

echo "Extension package created in $OUTPUT_DIR"

source firefox_credentials.sh

# Check if AMO_JWT_ISSUER and AMO_JWT_SECRET are set
if [ -z "$AMO_JWT_ISSUER" ] || [ -z "$AMO_JWT_SECRET" ]; then
  echo "Error: AMO_JWT_ISSUER and AMO_JWT_SECRET environment variables need to be set."
  exit 1
fi

# Sign the extension
echo "Signing the extension..."
web-ext sign --channel listed --source-dir="$EXTENSION_DIR" --artifacts-dir="$OUTPUT_DIR" --api-key="$AMO_JWT_ISSUER" --api-secret="$AMO_JWT_SECRET"

echo "Extension signed. Artifacts are in $OUTPUT_DIR"
