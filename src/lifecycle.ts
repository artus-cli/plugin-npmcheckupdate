import { Program, Inject, ApplicationLifecycle, LifecycleHook, LifecycleHookUnit, CommandContext, ArtusInjectEnum } from '@artus-cli/artus-cli';
import DefaultConfig from './config/config.default';
import { UpgradeInfo } from './types';
import { Updater } from './updater';

@LifecycleHookUnit()
export default class NpmCheckUpdateLifecycle implements ApplicationLifecycle {
  @Inject()
  private readonly program: Program;

  @Inject(ArtusInjectEnum.Config)
  config: typeof DefaultConfig;

  @Inject()
  updater: Updater;

  @LifecycleHook()
  async configDidLoad() {
    const { npmcheckupdate } = this.config;
    if (!npmcheckupdate.enableInterceptor) {
      return;
    }

    this.program.use(async (ctx: CommandContext, next) => {
      let enableInterceptor = false;
      if (typeof npmcheckupdate.enableInterceptor === 'function') {
        enableInterceptor = ctx.matched ? npmcheckupdate.enableInterceptor(ctx.matched.clz) : false;
      } else {
        enableInterceptor = npmcheckupdate.enableInterceptor;
      }

      let upgradeInfo: UpgradeInfo | undefined;
      if (enableInterceptor) {
        upgradeInfo = await this.updater.checkUpdate();
      }

      await next();

      if (upgradeInfo?.needUpdate) {
        this.updater.displayUpgradeInfo(upgradeInfo);
      }
    });
  }
}
