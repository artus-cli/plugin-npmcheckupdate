import { Inject, Injectable, Program, ArtusInjectEnum, ScopeEnum } from '@artus-cli/artus-cli';
import DefaultConfig from './config/config.default';
import path from 'path';
import ms from 'ms';
import { CacheInfo, NpmCheckUpdateConfig, UpgradeInfo } from './types';
import fs from 'fs/promises';
import { checkUpdate, displayUpgradeInfo } from './helper';
const cacheFileSym = Symbol('cacheFile');

@Injectable({
  scope: ScopeEnum.SINGLETON,
})
export class Updater {
  @Inject()
  private readonly program: Program;

  @Inject(ArtusInjectEnum.Config)
  config: typeof DefaultConfig;

  private checked?: boolean;

  private get cacheFile() {
    if (this[cacheFileSym]) {
      return this[cacheFileSym];
    }

    const { baseDir } = this.program;
    const { cacheFile } = this.config.npmcheckupdate;
    this[cacheFileSym] = cacheFile || path.resolve(baseDir, './.npmcheckupdate');
    return this[cacheFileSym];
  }

  async readCacheFile(): Promise<CacheInfo | null> {
    return fs.readFile(this.cacheFile, 'utf-8')
      .then(str => JSON.parse(str))
      .catch(() => null);
  }

  async updateCacheFile(updateInfo: CacheInfo) {
    return fs.writeFile(this.cacheFile, JSON.stringify(updateInfo));
  }

  async checkUpdate(option: Partial<NpmCheckUpdateConfig> & { updateCache?: boolean; } = {}): Promise<UpgradeInfo | undefined> {
    if (this.checked) {
      // avoid checking twice
      return undefined;
    }

    this.checked = true;
    let { checkInterval, unpkgUrl, upgradePolicy, updateCache } = {
      ...this.config.npmcheckupdate,
      ...option,
    };

    const { baseDir, version, binInfo } = this.program;
    checkInterval = ms(checkInterval as string);

    const cacheInfo = await this.readCacheFile();
    const lastUpdateTime = cacheInfo?.updateToDateTime;
    if (checkInterval > 0 && lastUpdateTime && (Date.now() - lastUpdateTime) < checkInterval) {
      // no need to check
      return undefined;
    }

    const checkResult = await checkUpdate({
      unpkgUrl,
      upgradePolicy,
      pkgBaseDir: baseDir,
      pkgName: binInfo.name,
      pkgVersion: version,
    });

    // update cache
    if (!checkResult.needUpdate && checkInterval > 0 && updateCache !== false) {
      await this.updateCacheFile({ updateToDateTime: Date.now() });
    }

    return checkResult as UpgradeInfo;
  }

  /** display upgrade info */
  displayUpgradeInfo(upgradeInfo: UpgradeInfo) {
    return displayUpgradeInfo(upgradeInfo, this.config.npmcheckupdate.upgradeInfoHooks);
  }
}
