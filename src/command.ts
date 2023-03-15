import { Command, DefineCommand, Inject, Option, ArtusInjectEnum } from '@artus-cli/artus-cli';
import DefaultConfig from './config/config.default';
import { Updater } from './updater';

@DefineCommand({
  enable: false,
  command: '$0 checkupdate [disttag]',
  description: 'Check whether need to update',
})
export class CheckUpdateCommand extends Command {
  @Option()
  disttag?: string;

  @Inject(ArtusInjectEnum.Config)
  config: typeof DefaultConfig;

  @Inject()
  updater: Updater;

  async run() {
    const { npmcheckupdate } = this.config;
    const policy = this.disttag || npmcheckupdate.upgradePolicy;

    const result = await this.updater.checkUpdate({
      upgradePolicy: policy,
      updateCache: false,
    });

    if (!result.needUpdate) {
      if (!result.targetVersion) {
        return console.info(`Unknown dist-tag: ${policy}, please check and try again.`);
      }

      return console.info('Already up to date.');
    }

    this.updater.displayUpgradeInfo(result);
  }
}