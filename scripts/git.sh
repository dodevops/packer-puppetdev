#!/usr/bin/env bash

# Git is removed in minimize.sh, reinstall it

apt-get update && apt-get install -y git

# Cleanup afterwards

echo "==> Removing APT files"
find /var/lib/apt -type f | xargs rm -f
echo "==> Removing caches"
find /var/cache -type f -exec rm -rf {} \;