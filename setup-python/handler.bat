
md .\dist\common

copy .\dist\common-utils\src\cmd.js .\dist\common\

copy .\dist\setup-python\src\main.js .\dist\

rmdir /s /q .\dist\common-utils

rmdir /s /q .\dist\setup-python

echo ""

rmdir /q /s .\dist

npx tsc --build

npx ncc build src/main.ts -o dist

git add .

git commit -m "update"

git push -u origin main

