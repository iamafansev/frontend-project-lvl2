install:
	npm install

test:
	npm test

test-coverage:
	npm test -- --coverage

start:
	npx babel-node src/bin/gendiff.js

publish:
	npm publish --dry-run

make lint:
	npx eslint .