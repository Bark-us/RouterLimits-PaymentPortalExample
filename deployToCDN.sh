#!/bin/bash

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Build version'd CDN-ified content
ng build --prod="true"

if [ $? -ne 0 ] ; then
    echo "Build failed!!"
    exit 1
fi

# Upload to S3
echo "Uploading to S3"
aws s3 sync ./dist s3://billing.routerlimits.com --cache-control "public, max-age=604800" --exclude='index.html' --only-show-errors

if [ $? -ne 0 ] ; then
    echo "S3 Upload failed!"
    exit 1
fi

# Set proper headers on index.html in S3 bucket
# Can't update existing files using CLI apparently, have to overwrite. Cool.
echo "Setting proper cache-control header on index.html"
aws s3 cp $DIR/dist/index.html s3://billing.routerlimits.com --cache-control "public, max-age=86400, no-cache" --only-show-errors

if [ $? -ne 0 ] ; then
    echo "Setting index.html cache-control header failed!"
    exit 1
fi
echo "All done. Invalidating in CloudFront should not be necessary."

