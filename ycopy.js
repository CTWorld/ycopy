#!/usr/bin/env node

var argv = require('yargs')
  .option('o', {
    alias : 'overwrite',
    demand: false,
    default: true,
    describe: 'Overwrite existing file or directory, default is true. Note that the copy operation will silently fail if you set this to false and the destination exists. Use the errorOnExist option to change this behavior.'
  })
  .option('e', {
    alias : 'errorOnExist',
    demand: false,
    default: false,
    describe: 'When overwrite is false and the destination exists, throw an error. Default is false.'
  })
  .option('s', {
    alias : 'dereference',
    demand: false,
    default: false,
    describe: 'Dereference symlinks, default is false.'
  })
  .option('t', {
    alias : 'preserveTimestamps',
    demand: false,
    default: false,
    describe: 'Will set last modification and access times to the ones of the original source files, default is false.'
  })
  .option('f', {
    alias : 'filter-file',
    demand: false,
    default: [],
    describe: 'To filter copied files.',
    type: 'array'
  })
  .option('r', {
    alias : 'filter-folder',
    demand: false,
    default: [],
    describe: 'To filter copied folders.',
    type: 'array'
  })
  .option('d', {
    alias : 'delete',
    demand: false,
    default: false,
    describe: 'Delete first before copy files.',
  })
  .option('i', {
    alias : 'info',
    demand: false,
    default: false,
    describe: 'Show more info',
  })
  .usage('Usage: ycopy [src] [dest] [options] [-f] [file-filters] [-r] [folder-filters]')
  .example('ycopy test/a test/another/a -f .*\.txt .*\.jpg -r [^^c]$ -d', 
    'copy files and folders from test/a to test/another/a, which file is end with .txt or .jpg and folder is not containt character \'c\'.')
  .help('h')
  .alias('h', 'help')
  //.epilog('copyright 2018')
  .argv;

if (argv._.length < 2) {
  console.error(`Missing source or dest!\nparam: ${argv._}`);
} else {
  const [src, dest] = argv._;
  const ffRegexs = fromFilters(argv.f);
  const fdRegexs = fromFilters(argv.r);
  const showLog = argv.i;

  showLog && console.log(`src: ${src}`);
  showLog && console.log(`dest: ${dest}`);
  showLog && argv.f.length > 0 && console.info(`file-filters: ${argv.f}`);
  showLog && argv.r.length > 0 && console.info(`folder-filters: ${argv.r}`);

  const fs = require('fs-extra');
  const nfs = require("fs");
  const filterFunc = (src, dest) => {
    if (ffRegexs.length == 0) {
      return true;
    } else {
      if (nfs.statSync(src).isDirectory()) {
        return fdRegexs.length == 0 || regexTest(fdRegexs, src);
      }
      return regexTest(ffRegexs, src);
    }
  }

  if (argv.d) {
    fs.removeSync(dest);
  }

  fs.copySync(src, dest, {
     overwrite: argv.o, 
     errorOnExist: argv.e, 
     dereference: argv.s, 
     preserveTimestamps: argv.t, 
     filter: filterFunc 
  });
}

// create regexs from filters
function fromFilters(filters) {
  const regexs = [];
  filters.forEach(filter => {
    try {
      regexs.push(new RegExp(filter));
    } catch (err) {
      console.error(`${err.message}, ignore filter: ${filter}\n`);
    }
  });
  return regexs;
}

// test whether if value is match at latest one regexs
function regexTest(regexs, value) {
  for (let i = 0, count = regexs.length; i < count; i++) {
    const regex = regexs[i];
    if (regex.test(value)) {
      return true;
    }
  }
  return false;
}