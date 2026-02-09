#!/bin/sh
#
# Ensure the userscript @version in content_script.js is bumped
# whenever content_script.js is part of the commit.

SCRIPT="content_script.js"

# Only check if content_script.js is staged
if ! git diff --cached --name-only | grep -qx "$SCRIPT"; then
    exit 0
fi

# Get the committed (HEAD) version and the staged version
OLD_VERSION=$(git show HEAD:"$SCRIPT" 2>/dev/null | grep -oP '// @version\s+\K\S+')
NEW_VERSION=$(git diff --cached -- "$SCRIPT" | grep -oP '^\+// @version\s+\K\S+' || true)

# If there's no version line change in the diff, the version wasn't bumped
if [ -z "$NEW_VERSION" ]; then
    echo "ERROR: content_script.js is staged but @version was not bumped."
    echo "  Current version: $OLD_VERSION"
    echo "  Please update the // @version line before committing."
    exit 1
fi

# Verify the new version is actually different
if [ "$OLD_VERSION" = "$NEW_VERSION" ]; then
    echo "ERROR: @version is unchanged ($OLD_VERSION)."
    echo "  Please bump the version before committing."
    exit 1
fi

echo "Version bump: $OLD_VERSION -> $NEW_VERSION"
exit 0
