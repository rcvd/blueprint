#!/bin/sh
cp src/build.ts src/index.ts

echo "function initCSSTheme() {" >> src/index.ts
echo "    css['blueprint'] = '`cat src/themes/blueprint.css | tr '\n' ' '`';" >> src/index.ts
echo "}" >> src/index.ts
