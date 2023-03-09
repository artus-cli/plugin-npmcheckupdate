# artus-cli/plugin-npmcheckupdate

A artus-cli plugin be used to display upgrade info

[![NPM version](https://img.shields.io/npm/v/@artus-cli/plugin-npmcheckupdate.svg?style=flat-square)](https://npmjs.org/package/@artus-cli/plugin-npmcheckupdate)
[![NPM quality](https://img.shields.io/npms-io/final-score/@artus-cli/plugin-npmcheckupdate.svg?style=flat-square)](https://npmjs.org/package/@artus-cli/plugin-npmcheckupdate)
[![NPM download](https://img.shields.io/npm/dm/@artus-cli/plugin-npmcheckupdate.svg?style=flat-square)](https://npmjs.org/package/@artus-cli/plugin-npmcheckupdate)
[![Continuous Integration](https://github.com/artus-cli/plugin-npmcheckupdate/actions/workflows/ci.yml/badge.svg)](https://github.com/artus-cli/plugin-npmcheckupdate/actions/workflows/ci.yml)
[![Test coverage](https://img.shields.io/codecov/c/github/artus-cli/plugin-npmcheckupdate.svg?style=flat-square)](https://codecov.io/gh/artus-cli/plugin-npmcheckupdate)
[![Oss Insight Analytics](https://img.shields.io/badge/OssInsight-artus--cli%2Fartus--cli-blue.svg?style=flat-square)](https://ossinsight.io/analyze/artus-cli/plugin-npmcheckupdate)


## Install

```sh
$ npm i @artus-cli/plugin-npmcheckupdate 
```

## Usage

```ts
// plugin.ts

export default {
  npmcheckupdate: {
    enable: true,
    package: '@artus-cli/plugin-npmcheckupdate',
  },
};
```

## Configuration

```ts
export interface NpmCheckUpdateConfig {
  /** unpkg url, default is https://unpkg.com/ */
  unpkgUrl?: string;
  /** the file be used to cache last update info */
  cacheFile?: string;
  /** check inerval with local cache, default is 1 day */
  checkInterval?: string | number;
  /** upgrade policy, canbe major/minor/patch or dist-tags, default is latest */
  upgradePolicy?: 'major' | 'minor' | 'patch' | DistTag;
  /** whether enable intercept in all command? default is true */
  enableInterceptor?: boolean | ((cmd: typeof Command) => boolean);
}
```
