import { Command } from "@artus-cli/artus-cli";

export type DistTag = 'latest' | 'beta' | 'alpha' | string & {};

export interface NpmCheckUpdateConfig {
  /** unpkg url, default is https://unpkg.com/ */
  unpkgUrl?: string;
  /** the file be used to cache last update info */
  cacheFile?: string;
  /** check inerval with local cache, default is 0, means no cache */
  checkInterval?: string | number;
  /** upgrade policy, canbe major/minor/patch or dist-tags, default is latest */
  upgradePolicy?: 'major' | 'minor' | 'patch' | DistTag;
  /** whether enable intercept in all command? default is true */
  enableInterceptor?: boolean | ((cmd: typeof Command) => boolean);
}

export interface CacheInfo {
  lastUpdateTime?: number;
}

export interface UpgradeInfo {
  pkgName: string;
  pkgVersion: string;
  pkgBaseDir: string;
  distTag: DistTag;
  upgradePolicy: NpmCheckUpdateConfig['upgradePolicy'];
  targetVersion: string;
}
