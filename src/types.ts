import { Command } from '@artus-cli/artus-cli';

export type DistTag = 'latest' | 'beta' | 'alpha' | string & {};

export interface NpmCheckUpdateConfig {
  /** unpkg url, default is https://unpkg.com/ */
  unpkgUrl?: string;
  /** the file be used to cache last update info */
  cacheFile?: string;
  /** check inerval with local cache, default is 1 day */
  checkInterval?: string | number;
  /** upgrade policy, canbe major/minor/patch or dist-tags, default is latest */
  upgradePolicy?: 'major' | 'minor' | 'patch' | DistTag;
  /** whether enable CheckUpdateCommand, default is true */
  enableCommand?: boolean;
  /** whether enable intercept in all command? default is true */
  enableInterceptor?: boolean | ((cmd: typeof Command) => boolean);
  /** the position of upgrade info, default is after */
  upgradeInfoPrintPosition?: 'before' | 'after';
  /** customize your special upgrade info */
  upgradeInfoHooks?: {
    /** customize contents only */
    contents?: (upgradeInfo: UpgradeInfo, contents: string[]) => string | string[];
    /** customize all info */
    fullContents?: (upgradeInfo: UpgradeInfo, fullContents: string[]) => string | string[];
  };
}

export interface CacheInfo {
  updateToDateTime?: number;
}

export interface UpgradeInfo {
  pkgName: string;
  pkgVersion: string;
  pkgBaseDir: string;
  distTag: DistTag;
  upgradePolicy: NpmCheckUpdateConfig['upgradePolicy'];
  targetVersion: string;
  needUpdate: boolean;
}
