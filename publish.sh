#!/bin/bash

proj_path=$GOPATH/src/github.com/hzxiao/ocss-front
app_path=/home/jks/app
proj_name=ocss-front

cd $proj_path
git checkout .
git pull


npm install

npm run build

sudo rm -rf $app_path/$proj_name

cp -r dist/ $app_path/$proj_name
