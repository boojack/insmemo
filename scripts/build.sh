#!/bin/bash -x
cd `dirname $0`

tag="latest"

if [[ ! -z "$1" ]]
then
    tag=$1
fi

docker build -t memos:$tag ../
docker tag memos:$tag neosmemo/memos:$tag
docker push neosmemo/memos:$tag
