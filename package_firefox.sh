#!/bin/bash

# Define the directory where the extension files are located
EXTENSION_DIR="$(pwd)/firefox"

cp -fr "$(pwd)/icons" "$EXTENSION_DIR"
cp -fr "$(pwd)/background.js" "$EXTENSION_DIR"
cp -fr "$(pwd)/content_script.js" "$EXTENSION_DIR"
cp -fr "$(pwd)/manifest.json" "$EXTENSION_DIR"

# Define the output directory for the packaged extension
OUTPUT_DIR="$EXTENSION_DIR/web-ext-artifacts"

# Package the extension
echo "Packaging the extension..."
./node_modules/.bin/web-ext build --overwrite-dest --source-dir="$EXTENSION_DIR" --artifacts-dir="$OUTPUT_DIR" --ignore-files="create_icons.sh logo.svg *.md"

echo "Extension package created in $OUTPUT_DIR"

# uncomment the following lines to sign and publish the extension on AMO
# source firefox_credentials.sh

# if [ -z "$AMO_JWT_ISSUER" ] || [ -z "$AMO_JWT_SECRET" ]; then
#   echo "Error: AMO_JWT_ISSUER and AMO_JWT_SECRET environment variables need to be set."
#   exit 1
# fi

# # echo "Signing the extension..."
# ./node_modules/.bin/web-ext sign --channel listed --source-dir="$EXTENSION_DIR" --artifacts-dir="$OUTPUT_DIR" --api-key="$AMO_JWT_ISSUER" --api-secret="$AMO_JWT_SECRET"

# # echo "Extension signed. Artifacts are in $OUTPUT_DIR"
