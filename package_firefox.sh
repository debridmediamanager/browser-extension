#!/bin/bash

# Define the directory where the extension files are located
EXTENSION_DIR="$(pwd)/firefox"

cp -fr "$(pwd)/icons" "$EXTENSION_DIR"
cp -f "$(pwd)/content_script.js" "$EXTENSION_DIR/content_script.js"
jq '. += {"browser_specific_settings": {"gecko": {"id": "browser.ext@debridmediamanager.com", "strict_min_version": "140.0", "data_collection_permissions": {"required": ["none"]}}, "gecko_android": {"strict_min_version": "142.0"}}}' manifest.json > "$EXTENSION_DIR/manifest.json"

# Define the output directory for the packaged extension
OUTPUT_DIR="$EXTENSION_DIR/web-ext-artifacts"

# Package the extension
echo "Packaging the extension..."
./node_modules/.bin/web-ext build --overwrite-dest --source-dir="$EXTENSION_DIR" --artifacts-dir="$OUTPUT_DIR" --ignore-files="create_icons.sh logo.svg *.md"

echo "Extension package created in $OUTPUT_DIR"

# Optional: sign and publish on AMO if credentials are available
if [ -f firefox_credentials.sh ]; then
  source firefox_credentials.sh
fi

if [ -n "$AMO_JWT_ISSUER" ] && [ -n "$AMO_JWT_SECRET" ]; then
  echo "Signing the extension..."
  ./node_modules/.bin/web-ext sign --channel listed --source-dir="$EXTENSION_DIR" --artifacts-dir="$OUTPUT_DIR" --api-key="$AMO_JWT_ISSUER" --api-secret="$AMO_JWT_SECRET"
else
  echo "Skipping signing (AMO credentials not found)"
fi
