#!/bin/sh
cd www/dist
git init .
git add -A
git commit -m "All files"
git remote add origin `cd .. && git remote get-url origin`
git push origin main:dist