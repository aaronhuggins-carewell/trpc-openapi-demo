#!/bin/bash

VERSION="1.0.0"

echo "OpenAPI Generator Wrapper $VERSION"
echo ""

if [[ "$1" == "help" ]] || [[ "$1" == "" ]]; then
  echo "$(basename "$0") help"
  echo "  This help text."
  echo ""
  echo "$(basename "$0") list"
  echo "  Retrieve the complete list of generators."
  echo ""
  echo "$(basename "$0") <SPEC> <OUT_DIR> <GENERATOR>"
  echo ""
  echo "  SPEC       (required)    - The path in CWD or a URL to the openapi spec."
  echo "  OUT_DIR    (optional)    - The subdirectory, if any, in CWD to generate files."
  echo "  GENERATOR  (optional)    - An alternative generator; default is 'typescript-fetch'"
  echo ""
elif [[ "$1" == "list" ]]; then
  echo "listing generators..."
  docker run --rm -v "${PWD}:/local:z" openapitools/openapi-generator-cli list | less
  echo "Finished."
else
  if [[ "$1" =~ ^(https|http)://.* ]]; then
    SPEC="$1"
  else
    SPEC="/local/$1"
  fi
  OUT_DIR="$2"
  if [[ "$3" == "" ]]; then
    GENERATOR="typescript-fetch"
  else
    GENERATOR="$3"
  fi
  docker run --rm -v "${PWD}:/local:z" openapitools/openapi-generator-cli generate -i "$SPEC" -g "$GENERATOR" -o "/local/$OUT_DIR"
  search_dir="${PWD}/$OUT_DIR/models"
  for entry in "$search_dir"/*
  do
    sed -i '3s/^/\/\/ @ts-nocheck = Generated by OpenAPI Tools\n/' "$entry"
  done
  echo "Finished."
fi