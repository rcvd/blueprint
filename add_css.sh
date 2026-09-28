#!/bin/sh
cp src/build.ts src/index.ts

echo "function initCSSTheme() {" >> src/index.ts
printf "    css['blueprint'] = '" >> src/index.ts
cat src/themes/blueprint.css | tr '\n' ' ' | sed "s/'/\\\\'/g" >> src/index.ts
echo "';" >> src/index.ts
echo "}" >> src/index.ts