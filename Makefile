install:
	npm install

test:
	npm run test

start:
	npx babel-node src/bin/gendiff.js

publish:
	npm publish --dry-run

make lint:
	npx eslint .