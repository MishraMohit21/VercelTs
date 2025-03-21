#!/bin/bash

# Check if a commit message was provided
if [ -z "$1" ]; then
    echo "Usage: $0 \"commit message\""
    exit 1
fi

# Add all changes
git add .

# Commit with the provided message
git commit -m "$1"

# Push to the current branch
git push origin "$(git rev-parse --abbrev-ref HEAD)"

echo "✅ Changes committed and pushed!"
