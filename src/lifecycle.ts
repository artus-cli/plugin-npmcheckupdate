import { Program, Inject, ApplicationLifecycle, LifecycleHook, LifecycleHookUnit, CommandContext, ArtusInjectEnum } from '@artus-cli/artus-cli';
import DefaultConfig from './config/config.default';
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
      await next();

      let enableInterceptor = false;
      if (typeof npmcheckupdate.enableInterceptor === 'function') {
        enableInterceptor = ctx.matched ? npmcheckupdate.enableInterceptor(ctx.matched.clz) : false;
      } else {
        enableInterceptor = npmcheckupdate.enableInterceptor;
      }

      if (!enableInterceptor) {
        return;
      }

      const upgradeInfo = await this.updater.checkUpdate();
      if (upgradeInfo?.needUpdate) {
        this.updater.displayUpgradeInfo(upgradeInfo);
      }
    });
  }
}
