#!/bin/bash

cd `dirname $0`

npm run docs:build && rsync --delete -avz docs/.vitepress/dist/ root@sh1:/var/html/blog.psoho.cn/
