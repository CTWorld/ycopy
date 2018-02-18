# Ycopy

[![npm version][npm-image]][npm-url]

## Installation

``` bash
yarn add ycopy
```

## Usage

``` bash
ycopy [src] [dest] [options] [-f] [file-filters] [-r] [folder-filters]
```

## Options

* `--version`: Show version number.
* `-o`, `--overwrite`: Overwrite existing file or directory, default is `true`. Note that the copy operation will silently fail if you set this to false and the destination exists. Use the errorOnExist option to change this behavior.
* `-e`, `--errorOnExist`: When overwrite is false and the destination exists, throw an error. Default is false.
* `-s`, `--dereference`: Dereference symlinks, default is false.
* `-t`, `--preserveTimestamps`: Will set last modification and access times to the ones of the original source files, default is false.
* `-f`, `--filter-file`: To filter copied files. If no filter is apply, all files will be reserved.
* `-r`, `--filter-folder`: To filter copied folders. If no filter is apply, all folders will be reserved.
* `-d`, `--delete`: Delete first before copy files. Default is false.
* `-i`, `--info`: Show more info. Default is false.
* `-h`, `--help`: Show help.

> Copy behaviors is similiar with [`fs-extra`](fs-extra)'s [`copy`](fs-extra-copy).

## Example

```` bash
ycopy test/a test/another/a -f .*\.txt .*\.jpg -r "^((?!cd$).)*$" -d -i
````

copy files and folders from test/a to test/another/a, which file is end with .txt or .jpg and folder is not end with sequence 'cd'.

[npm-url]: https://www.npmjs.com/package/ycopy
[npm-image]: https://img.shields.io/npm/v/ycopy.svg
[fs-extra]: https://github.com/jprichardson/node-fs-extra.git
[fs-extra-copy]: https://github.com/jprichardson/node-fs-extra/blob/master/docs/copy.md