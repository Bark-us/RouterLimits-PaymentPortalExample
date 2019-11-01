#!/bin/bash

set -e

for i in "$@"
do
case $i in
    -b=*|--bucketUrl=*)
    bucketUrl="${i#*=}"
    break;;
esac
done

if [[ -z "${bucketUrl// }" ]]; then
    echo "ERROR: AWS bucket url is required. Use -b to supply a bucket URL. (i.e. -b='s3://bucket.yourcompany.com') "
    echo "AWS bucket url is required. Use -b to supply a bucket URL. (i.e. -b='s3://bucket.yourcompany.com') " > logfile.log
    exit 125
fi

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Build version'd CDN-ified content
ng build --prod="true"

if [ $? -ne 0 ] ; then
    echo "Build failed!!"
    exit 1
fi

# Upload to S3
echo "Uploading to S3"
aws s3 sync ./dist "$bucketUrl" --cache-control "public, max-age=604800" --exclude='index.html' --only-show-errors

if [ $? -ne 0 ] ; then
    echo "S3 Upload failed!"
    exit 1
fi

# Set proper headers on index.html in S3 bucket
# Can't update existing files using CLI apparently, have to overwrite. Cool.
echo "Setting proper cache-control header on index.html"
aws s3 cp $DIR/dist/index.html "$bucketUrl" --cache-control "public, max-age=86400, no-cache" --only-show-errors

if [ $? -ne 0 ] ; then
    echo "Setting index.html cache-control header failed!"
    exit 1
fi
echo "All done. Invalidating in CloudFront should not be necessary."

