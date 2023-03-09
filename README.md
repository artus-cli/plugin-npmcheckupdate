# artus-cli/template

template repository for artus-cli

<!-- Badge，自行替换掉下面的 `artus-cli/artus-cli` 占位符-->

[![NPM version](https://img.shields.io/npm/v/@artus-cli/artus-cli.svg?style=flat-square)](https://npmjs.org/package/@artus-cli/artus-cli)
[![NPM quality](https://img.shields.io/npms-io/final-score/@artus-cli/artus-cli.svg?style=flat-square)](https://npmjs.org/package/@artus-cli/artus-cli)
[![NPM download](https://img.shields.io/npm/dm/@artus-cli/artus-cli.svg?style=flat-square)](https://npmjs.org/package/@artus-cli/artus-cli)
[![Continuous Integration](https://github.com/artus-cli/artus-cli/actions/workflows/ci.yml/badge.svg)](https://github.com/artus-cli/artus-cli/actions/workflows/ci.yml)
[![Test coverage](https://img.shields.io/codecov/c/github/artus-cli/artus-cli.svg?style=flat-square)](https://codecov.io/gh/artus-cli/artus-cli)
[![Oss Insight Analytics](https://img.shields.io/badge/OssInsight-artus--cli%2Fartus--cli-blue.svg?style=flat-square)](https://ossinsight.io/analyze/artus-cli/artus-cli)


## Install

```sh
$ npm i -D @artus-cli/artus-cli 
```

## Usage

```ts
// plugin.ts

export default {
  template: {
    enable: true,
    package: 'artus-cli/artus-cli',
  },
};
```

## Commands

### dev


### debug


## Contributing

```sh
$ npm test
$ npm run cov
```