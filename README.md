# gendiff

<a href="https://codeclimate.com/github/iamafansev/frontend-project-lvl2/maintainability"><img src="https://api.codeclimate.com/v1/badges/36d5a273f7381fcf22c3/maintainability" /></a>

<a href="https://travis-ci.com/iamafansev/frontend-project-lvl2/"><img src="https://travis-ci.com/iamafansev/frontend-project-lvl2.svg?branch=master"></a>

**gendiff** is a configuration file comparison utility that displays the difference between two files. This program displays data changes (key-value pairs) made to a file.
The result of comparing files can be displayed in different formats: for example, plain ("flat") or json ("JSON-format").

**Supported Formats**
* .json
* .yml
* .ini

## Setup

```sh
$ make install
```

**The basic command syntax is as follows:**
```sh
$ gendiff [options] <firstConfig> <secondConfig>
```

The absence of plus or minus indicates that the key is in both files and its values coincide. In all other situations, the key was either deleted, added, or changed.

### Comparison files
```sh
$ gendiff before.json after.json

{
    common: {
      + follow: false
        setting1: Value 1
      - setting2: 200
      - setting3: true
      + setting3: {
            key: value
        }
        setting6: {
            key: value
          + ops: vops
        }
      + setting4: blah blah
      + setting5: {
            key5: value5
        }
    }
    group1: {
      + baz: bars
      - baz: bas
        foo: bar
      - nest: {
            key: value
        }
      + nest: str
    }
  - group2: {
        abc: 12345
    }
  + group3: {
        fee: 100500
    }
}
```

### Comparison files (plain format)
```sh
$ gendiff --format plain before.json after.json

Property common.setting2 was removed
Property common.setting3 was updated. from true to '[complex value]'
Property common.setting6.ops was added with value: vops
Property common.follow was added with value: false
Property common.setting4 was added with value: blah blah
Property common.setting5 was added with value: [complex value]
Property group1.baz was updated. from bas to 'bars'
Property group1.nest was updated. from [complex value] to 'str'
Property group2 was removed
Property group3 was added with value: [complex value]
```

### Comparison files (json format)
```sh
$ gendiff --format json before.json after.json

[{"name":"common","status":"change","children":[{"name":"setting1","status":"unchanged","value":"Value 1"},{"name":"setting2","status":"removed","value":200},{"name":"setting3","status":"change","beforeValue":true,"afterValue":{"key":"value"}},{"name":"setting6","status":"change","children":[{"name":"key","status":"unchanged","value":"value"},{"name":"ops","status":"added","value":"vops"}]},{"name":"follow","status":"added","value":false},{"name":"setting4","status":"added","value":"blah blah"},{"name":"setting5","status":"added","value":{"key5":"value5","key6":{"key7":"value7"}}}]},{"name":"group1","status":"change","children":[{"name":"baz","status":"change","beforeValue":"bas","afterValue":"bars"},{"name":"foo","status":"unchanged","value":"bar"},{"name":"nest","status":"change","beforeValue":{"key":"value"},"afterValue":"str"}]},{"name":"group2","status":"removed","value":{"abc":12345}},{"name":"group3","status":"added","value":{"fee":100500}}]
```
